import React, {useRef} from 'react';
import {StyleSheet, FlatList, Dimensions, SafeAreaView} from 'react-native';
import PostCard from '../../../components/PostCard';
import SecondaryHeader from '../../../components/Header/secondaryHeader';

const {height, width} = Dimensions.get('window');

const PostScreen = ({route}) => {
  const {posts, initialIndex} = route.params;

  const flatListRef = useRef(null);
  return (
    <SafeAreaView style={styles.container}>
      {/* <SecondaryHeader title={'Posts'} /> */}
      <FlatList
        ref={flatListRef}
        keyExtractor={item => item.id.toString()}
        data={posts}
        contentContainerStyle={styles.postContainer}
        renderItem={({item, index}) => (
          <PostCard
            index={index}
            contentText={item.caption}
            image={item.url}
            avatar={item.url}
          />
        )}
        pagingEnabled
        horizontal={false} // Instagram uses vertical swipe
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: height,
          offset: (height / 2) * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    width: width,
  },
});
