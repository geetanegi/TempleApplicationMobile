import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import { Trash2, X } from 'lucide-react-native';
import { colors } from '../../../global/theme';
import { addStoryView, deleteStory } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

function getAvatarUriForUserId(userId) {
  if (userId == null) return null;
  const url = getProfilePictureUrlByUserId(userId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    const sep = resolved.includes('?') ? '&' : '?';
    return `${resolved}${sep}t=${Date.now()}`;
  }
  return null;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SEGMENT_HEIGHT = 2;
const SEGMENT_GAP = 3;

/** Build group boundaries: [0, 2, 5] means group 0 has indices 0-1, group 1 has 2-4. Groups are by same user. */
function buildGroupBoundaries(stories) {
  if (!stories?.length) return [0];
  const boundaries = [0];
  for (let i = 1; i < stories.length; i++) {
    const prev = stories[i - 1];
    const curr = stories[i];
    const prevUid = prev?.user?.id ?? prev?.userId;
    const currUid = curr?.user?.id ?? curr?.userId;
    if (prevUid !== currUid) boundaries.push(i);
  }
  return boundaries;
}

const StoryViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const { stories: initialStories = [], initialIndex = 0, currentUserId } = route.params ?? {};

  const [stories, setStories] = useState(initialStories);
  const [index, setIndex] = useState(initialIndex);
  const [recordingView, setRecordingView] = useState(false);

  const groupBoundaries = useMemo(() => buildGroupBoundaries(stories), [stories]);

  const { groupIndex, storyIndexInGroup, currentGroupSize } = useMemo(() => {
    let g = 0;
    for (let i = 0; i < groupBoundaries.length; i++) {
      if (index < groupBoundaries[i]) break;
      g = i;
    }
    const start = groupBoundaries[g];
    const end = g + 1 < groupBoundaries.length ? groupBoundaries[g + 1] : stories.length;
    return {
      groupIndex: g,
      storyIndexInGroup: index - start,
      currentGroupSize: end - start,
    };
  }, [index, groupBoundaries, stories.length]);

  const story = stories[index];
  const isOwnStory = story?.user?.id === currentUserId;

  const recordView = useCallback(async (storyId) => {
    if (!storyId || !currentUserId || recordingView) return;
    setRecordingView(true);
    try {
      await addStoryView(storyId, currentUserId);
    } catch (e) {
      // ignore
    } finally {
      setRecordingView(false);
    }
  }, [currentUserId, recordingView]);

  useEffect(() => {
    if (story?.id) {
      recordView(story.id);
    }
  }, [story?.id]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
  }, [groupIndex, currentGroupSize]);

  const goNext = useCallback(() => {
    if (index < stories.length - 1) {
      const next = index + 1;
      setIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      navigation.goBack();
    }
  }, [index, stories.length, navigation]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      const prev = index - 1;
      setIndex(prev);
      listRef.current?.scrollToIndex({ index: prev, animated: true });
    } else {
      navigation.goBack();
    }
  }, [index, navigation]);

  const handleDelete = useCallback(() => {
    if (!story || !isOwnStory) return;
    Alert.alert(
      'Delete story',
      'Are you sure you want to delete this story?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStory(story.id, currentUserId);
              const next = stories.filter((_, i) => i !== index);
              setStories(next);
              if (next.length === 0) {
                navigation.goBack();
                return;
              }
              const newIndex = index >= next.length ? next.length - 1 : index;
              setIndex(newIndex);
              listRef.current?.scrollToIndex({ index: newIndex, animated: false });
            } catch (e) {
              Alert.alert('Error', e?.message || 'Failed to delete story');
            }
          },
        },
      ]
    );
  }, [story, isOwnStory, currentUserId, stories, index, navigation]);

  const onMomentumScrollEnd = useCallback((e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIndex(Math.min(i, stories.length - 1));
  }, [stories.length]);

  const getItemLayout = useCallback((_, i) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * i,
    index: i,
  }), []);

  const renderStoryItem = useCallback(({ item: s, index: i }) => {
    const isVideo = (s.mediaType || '').toUpperCase() === 'VIDEO';
    const isActive = i === index;
    if (isVideo) {
      return (
        <View style={styles.storyPage}>
          <VideoPlayer
            source={{ uri: s.mediaUrl }}
            style={styles.media}
            resizeMode="contain"
            autoplay={isActive}
            showDuration
            controlsTimeout={3000}
            onEnd={goNext}
            onError={() => goNext()}
          />
        </View>
      );
    }
    return (
      <View style={styles.storyPage}>
        <Image source={{ uri: s.mediaUrl }} style={styles.media} resizeMode="contain" />
      </View>
    );
  }, [index, goNext]);

  if (!stories.length) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.emptyText}>No story to show</Text>
        <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <X size={24} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        ref={listRef}
        data={stories}
        keyExtractor={(item, index) => String(item?.id ?? `story-${index}`)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialScrollIndex={Math.min(initialIndex, stories.length - 1)}
        renderItem={renderStoryItem}
        decelerationRate="fast"
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: false });
          }, 100);
        }}
      />

      {/* Top: thin progress segments – only for current user's stories */}
      <View style={[styles.segmentBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.segmentRow}>
          {Array.from({ length: currentGroupSize }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                i === storyIndexInGroup ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {story?.user && (
        <View style={[styles.userHeaderOverlay, { top: insets.top + 8 + SEGMENT_HEIGHT + 6 }]}>
          {getAvatarUriForUserId(story.user.id ?? story.userId) ? (
            <Image
              key={getAvatarUriForUserId(story.user.id ?? story.userId)}
              source={{
                uri: getAvatarUriForUserId(story.user.id ?? story.userId),
                cache: 'reload',
                headers: { 'Cache-Control': 'no-cache' },
              }}
              style={styles.userHeaderAvatar}
            />
          ) : (
            <View style={[styles.userHeaderAvatar, { backgroundColor: '#555', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                {(story.user.name || story.user.username || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.userHeaderName} numberOfLines={1}>
            {story.user.name || story.user.username || 'Unknown'}
          </Text>
        </View>
      )}

      <Pressable style={styles.leftTouch} onPress={goPrev} />
      <Pressable style={styles.rightTouch} onPress={goNext} />

      {/* Top bar: user header on left (avatar+name in overlay above); close + delete on right */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 + SEGMENT_HEIGHT + 6 }]}>
        <View style={styles.topBarSpacer} />
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <X size={28} color="#fff" />
        </Pressable>
        <View style={styles.topRight}>
          {isOwnStory && story && (
            <Pressable style={styles.iconBtn} onPress={handleDelete}>
              <Trash2 size={24} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Bottom: view count */}
      {story && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.viewCount}>
            {story.viewCount ?? 0} {story.viewCount === 1 ? 'view' : 'views'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default StoryViewScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
  leftTouch: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.35,
    zIndex: 5,
  },
  rightTouch: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.35,
    zIndex: 5,
  },
  storyPage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  segmentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 12,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: SEGMENT_HEIGHT,
    borderRadius: 1,
    marginHorizontal: SEGMENT_GAP / 2,
  },
  segmentActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  segmentInactive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  userHeaderOverlay: {
    position: 'absolute',
    left: 16,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9,
  },
  userHeaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  userHeaderName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  topBarSpacer: {
    flex: 1,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  viewCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
