import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  ImageBackground,
} from 'react-native';
import Header from '../../../components/Header';
import st from '../../../global/styles';
import {APP_TEXT, colors, images} from '../../../global/theme';
import CommunityCard from './CommunityCard';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import Loader from '../../../components/loader';
import Icons from 'react-native-vector-icons/FontAwesome';
import { getAllPlayerList } from '../../../utils/apicalls/communityHandler';

const Community = ({navigation}) => {
  const [search, setSearch] = useState('');
  const isConnected = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState();
  const [filteredDataSource1, setFilteredDataSource1] = useState();

  const handleAllPlayerList = async () => {
    try {
      const playerListData = await getAllPlayerList();
      if (playerListData?.error) {
        setIsLoading(false);
    } else {
      setFilteredDataSource(playerListData?.data?.content || []);
      setFilteredDataSource1(playerListData?.data?.content || []);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };

  const startSync = () => {
    if (isConnected) {
      setIsLoading(true);
      setSearch('');
      handleAllPlayerList();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startSync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      startSync();
      return () => {
        // Cleanup if necessary
      };
    }, [])
  );

  const searchFilterFunction = text => {
    setSearch(text);
    filterRecords(text);
  };
  const filterRecords = searchText => {
    if (searchText) {
      const newData = filteredDataSource1.filter(item => {
        const itemData = item?.firstName ? item.firstName.toUpperCase() : '';
        const itemDataLastname = item?.lastName ? item.lastName.toUpperCase() : '';
        const itemDataUsername = item?.username ? item.username.toUpperCase() : '';
        const textData = searchText.toUpperCase();
        return (
          itemData.indexOf(textData) > -1 ||
          itemDataLastname.indexOf(textData) > -1 ||
          itemDataUsername.indexOf(textData) > -1
        );
      });
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(filteredDataSource1);
    }
  };

  const ListEmptyComponent = () => {
    if(!isLoading){
    return (
      <View style={[st.center, {marginTop: '50%'}, st.row]}>
        <Icons color={colors.lightgrey} name="exclamation-circle" size={40} />
        <Text style={[st.tx14No, st.ml_15, {color: colors.lightgrey}]}>
          {APP_TEXT.NO_PLAYER_FOUND}
        </Text>
      </View>
    );
  }else{
    <></>
  }
  };
  return (
    <View style={[st.flex]}>
      <Header
        drawerIcon={true}
        navigation={navigation}
        title={APP_TEXT.USER}
      />
      <ImageBackground style={{flex: 1}} source={images.communitybg}>
        <View style={st.listoverlay} />
        <View style={st.listsearchContainer}>
          <TextInput
            style={st.listinputStyle}
            placeholder={APP_TEXT.PLAYER_SEARCH}
            placeholderTextColor={APP_TEXT.SEARCH_TEXT_COLOR}
            onChangeText={text => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid={colors.TRANSPARENT}
          />
          <Icons
            name={APP_TEXT.SEARCH}
            size={20}
            color={APP_TEXT.SEARCH_TEXT_COLOR}
            style={st.listiconStyle}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginBottom: 80,
          }}>
          <FlatList
            data={filteredDataSource}
            renderItem={({item}) => (
              <CommunityCard item={item} navigation={navigation} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={st.listlistContainer}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </ImageBackground>
      {isLoading && <Loader />}
    </View>
  );
};


export default Community;
