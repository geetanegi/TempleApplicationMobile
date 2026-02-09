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
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from '../../../components/PostCard';
import { getPostById, deletePost } from '../../../utils/apicalls/socialHandler';
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
      setPost({
        id: String(item.id),
        postId: item.id,
        authorUserId: item.user?.id ?? item.userId,
        userName: item.user?.username || item.user?.name || 'Unknown',
        createdAt: item.createdAt,
        image: item.photoUrl || null,
        videoUrl: item.videoUrl || null,
        likes: item.likesCount ?? item.likes ?? 0,
        comments: item.commentsCount ?? item.comments ?? 0,
        shares: item.sharesCount ?? item.shares ?? 0,
        avatar: item.user?.userProfile || item.user?.profileImageUrl || 'https://i.pravatar.cc/150',
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
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
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
          postId={post.postId}
          authorUserId={post.authorUserId}
          currentUserId={currentUserId}
          userName={post.userName}
          createdAt={post.createdAt}
          image={post.image}
          videoUrl={post.videoUrl}
          likes={post.likes}
          comments={post.comments}
          shares={post.shares}
          avatar={post.avatar}
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
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
