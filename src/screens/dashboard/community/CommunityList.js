import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  ImageBackground,
  Image,
  BackHandler,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../../../components/Header';
import st from '../../../global/styles';
import {colors, images} from '../../../global/theme';
import CommunityCard from './CommunityCard';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import Loader from '../../../components/loader';
import EmptyItem from '../../../components/component-parts/emptyItem';
import Icon from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import { API } from '../../../utils/endpoints';
import { postAuth } from '../../../utils/apicalls/postApi';

const Community = ({navigation}) => {
  const [search, setSearch] = useState('');
  const isConnected = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState();
  const [filteredDataSource1, setFilteredDataSource1] = useState();


  const getAllProfile = useCallback(async () => {
    try {
      const url = API.GET_ALL_PROFILE;
      const params = {
        searchParams: {
          activeStatus: 'AC',
        },
      };

      const result = await postAuth(url, params);
      setFilteredDataSource(result?.data?.content || []);
      setFilteredDataSource1(result?.data?.content || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log('Error fetching profiles:', err);
    }
  }, []);

  const startSync = useCallback(async () => {
    if (isConnected) {
      setIsLoading(true);
      setSearch('');
      await getAllProfile();
   
    } else {
      setIsLoading(false);
    }
  }, [isConnected, getAllProfile]);

  // Initial data fetch when the component mounts
  useEffect(() => {
    startSync();
  }, [startSync]);

  // Data fetch when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      startSync();
      return () => {
        // Cleanup if necessary
      };
    }, [startSync])
  );

  const searchFilterFunction = text => {
  //  const cleanedText = text.replace(/\s+/g, ''); // Remove spaces

  //  console.log('-----cleantesttt',text)
    //setResult(cleanedText);
    setSearch(text);
    filterRecords(text);
  };
  const filterRecords = searchText => {
    // const searchText = searchText1.trim();
    // If there is a search text, filter the data
    if (searchText) {
      // Filter data based on firstName, lastName, or username
      const newData = filteredDataSource1.filter(item => {
        const itemData = item?.firstName ? item.firstName.toUpperCase() : '';
        const itemDataLastname = item?.lastName ? item.lastName.toUpperCase() : '';
        const itemDataUsername = item?.username ? item.username.toUpperCase() : '';
        const textData = searchText.toUpperCase();
  
        // Return items matching the search text
        return (
          itemData.indexOf(textData) > -1 ||
          itemDataLastname.indexOf(textData) > -1 ||
          itemDataUsername.indexOf(textData) > -1
        );
      });
  
  
      // Set the filtered data as the data source
      setFilteredDataSource(newData);
    } else {
      // If search text is cleared, reset to the original unfiltered data
      setFilteredDataSource(filteredDataSource1);
    }
  };

  const ListEmptyComponent = () => {
    if(!isLoading){
    return (
      <View style={[st.center, {marginTop: '50%'}, st.row]}>
        <Icons color={colors.lightgrey} name="exclamation-circle" size={40} />
        <Text style={[st.tx14No, st.ml_15, {color: colors.lightgrey}]}>
          No User Found
        </Text>
      </View>
    );
  }else{
    <></>
  }
  };
  return (
    <View style={[st.flex]}>
      <Header navigation={navigation} title={'Communities'} />
      <ImageBackground style={{flex: 1}} source={images.bg1}>
        <View style={styles.overlay} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.inputStyle}
            placeholder="User Search"
            placeholderTextColor="#9E9E9E"
            onChangeText={text => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
          />
          <FontAwesome
            name="search"
            size={20}
            color="#9E9E9E"
            style={styles.iconStyle}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginBottom:80
          }}>
          <FlatList
            data={filteredDataSource}
            renderItem={({item}) => <CommunityCard item={item} navigation={navigation} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
             ListEmptyComponent={ListEmptyComponent}
          />
        </View>

      </ImageBackground>
      {isLoading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || -65,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Apply the opacity here
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: colors.blue,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: colors.grey,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    margin: 20,
  },
  inputStyle: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  iconStyle: {
    marginLeft: 10,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  listContainer: {
    padding: 1,
  },
});

export default Community;
