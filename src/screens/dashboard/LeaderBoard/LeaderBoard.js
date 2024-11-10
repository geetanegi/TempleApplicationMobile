import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet,TouchableOpacity} from 'react-native';

import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  Alert,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import {API} from '../../../utils/endpoints';
import {postAuth} from '../../../utils/apicalls/postApi';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import HeaderHome from '../../../components/HeaderHome';
import TabLeaderBoard from './TabLeaderBoard';
import VideoLeaderBoardHome from './VideoLeaderBoardHome';
import AppText from '../../../components/AppText';
import ActiveStatus from './ActiveStatus';
import LiveLeaderboard from './LiveLeaderboard';
import MostRecent from './MostRecent';
import {color} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import { getAllShotOftheWeek } from '../../../utils/apicalls/highlightHubHandler';

const leaderBoardData = [
  {id: '0', uri: 'https://via.placeholder.com/150'},
  {id: '1', uri: 'https://via.placeholder.com/150'},
  {id: '2', uri: 'https://via.placeholder.com/150'},
  {id: '3', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
];

const publishedData = [
  {id: '1', uri: 'https://via.placeholder.com/150'},
  {id: '2', uri: 'https://via.placeholder.com/150'},
  {id: '3', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
];

const requestData = [
  {
    id: '1',
    uri: 'https://via.placeholder.com/150',
    vediRequest: 'ActiveContest',
  },
  {
    id: '2',
    uri: 'https://via.placeholder.com/150',
    vediRequest: 'LiveLeaderBoard',
  },
  {id: '3', uri: 'https://via.placeholder.com/150', vediRequest: 'MostRecent'},
];

const allData = [
  {id: '1', uri: 'https://via.placeholder.com/150'},
  {id: '2', uri: 'https://via.placeholder.com/150'},
  {id: '3', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
];

const _data = [
  {
    id: '1',
    title: 'Prestwick Village Golf Course',
    content: 'This is the content of Item 1',
  },
  {
    id: '2',
    title: 'Timber Trace Golf Course',
    content: 'This is the content of Item 2',
  },
  // { id: '3', title: 'Prestwick Village Golf Course', content: 'This is the content of Item 3' },
  // { id: '4', title: 'Timber Trace Golf Course', content: 'This is the content of Item 4' },
];

const _liveLeaderBoarddata = [
  {
    pos: 1,
    username: 'MeTizio',
    proximity: '4.50',
    prize: '$800.00',
    imageUrl: 'https://example.com/image1.png',
  },
  {
    pos: 2,
    username: 'GBarrabia',
    proximity: '6.25',
    prize: '$150.00',
    imageUrl: 'https://example.com/image2.png',
  },
  {
    pos: 3,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
  {
    pos: 4,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
  {
    pos: 5,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
  {
    pos: 6,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
  {
    pos: 7,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
];

const _mostRecentddata = [
  {
    pos: 1,
    username: 'MeTizio',
    proximity: '4.50',
    prize: '$800.00',
    imageUrl: 'https://example.com/image1.png',
  },
  {
    pos: 2,
    username: 'GBarrabia',
    proximity: '6.25',
    prize: '$150.00',
    imageUrl: 'https://example.com/image2.png',
  },
  {
    pos: 3,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
  {
    pos: 4,
    username: 'BHaffey',
    proximity: '7.82',
    prize: '$50.00',
    imageUrl: 'https://example.com/image3.png',
  },
];

const LeaderBoard = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = useNetworkStatus();
  const [selectedTab, setSelectedTab] = useState('Published');
  const [playerData, setPlayerData] = useState(publishedData);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState();
  const [activeStatusData, setActiveStatusData] = useState(_data);

  const dataVedioHome = filteredDataSource?.slice(0, 2);

  const toggleFilterModal = data => {
    console.log('toggleFilterModal_main_screen->', data);
    setFilterVisible(!data);
  };

  const _tabFilterModal = data => {
    console.log('toggleFilterModal_main_screen->', data);
    setFilterModalVisible(!data);
  };

  const _onRequestModalClick = data => {
    console.log('toggleFilterModal_main_screen->', data);
    setRequestVisible(!data);
  };

  const handleVedioEvent = data => {
    // alert(data);
  };

  const handleTabClick = data => {
    setSelectedTab(data);
    data === 'ActiveContest'
      ? setActiveStatusData(activeStatusData)
      : data === 'LiveLeaderBoard'
      ? setPlayerData(requestData)
      : setPlayerData(allData);
  };



  const handleAllShotOftheWeek = async () => {
    try {
      const shotOftheWeekData = await getAllShotOftheWeek();
      if (shotOftheWeekData?.error) {
        setIsLoading(false);
    } else {
      //console.log('-----dataaa-----shotOftheWeekData--',shotOftheWeekData)
       setFilteredDataSource(shotOftheWeekData?.data || []);
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
      handleAllShotOftheWeek();
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


  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _onClickAccordianDetails = () => {
    alert('call');
  };

  return (
    <View>
      <HeaderHome
        drawerIcon={true}
        playerImage={images.user}
        navigation={navigation}
        playerName={'MeTizio'}
        GHIN={'2460170'}
        HDCP={'1.5'}
      />
      <ScrollView>
        <View style={styles.parentContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
            <CustomTextComponent
              title={'Shot of the Week'}
              style={styles.ruleTxt}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AllLeaderBoardVedio', {
                  imageData: filteredDataSource,
                })
              }>
              <CustomTextComponent
                title={'View All'}
                style={[styles.ruleTxt, {color: '#E2865E'}]}
              />
            </TouchableOpacity>
          </View>
          <VideoLeaderBoardHome
            onPressItem={handleVedioEvent}
            navigation={navigation}
            imageData={dataVedioHome}
          />
          <TabLeaderBoard
            onPressTab={handleTabClick}
            navigation={navigation}
            selectedHeaderTab={selectedTab}
          />

          {selectedTab === 'ActiveContest' ? (
            <ActiveStatus
              navigation={navigation}
              accordianData={activeStatusData}
              onPressList={_onClickAccordianDetails}
            />
          ) : selectedTab === 'LiveLeaderBoard' ? (
            <LiveLeaderboard
              navigation={navigation}
              listData={_liveLeaderBoarddata}
              onPressList={_onClickAccordianDetails}
            />
          ) : (
            <MostRecent
              navigation={navigation}
              mostRecentData={_mostRecentddata}
              onPressList={_onClickAccordianDetails}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom:80
  },
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    paddingVertical: PADDING.PADDING_10,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
    color: colors.black,
  },
});

export default LeaderBoard;
