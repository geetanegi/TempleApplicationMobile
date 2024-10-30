import {Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import st from '../../../global/styles';
import AuthHeader from '../../../components/Auth_Header';
import VideoPlayer from 'react-native-video-player'
const VideoPlayerComp = ({navigation}) => {
  return (
    <View style={[st.flex]}>
      <AuthHeader
        title={'Video Player'}
        onBack={() => navigation.navigate('Main')}
      />
      <Text>hello geeta</Text>
      <VideoPlayer
   source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
    videoWidth={1600}
    videoHeight={900}
 //   thumbnail={require('../../../images/logo.png')}
    autoplay={true}
    
/>
    </View>
  );
};

export default VideoPlayerComp;
