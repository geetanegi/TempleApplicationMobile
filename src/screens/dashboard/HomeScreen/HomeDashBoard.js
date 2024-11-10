// import {
//   StyleSheet,
//   View,
//   BackHandler,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { images, APP_TEXT, NAVIGATION } from '../../../global/theme';
// import Loader from '../../../components/loader';
// import Header from '../../../components/Header';
// import { useFocusEffect } from '@react-navigation/native';
// import useNetworkStatus from '../../../hooks/networkStatus';
// import st from '../../../global/styles';

// const Dashboard = ({ navigation, route }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const isConnected = useNetworkStatus();

  

//   const handleBackPress = () => {
//     navigation.goBack()
//     return true;
//   };

 

//   return (
//     <View style={st.flex}>
//       <Header
//         drawerIcon={true}
//         leftImg={images.LeftCourceImg}
//         navigation={navigation}
//         title={APP_TEXT.HOME}
//         backIcon={false}
//       />
    
//     </View>
//   );
// };

// export default Dashboard;



import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { APP_TEXT, images } from '../../../global/theme';
import Share from 'react-native-share';
import Header from '../../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { GitCommitVertical, MessageCircle, Share2, ThumbsUp } from 'lucide-react-native';

const videosData = [
  {
    id: '1',
    image: 'https://via.placeholder.com/150',
    title: 'Shot-of-the-Week',
    user: 'Michael DeTizio',
    views: '53K Views',
    likes: '12 Likes',
    date: '01/10/2024',
    duration: '8:15',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/150',
    title: 'Shot-of-the-Week',
    user: 'Michael DeTizio',
    views: '53K Views',
    likes: '45 Likes',
    date: '01/10/2024',
    duration: '8:15',
  },
];



const Dashboard = ({navigation}) => {

  const share = async () => {
    const options = {
      // message:
      //   'hello this is a demo message',
      url: 'https://www.youtube.com/watch?v=wncM96HYcxw',
      // email: 'geetanegi10917@gmail.com',
      // subject: 'hello',
      // recipient: '919755638573',
    };

    try {
      const res = await Share.open(options);
      console.log(res);
    } catch (err) {
      console.log(err);
    }

    // Share.open(options)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
  };

  const VideoCard = ({ video }) => {
    return (
      <View style={styles.card}>
        {/* Video Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: video.image }} style={styles.thumbnail} />
          <Text style={styles.duration}>{video.duration}</Text>
          <View style={styles.playIcon}>
            <Icon name="play-circle" size={30} color="#fff" />
          </View>
        </View>
  
        {/* Video Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{video.user}</Text>
          <Text style={styles.title}>{video.title}</Text>
          <Text style={styles.metaData}>
            {video.views} • {video.likes} • {video.date}
          </Text>
  
          {/* Actions Row */}
          <View style={styles.actionsRow}>
          <View style={styles.iconWithBadge}>
            <MessageCircle   strokeWidth={1} size={20} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <ThumbsUp strokeWidth={1} size={20} color="#fff" style={styles.actionIcon} />
          <TouchableOpacity onPress={share}>
          <Share2 strokeWidth={1} size={20} color="#fff" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  };







  return (
    <ScrollView style={styles.container}>
         <Header
        drawerIcon={true}
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={APP_TEXT.HOME}
        backIcon={false}
      /> 
      {/* Header */}

      {/* Shot of the Week Section */}
      <View style={styles.headerContainer}>
      <Text style={styles.titleText}>Shot of the Week</Text>
      <TouchableOpacity >
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
<FlatList
      horizontal
      data={videosData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VideoCard video={item} />}
      contentContainerStyle={styles.listContainer}
    />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFF',
  },  listContainer: {
    paddingLeft: 10,
  },  card: {
    width: 160,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 100,
  },
  duration: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 12,
  },
  playIcon: {
    position: 'absolute',
    top: '35%',
    left: '35%',
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#222',
  },
  username: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  metaData: {
    fontSize: 12,
    color: '#777',
  },
  actionsRow: {
      flexDirection: 'row',
      alignSelf: 'flex-end', // Align buttons to the right
      marginTop: 10,
  
  },
  iconWithBadge: {
    position: 'relative',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  actionIcon: {
    marginLeft: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF7F50', // Coral color like in the image
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStats: {
    fontSize: 12,
    color: 'gray',
  },
  icon: {
    width: 25,
    height: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  videoCard: {
    width: 150,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 8,
  },
  videoImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  videoStats: {
    fontSize: 12,
    color: 'gray',
  },
  videoDate: {
    fontSize: 10,
    color: 'gray',
  },
  contestsSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  holeInfo: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 5,
  },
  contestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  contestTitle: {
    fontSize: 14,
  },
  entryFee: {
    fontSize: 12,
    color: 'gray',
  },
  payout: {
    fontSize: 12,
    color: 'gray',
  },
  timeInfo: {
    marginTop: 10,
  },
  timeText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default Dashboard;
