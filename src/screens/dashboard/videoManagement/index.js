import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';

const screenWidth = Dimensions.get('window').width;

const videos = [
  {
    id: '1',
    title: 'Sample Video 1',
    videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUri: 'https://stacecam001.blob.core.windows.net/acecamdev/dev%2Fplayer%2Frequest-video%2F453dc6e0-358f-4f8e-9ec6-7b3b43b0af71.png?sv=2024-05-04&spr=https&se=2025-10-10T13%3A28%3A10Z&sr=b&sp=rd&sig=vi1crvF5i3dsK7nWho73XYYTDPcl75aOi5Av2%2BKH3Sg%3D',
  },
  {
    id: '2',
    title: 'Sample Video 2',
    videoUri: 'https://www.w3schools.com/html/movie.mp4',
    thumbnailUri: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Video+2',
  },
  {
    id: '3',
    title: 'Sample Video 3',
    videoUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUri: 'https://via.placeholder.com/150/008000/FFFFFF?text=Video+3',
  },
  // Add more video objects
];

const VideoList = () => {
  const [activeVideo, setActiveVideo] = useState(null); // Track the active video

  const togglePlayPause = useCallback(
    (videoId) => {
      setActiveVideo(activeVideo === videoId ? null : videoId); // Toggle active video
    },
    [activeVideo]
  );

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => togglePlayPause(item.id)}>
        <VideoPlayer
            video={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // Test video URL
            videoWidth={screenWidth}
            videoHeight={screenWidth * 0.5625} // 16:9 aspect ratio
            autoplay={true} // Autoplay the video
            controls={true}// Play only if it's the active video
        />
      </TouchableOpacity>

      {/* Additional video metadata (like title, views, etc.) */}
      <View style={styles.metaContainer}>
        <Image
          source={{ uri: item.thumbnailUri }}
          style={styles.thumbnail}
        />
        <View style={styles.metaInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoViews}>53K views</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  cardContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  metaContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  metaInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoViews: {
    fontSize: 14,
    color: '#666',
  },
});

export default VideoList;
