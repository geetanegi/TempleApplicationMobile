import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
  Button
} from 'react-native';
import React, {useState, useEffect} from 'react';
import st from '../../../global/styles';
import Header from '../../../components/Header';
import Share from 'react-native-share';
const Home = ({navigation}) => {
  // const StyledText = styled(Text);

  // backAction = () => {
  //   Alert.alert('Exit ?', 'Are you sure you want to exit ?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     {text: 'YES', onPress: () => BackHandler.exitApp()},
  //   ]);
  //   return true;
  // };


  const share = async () => {
    const options = {
      message:
        'hello this is a demo message',
      url: 'https://www.youtube.com/watch?v=wncM96HYcxw',
      email: 'geetanegi10917@gmail.com',
      subject: 'hello',
      recipient: '919755638573',
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
  return (
    <View style={[st.flex]}>
         <Header navigation={navigation} />
      {/* <Text style={tw`flex-1 justify-center`}>hello geeta</Text> */}
  {/* <Video/> */}
  {/* <View>
      <View style={{marginHorizontal: 40}}>
        <Button title="share" onPress={share} />
      </View>
    </View> */}
    {/* <QrScanner/> */}
    {/* <VideoPlayerReact/> */}
       {/* <QRCodeScanner
      onRead={({dats}) => alert(data)}
      flashMode={RNCamera.Constants.FlashMode.torch}
      reactivate={true}
      reactivateTimeout={500}
      /> */}
    </View>
  );
};

export default Home;
