// import {StyleSheet, Text, View, Image} from 'react-native';
// import React from 'react';
// import VideoPlayer from 'react-native-video-player'
// import {images} from '../../global/theme';
// const VideoPlayerReact = () => {

//   return (
//     <View>
//           <VideoPlayer
//     video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
//     videoWidth={1600}
//     videoHeight={900}
//     autoplay={true}
// />
//         {/* <Video
//     video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
//     videoWidth={1600}
//     videoHeight={900}
//     thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
// /> */}
//     {/* <Video controls={true} souce={{uri:"https://file-examples.com/storage/fe44eeb9cb66ab8ce934f14/2017/04/file_example_MP4_480_1_5MG.mp4"}} autoplay={false} defaultmuted={true} videoWidth={1500} videoHeight={1000} thumbnail={require('../../images/logo.png')} resizeMode="cover"/>
//     */}
// {/* <VideoPlayerNative
//     video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
//     videoWidth={1600}
//     videoHeight={900}
//     thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
// /> */}
//       {/* <Image source={images.SplashScreen} style={{width:'100%'}} /> */}
//     </View>
//   );
// };

// export default VideoPlayerReact;

// const styles = StyleSheet.create({});
import React from 'react';
import {View, Dimensions, StyleSheet, Text, Image} from 'react-native';
import VideoPlayer from 'react-native-video-player';
const {width, height} = Dimensions.get('window');
import st from '../../global/styles';
import {colors} from '../../global/theme';
const Video = ({route}) => {
  const {url, title, description, username, avatar} = route.params;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        paddingVertical: 20,
        width: width,
      }}>
      <VideoPlayer
        source={{
          uri: url,
        }}
        resizeMode="contain"
        autoplay
        showDuration
        controlsTimeout={3000}
        onError={e => console.log('Video error:', e)}
      />
      <View style={[st.pd10]}>
        <Text style={[st.tx16]}>{title}</Text>
        <Text style={[st.tx12, {color: 'grey'}]}>{description}</Text>
        <View>
          <View style={[st.justify_Row, {paddingVertical: 20}]}>
            <Image
              source={{uri: avatar}} // mock user avatar
              style={styles.avatar}
            />
            <Text style={styles.userName}>{username}</Text>
            {/* <Text style={styles.location}>{location}</Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Video;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    fontWeight: '300',
    fontSize: 14,
    color: colors.black,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 280,
    borderRadius: 10,
    marginVertical: 8,
  },
  footer: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  comment: {
    gap: 8,
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
