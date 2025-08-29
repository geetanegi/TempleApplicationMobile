import React, {useRef, useState} from 'react';
import {View, Dimensions, FlatList, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const {height, width} = Dimensions.get('window');

const videos = [
  {id: '1', url: 'https://www.w3schools.com/html/mov_bbb.mp4'},
  {id: '2', url: 'https://www.w3schools.com/html/movie.mp4'},
  {
    id: '3',
    url: 'https://www.pexels.com/download/video/6296290/',
  },
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={videos}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (
        <View style={styles.videoContainer}>
          <Video
            source={{uri: item.url}}
            style={styles.video}
            resizeMode="cover"
            repeat
            paused={currentIndex !== index}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            poster="https://dummyimage.com/1080x1920/000/fff.jpg&text=Loading..."
            posterResizeMode="cover" // Only play current video
          />
        </View>
      )}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    width: width,
    backgroundColor: 'black',
  },
  video: {
    height: '100%',
    width: '100%',
  },
});
