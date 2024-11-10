import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {API} from '../../../utils/endpoints';
import {postAuth} from '../../../utils/apicalls/postApi';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import Header from '../../../components/Header';
import TabSwitch from './TabSwitch';
import PlayerVideo from './PlayerVideo';
import { APP_TEXT, images } from '../../../global/theme';
import { getAllPublishedVideo, getAllRequestedVideo, getAllVideo, unpublishData } from '../../../utils/apicalls/highlightHubHandler';

const publishedData = [
  // {id: '1', uri: 'https://via.placeholder.com/150'},
  // {id: '2', uri: 'https://via.placeholder.com/150'},
  // {id: '3', uri: 'https://via.placeholder.com/150'},
  // {id: '4', uri: 'https://via.placeholder.com/150'},
  // {id: '5', uri: 'https://via.placeholder.com/150'},
  // {id: '6', uri: 'https://via.placeholder.com/150'},
];

const requestData = [
  // {id: '1', uri: 'https://via.placeholder.com/150', vediRequest: 'REQUEST'},
  // {id: '2', uri: 'https://via.placeholder.com/150', vediRequest: 'PENDING'},
  // {id: '3', uri: 'https://via.placeholder.com/150', vediRequest: 'RE_REQUEST'},
];

const allData = [
  // {id: '1', uri: 'https://via.placeholder.com/150'},
  // {id: '2', uri: 'https://via.placeholder.com/150'},
  // {id: '3', uri: 'https://via.placeholder.com/150'},
  // {id: '4', uri: 'https://via.placeholder.com/150'},
  // {id: '5', uri: 'https://via.placeholder.com/150'},
  // {id: '6', uri: 'https://via.placeholder.com/150'},
  // {id: '7', uri: 'https://via.placeholder.com/150'},
  // {id: '8', uri: 'https://via.placeholder.com/150'},
];

const VedioHighlights = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Published');
  const [playerData, setPlayerData] = useState();
  const [videoData, setVideoData] = useState();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [deletePopUP, setDeletePopUP] = useState(false);
  const isConnected = useNetworkStatus();
  const onDeleteVedioClick = (modalStatus, itemID, arrayData) => {
    console.log('inside delete button->', modalStatus);
    console.log('item->', itemID);
    console.log('arrayData->', arrayData);

    setFilterVisible(!modalStatus);
    if(!modalStatus){
     }
  };

  const toggleFilterModal = data => {
    console.log('toggleFilterModal->', data);
    setFilterVisible(!data);
    // if(!data){
    //   _onDeleteVedioModalClick();
    // }
   };

  const _tabFilterModal = data => {
    console.log('_tabFilterModal->', data);
    setFilterModalVisible(!data);
  };

  const _onRequestModalClick = data => {
    console.log('_onRequestModalClick->', data);
    setRequestVisible(!data);
    setDeletePopUP(false)
  };

  const _onDeleteVedioModalClick = data => {
    console.log('_onDeleteVedioModalClick->', data);
    setDeletePopUP(!deletePopUP);
   };

  

  const handleVedioEvent = data => {
     alert(data);
  };

  const handleTabClick = data => {
    setSelectedTab(data);
   // console.log('-------------dataaa----select tab-------',data)
    data === 'Published'
      ? handleAllPublishedVideo()
      : data === 'Request'
      ? handleAllPublishedVideo()
      : handleAllVideo();
  };



  const handleAllPublishedVideo = async () => {
    try {
      const publishedVideo = await getAllPublishedVideo();
      if (publishedVideo?.error) {
        setIsLoading(false);
    } else {
    //  console.log('-----dataaa-----publishedVideo--',publishedVideo?.data)
      setVideoData(publishedVideo?.data || []);
   // setFilteredDataSource1(playerListData?.data?.content || []);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };


  const handleAllRequestedVideo = async () => {
    try {
      const publishedVideo = await getAllRequestedVideo();
      if (publishedVideo?.error) {
        setIsLoading(false);
    } else {
      console.log('-----dataaa-----publishedVideo-getAllRequestedVideo-',publishedVideo?.data)
      setVideoData(publishedVideo?.data || []);
   // setFilteredDataSource1(playerListData?.data?.content || []);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };

  const handleAllVideo = async () => {
    try {
      const publishedVideo = await getAllVideo();
      if (publishedVideo?.error) {
        setIsLoading(false);
    } else {
      console.log('-----dataaa-----publishedVideo-getAllRequestedVideo-',publishedVideo?.data)
      setVideoData(publishedVideo?.data || []);
   // setFilteredDataSource1(playerListData?.data?.content || []);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };


  const handleUnpublishVideo = async () => {
    try {
      const publishedVideo = await unpublishData();
      if (publishedVideo?.error) {
        setIsLoading(false);
    } else {
      console.log('-----dataaa-----publishedVideo-getAllRequestedVideo-',publishedVideo?.data)
      // setVideoData(publishedVideo?.data || []);
   // setFilteredDataSource1(playerListData?.data?.content || []);
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
      handleAllPublishedVideo();
    // handleAllRequestedVideo()
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

  return (
    <View style={styles.parentContainer}>
      <Header
        drawerIcon={true}
        leftImg={images.LeftCourceImg}
        navigation={navigation}
        title={APP_TEXT.HOME}
        backIcon={false}
      />
      <TabSwitch
        onPressTab={handleTabClick}
        filter={selectedTab === 'Request' ? false : true}
        navigation={navigation}
        selectedHeaderTab={selectedTab}
        onFliterClick={_tabFilterModal}
        modalVisible={filterModalVisible}
      />
      <PlayerVideo
        onPressItem={handleVedioEvent}
        filter={selectedTab === 'Request' ? false : true}
        onFliterClick={toggleFilterModal}
        onDeleteClick={onDeleteVedioClick}
        modalVisible={filterVisible}
        onRequestModalClick={_onRequestModalClick}
        onDeleteVedioModalClick={_onDeleteVedioModalClick}
        
        modalRequestVedioVisible={requestVisible}
        modalDeleteVedioVisible={deletePopUP}
        navigation={navigation}
        imageData={videoData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
   //  flex: 1,
    backgroundColor: 'white',
    
  },
});

export default VedioHighlights;
