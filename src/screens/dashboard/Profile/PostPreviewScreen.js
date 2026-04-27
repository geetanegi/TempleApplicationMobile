import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import PostCard from '../../../components/PostCard';
import { getPostById, deletePost } from '../../../utils/apicalls/socialHandler';
import { getProfilePictureUrlByUserId, getProfilePictureUpdatedAt } from '../../../utils/apicalls/profileHandler';
import { getUserId } from '../../../redux/store/getState';
import { colors } from '../../../global/theme';

const COLORS = {
  text: '#1B1B1B',
  orange: '#D48A4A',
  bg: '#FFFFFF',
};

export default function PostPreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params || {};
  const currentUserId = getUserId();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarCacheBuster, setAvatarCacheBuster] = useState(null);
  const [focusBuster, setFocusBuster] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusBuster((b) => b + 1);
      if (currentUserId) {
        getProfilePictureUpdatedAt(currentUserId).then(setAvatarCacheBuster);
      }
      return () => {};
    }, [currentUserId]),
  );

  const cacheBuster = avatarCacheBuster ?? focusBuster;

  const loadPost = useCallback(async () => {
    if (!postId) {
      setError('No post ID');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getPostById(postId, currentUserId);
      const item = res?.data;
      if (!item) {
        setError('Post not found');
        setPost(null);
        return;
      }
      const authorId = item.user?.id ?? item.userId;
      let avatarUrl = getProfilePictureUrlByUserId(authorId) || 'https://i.pravatar.cc/150';
      setPost({
        id: String(item.id),
        postId: item.id,
        authorUserId: authorId,
        userName: item.user?.name || item.user?.username || 'Unknown',
        createdAt: item.createdAt,
        image: item.photoUrl || null,
        videoUrl: item.videoUrl || null,
        thumbnailUrl: item.thumbnailUrl || null,
        likes: item.likesCount ?? item.likes ?? 0,
        comments: item.commentsCount ?? item.comments ?? 0,
        shares: item.sharesCount ?? item.shares ?? 0,
        avatar: avatarUrl,
        contentText: item.contentText || '',
        isLiked: !!item.isLiked,
        isShared: !!item.isShared,
      });
    } catch (e) {
      console.warn('Post preview load error:', e);
      setError(e?.message || 'Failed to load post');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId, currentUserId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.orange} />
        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Post not found'}</Text>
        <Pressable style={styles.backBtnFull} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Post
        </Text>
        <View style={styles.headerBack} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
   
        <PostCard
          expandMedia
          postId={post.postId}
          authorUserId={post.authorUserId}
          currentUserId={currentUserId}
          userName={post.userName}
          createdAt={post.createdAt}
          image={post.image}
          videoUrl={post.videoUrl}
          thumbnailUrl={post.thumbnailUrl}
          likes={post.likes}
          comments={post.comments}
          shares={post.shares}
          avatar={
            post.authorUserId === currentUserId && cacheBuster
              ? `${post.avatar}${post.avatar.includes('?') ? '&' : '?'}t=${cacheBuster}`
              : post.avatar
          }
          contentText={post.contentText}
          initialIsLiked={post.isLiked}
          initialIsShared={post.isShared}
          onAuthorPress={(authorUserId) =>
            navigation.navigate('Profiles', { userId: authorUserId })
          }
          onDelete={() => {
            Alert.alert(
              'Delete post',
              'Are you sure you want to delete this post? The photo or video will be removed.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deletePost(post.postId, currentUserId);
                      navigation.goBack();
                    } catch (e) {
                      Alert.alert('Error', e?.data?.message || e?.message || 'Failed to delete post');
                    }
                  },
                },
              ]
            );
          }}
        />
  
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.bg,
  },
  headerBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  cardWrap: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  errorText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  backBtnFull: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
