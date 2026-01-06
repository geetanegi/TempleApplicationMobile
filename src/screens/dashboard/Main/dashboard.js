import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  Image,
  Pressable,
} from 'react-native';
import st from '../../../global/styles';
import { Menu, Bell, MessageCircle, Plus } from 'lucide-react-native';
import { APP_TEXT, colors } from '../../../global/theme';
import HeaderDashboard from '../../../components/dashboardHeader';
import PostCard from '../../../components/PostCard';
import SearchInput from './SearchInput';

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
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');

  async function getPosts() {
    try {
      const res = await fetch(
        'http://13.203.150.178:8080/jain-app/user/social/posts',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer api-EEXM2IGOAwKhQPwbLqg_Oqw',
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await res.json();

      const formatted = (data?.data || []).map(item => ({
        id: String(item.id),
        userName: item.user?.username || 'Unknown',
        location: item.user?.location || 'Unknown',
        image: item.photoUrl || item.videoUrl || null,
        likes: item.likes || 0,
        comments: item.comments || 0,
        shares: item.shares || 0,
        avatar: item.user?.userProfile || 'https://i.pravatar.cc/150',
        contentText: item.contentText || '',
        createdAt: item.createdAt,
      }));

      setPosts(formatted);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }

  useEffect(() => {
    getPosts();
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
    <SafeAreaView style={styles.screen}>
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
<View style={[st.pd_H20, st.mt_B10]}>
  <SearchInput
    value={searchText}
    onChangeText={setSearchText}
    placeholder={APP_TEXT.SEARCH}
  />
</View>
      <View style={[st.pd_H20, st.mt_B10]}>
      <StoriesRow />
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        style={[st.pd_H20]}
        renderItem={({ item }) => (
          <PostCard
            userName={item.userName}
            location={item.location}
            image={item.image}
            likes={item.likes}
            comments={item.comments}
            shares={item.shares}
            avatar={item.avatar}
            contentText={item.contentText}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[st.pdB20]}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
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
