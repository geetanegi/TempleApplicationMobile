import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import st from '../../../global/styles';
import {User, MessageSquareMore} from 'lucide-react-native';
import {APP_TEXT, colors} from '../../../global/theme';
import React, {useEffect} from 'react';
import HeaderDashboard from '../../../components/dashboardHeader';
import InputText from '../../../components/InputText';
import CategoryButton from '../../../components/categoryButton';
import PostCard from '../../../components/PostCard';

const navs = [
  {icon: 'music', label: 'Song', navigateTo: 'SongScreen'},
  {icon: 'book', label: 'Story', navigateTo: 'StoryScreen'},
  {icon: 'image', label: 'Image', navigateTo: 'ImageScreen'},
  {icon: 'video', label: 'Video', navigateTo: 'VideoScreen'},
  {icon: 'map', label: 'Location', navigateTo: 'LocationScreen'},
];

// const posts = [
//   {
//     id: '1',
//     userName: 'Camila',
//     location: 'Mexico City, Mexico',
//     image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e',
//     likes: '5.4k',
//     comments: 165,
//     shares: 12,
//     avatar: 'https://i.pravatar.cc/101',
//   },
//   {
//     id: '2',
//     userName: 'John Doe',
//     location: 'Paris, France',
//     image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
//     likes: '2.3k',
//     comments: 87,
//     shares: 2,
//     avatar: 'https://i.pravatar.cc/102',
//   },
//   {
//     id: '3',
//     userName: 'Alicia',
//     location: 'Jaipur, India',
//     image:
//       'https://images.unsplash.com/photo-1756068785746-8aa1a82d2d1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8',
//     likes: '7.1k',
//     comments: 302,
//     shares: 120,
//     avatar: 'https://i.pravatar.cc/103',
//   },
// ];

const MainDashboard = () => {
  const [post, setPosts] = React.useState([]);

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
      console.log(res);

      const data = await res.json();
      const formatted = (data?.data || []).map(item => ({
        id: item.id,
        userName: item.user?.username || 'Unknown',
        location: item.user?.location || 'Unknown',
        image: item.photoUrl || item.videoUrl || null,
        likes: item.likes || 0,
        comments: item.comments || 0,
        shares: item.shares || 0,
        avatar: item.user?.userProfile || 'https://i.pravatar.cc/150',
        contentText: item.contentText,
        createdAt: item.createdAt,
      }));

      // 👇 assign API data to state
      setPosts(formatted); // Adjust if API returns in different key
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

      <HeaderDashboard
        title={APP_TEXT.HOME}
        LeftIcon={User}
        RightIcon={MessageSquareMore}
        leftNav={'Profiles'}
      />

      {/* Post FlatList */}
      <FlatList
        data={post}
        keyExtractor={item => item.id}
        style={[st.pd_H20]}
        renderItem={({item}) => (
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
        ListHeaderComponent={
          <View style={[st.mt_B10]}>
            <InputText
              placeholder={APP_TEXT.SEARCH}
              iconName={'search'}
              onFocus={() => Alert.alert('Clicked!')}
            />
            <FlatList
              data={navs}
              keyExtractor={item => item.label}
              renderItem={({item}) => (
                <CategoryButton
                  icon={item.icon}
                  label={item.label}
                  navigateTo={item.navigateTo}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                st.mt_t10,
                st.wdh100,
                st.justify_S,
                st.pv10,
              ]}
            />
          </View>
        }
        contentContainerStyle={[st.pdB20]} // ✅ prevents last card being cut
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default MainDashboard;
