import {
    StyleSheet,
    View,
    BackHandler,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import { images, APP_TEXT, NAVIGATION } from '../../../global/theme';
  import Loader from '../../../components/loader';
  import Header from '../../../components/Header';
  import { useFocusEffect } from '@react-navigation/native';
  import useNetworkStatus from '../../../hooks/networkStatus';
  import st from '../../../global/styles';
  
  const HighlightHub = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isConnected = useNetworkStatus();
  
    
  
    const handleBackPress = () => {
      navigation.goBack()
      return true;
    };
  
   
  
    return (
      <View style={st.flex}>
        <Header
          drawerIcon={true}
          leftImg={images.LeftCourceImg}
          navigation={navigation}
          title={APP_TEXT.HOME}
          backIcon={false}
        />
      
      </View>
    );
  };
  
  export default HighlightHub;