import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import { Trash2, X } from 'lucide-react-native';
import { addStoryView, deleteStory } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, resolveProfilePictureUrl } from '../../../utils/apicalls/profileHandler';

function getAvatarUriForUserId(userId) {
  if (userId == null) return null;
  const url = getProfilePictureUrlByUserId(userId);
  const resolved = resolveProfilePictureUrl(url || '');
  if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
    return resolved;
  }
  return null;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SEGMENT_HEIGHT = 2;
const SEGMENT_GAP = 3;

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

const StoryMediaClip = React.memo(({ story, isActive, width, height, onVideoEnd }) => {
  const [videoReady, setVideoReady] = useState(false);
  const isVideo = (story.mediaType || '').toUpperCase() === 'VIDEO';
  const mediaStyle = [styles.mediaFill, { width, height }];

  useEffect(() => {
    setVideoReady(false);
  }, [story.id, story.mediaUrl]);

  if (isVideo) {
    return (
      <View style={[styles.mediaClip, { width, height }]} collapsable={false}>
        {!videoReady ? (
          <View style={[mediaStyle, styles.mediaPlaceholder]} />
        ) : null}
        <Video
          source={{ uri: story.mediaUrl }}
          style={[mediaStyle, { opacity: videoReady ? 1 : 0 }]}
          resizeMode="contain"
          repeat={false}
          paused={!isActive}
          controls={false}
          onReadyForDisplay={() => setVideoReady(true)}
          onLoad={() => setVideoReady(true)}
          onEnd={onVideoEnd}
          onError={onVideoEnd}
        />
      </View>
    );
  }

  return (
    <View style={[styles.mediaClip, { width, height }]} collapsable={false}>
      <Image
        source={{ uri: story.mediaUrl }}
        style={mediaStyle}
        resizeMode="contain"
        fadeDuration={0}
      />
    </View>
  );
});

const StoryViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
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
  const avatarUri = story?.user ? getAvatarUriForUserId(story.user.id ?? story.userId) : null;

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
    const i = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setIndex(Math.min(i, stories.length - 1));
  }, [stories.length, screenWidth]);

  const getItemLayout = useCallback((_, i) => ({
    length: screenWidth,
    offset: screenWidth * i,
    index: i,
  }), [screenWidth]);

  const renderStoryItem = useCallback(({ item: s, index: i }) => (
    <View style={[styles.storyPage, { width: screenWidth, height: screenHeight }]}>
      <StoryMediaClip
        story={s}
        isActive={i === index}
        width={screenWidth}
        height={screenHeight}
        onVideoEnd={goNext}
      />
    </View>
  ), [index, goNext, screenWidth, screenHeight]);

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
        style={styles.list}
        data={stories}
        keyExtractor={(item, itemIndex) => String(item?.id ?? `story-${itemIndex}`)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialScrollIndex={Math.min(initialIndex, stories.length - 1)}
        renderItem={renderStoryItem}
        decelerationRate="fast"
        removeClippedSubviews={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: false });
          }, 100);
        }}
      />

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
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.userHeaderAvatar}
              fadeDuration={0}
            />
          ) : (
            <View style={[styles.userHeaderAvatar, { backgroundColor: '#555', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                {(story.user.name || story.user.username || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.userHeaderName}>
            {story.user.name || story.user.username || 'Unknown'}
          </Text>
        </View>
      )}

      <Pressable style={styles.leftTouch} onPress={goPrev} />
      <Pressable style={styles.rightTouch} onPress={goNext} />

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
  list: {
    flex: 1,
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
    width: '35%',
    zIndex: 5,
  },
  rightTouch: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '35%',
    zIndex: 5,
  },
  storyPage: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  mediaClip: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  mediaFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  mediaPlaceholder: {
    backgroundColor: '#000',
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
    alignItems: 'flex-start',
    zIndex: 9,
  },
  userHeaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 2,
    overflow: 'hidden',
  },
  userHeaderName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    flexShrink: 1,
    lineHeight: 18,
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
