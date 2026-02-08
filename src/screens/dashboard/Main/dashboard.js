import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import st from '../../../global/styles';
import { Menu, Bell, MessageCircle, Plus, User } from 'lucide-react-native';
import { APP_TEXT, colors } from '../../../global/theme';
import HeaderDashboard from '../../../components/dashboardHeader';
import PostCard from '../../../components/PostCard';
import SearchInput from './SearchInput';
import { getAllPosts } from '../../../utils/apicalls/socialHandler';
import { getUserId } from '../../../redux/store/getState';

const storiesData = [
  { id: 'add' },
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1524503033411-f9f3a9a61f5c?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60',
  },
];

const MainDashboard = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = getUserId();

  const loadPosts = useCallback(async () => {
    try {
      const res = await getAllPosts(currentUserId);
      const raw = res?.data ?? [];

      const formatted = (Array.isArray(raw) ? raw : []).map(item => ({
        id: String(item.id),
        postId: item.id,
        authorUserId: item.user?.id ?? item.userId,
        userName: item.user?.username || item.user?.name || 'Unknown',
        location: item.user?.location || 'Unknown',
        image: item.photoUrl || item.videoUrl || null,
        likes: item.likesCount ?? item.likes ?? 0,
        comments: item.commentsCount ?? item.comments ?? 0,
        shares: item.sharesCount ?? item.shares ?? 0,
        avatar: item.user?.userProfile || item.user?.profileImageUrl || 'https://i.pravatar.cc/150',
        contentText: item.contentText || '',
        createdAt: item.createdAt,
        isLiked: !!item.isLiked,
        isShared: !!item.isShared,
      }));

      setPosts(formatted);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setRefreshing(false);
    }
  }, [currentUserId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    loadPosts();
  }, []);

  // ✅ Filter posts by search text (username, location, content)
  const filteredPosts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter(p => {
      const haystack = [p.userName, p.location, p.contentText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [posts, searchText]);


  const StoriesRow = () => (
    <FlatList
      data={storiesData}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => item?.id ?? String(index)}
      contentContainerStyle={styles.storiesContainer}
      renderItem={({ item, index }) => {
        if (index === 0) {
          return (
            <Pressable style={styles.addTile} onPress={() => {}}>
              <User size={36} color="#fff" fill="#fff" />
              <View style={styles.addPlus}>
                <Plus size={18} color={colors.DARK_BLACK} />
              </View>
            </Pressable>
          );
        }

        // thumbnails
        return (
          <Image
            source={{ uri: item.image }}
            style={styles.storyImg}
            resizeMode="cover"
          />
        );
      }}
    />
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <HeaderDashboard
        title="JainSansaar"
        LeftIcon={Menu}
        RightIcon1={Bell}
        RightIcon2={MessageCircle}
        leftNav="HomeDrawer"
        rightNav1="Notifications"
        rightNav2="Chat"
      />

      <View style={styles.content}>
        <View style={[st.pd_H20, st.mt_B10]}>
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={APP_TEXT.SEARCH}
            editable={false}
            onPress={() => navigation.navigate('SearchScreen')}
          />
        </View>
        <View style={[st.pd_H20, st.mt_B10]}>
          <StoriesRow />
        </View>
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          style={styles.postList}
          contentContainerStyle={[st.pd_H20, st.pdB20, { paddingBottom: 90 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.PRIMARY_BUTTON]}
              tintColor={colors.PRIMARY_BUTTON}
            />
          }
          renderItem={({ item }) => (
            <PostCard
              postId={item.postId}
              authorUserId={item.authorUserId}
              currentUserId={currentUserId}
              userName={item.userName}
              location={item.location}
              image={item.image}
              likes={item.likes}
              comments={item.comments}
              shares={item.shares}
              avatar={item.avatar}
              contentText={item.contentText}
              initialIsLiked={item.isLiked}
              initialIsShared={item.isShared}
              onLikeChange={(newLiked, newCount) => {
                setPosts(prev =>
                  prev.map(p =>
                    p.postId === item.postId ? { ...p, isLiked: newLiked, likes: newCount } : p
                  )
                );
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  postList: {
    flex: 1,
  },

  // ✅ Stories row styles
  storiesContainer: {
    paddingVertical: 14,
    gap: 12,
  },
  addTile: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlus: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyImg: {
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
});

export default MainDashboard;
