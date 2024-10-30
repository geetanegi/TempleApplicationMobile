import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import st from '../../../global/styles';
  import VideoItem from '../../../components/component-parts/videoItem';
  import EmptyItem from '../../../components/component-parts/emptyItem';
  import {getAuth} from '../../../utils/apicalls/getApi';
  import {API} from '../../../utils/endpoints';
  import Loader from '../../../components/loader';
  import {setVideo} from '../../../redux/reducers/Video';
  import {useSelector, useDispatch} from 'react-redux';
  
  const list=[
      {
        "id": 13,
        "Title": "Complementary feeding in Gujarati",
        "Description": "Animated post on Complementary feeding in Gujarati",
        "Url": "https://vimeo.com/user115708892/review/864396121/52917cefb9",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 12,
        "Title": "Supportive role of husband in Gujarati",
        "Description": "Animated post on Supportive role of husband in Gujarati",
        "Url": "https://vimeo.com/user115708892/review/864395173/08160fb2d7",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 11,
        "Title": "Exclusive Breastfeeding in Gujarati",
        "Description": "Animated Post on Exclusive Breastfeeding in Gujarati",
        "Url": "https://vimeo.com/user115708892/review/864394299/75721b44b3",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 10,
        "Title": "Complementary feeding in Hindi",
        "Description": "Animated post on Complementary feeding in Hindi",
        "Url": "https://vimeo.com/user115708892/review/858558138/721afd87f5",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 9,
        "Title": "Supportive role of husband in Hindi",
        "Description": "Animated post on Supportive role of husband in Hindi",
        "Url": "https://vimeo.com/user115708892/review/864394701/f51f70636e",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 8,
        "Title": "Exclusive Breastfeeding in Hindi",
        "Description": "Animated Post on Exclusive Breastfeeding in Hindi",
        "Url": "https://vimeo.com/user115708892/review/858558035/76181d317b",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 7,
        "Title": "Complementary feeding in English",
        "Description": "Animated post on Complementary feeding in English",
        "Url": "https://vimeo.com/user115708892/review/858160468/2921f3c2bd",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 6,
        "Title": "Supportive role of husband in English",
        "Description": "Animated post on Supportive role of husband in English",
        "Url": "https://vimeo.com/user115708892/review/864395600/738c50182f",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 5,
        "Title": "Exclusive Breastfeeding in English",
        "Description": "Animated Post on Exclusive Breastfeeding in English",
        "Url": "https://vimeo.com/user115708892/review/858160488/275d826ef6",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 4,
        "Title": "EBF and EIBF in Gujarati",
        "Description": "Video on Complementary Feeding and Growth Monitoring",
        "Url": "https://vimeo.com/user115708892/review/864342182/847d6a6cba",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 3,
        "Title": "EBF and EIBF in Gujarati",
        "Description": "Video on Complementary Feeding and Growth Monitoring",
        "Url": "https://vimeo.com/user115708892/review/864341923/4b00bbee8d",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 2,
        "Title": "EBF and EIBF in Hindi",
        "Description": "Video on EBF and EIBF",
        "Url": "https://vimeo.com/user115708892/review/857846114/30d95b6cbf",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      },
      {
        "id": 1,
        "Title": "EBF and EIBF in Hindi",
        "Description": "Video on EBF and EIBF",
        "Url": "https://vimeo.com/user115708892/review/857108190/1c7406d6de",
        "StatusId": 2,
        "ContentTypeId": 2,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "VIDEO"
      }
    ]
  const AwarenessVdo = ({navigation}) => {
    // const list = useSelector(state => state.video?.data);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState(list);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
  console.log('---filteredDataSource',filteredDataSource)
    const dispatch = useDispatch();
  
    // const getDataHandle = async () => {
    //   setIsLoading(true);
    //   getAuth(API.GET_VIDEO)
    //     .then(data => {
    //       dispatch(setVideo(data));
    //       setIsLoading(false);
    //       setRefreshing(false);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       setIsLoading(false);
    //       setRefreshing(false);
    //     });
    // };
  
    // useEffect(() => {
    //   getDataHandle();
    // }, []);
  
    // useEffect(() => {
    //   filterRecords(search);
    // }, [list]);
  
    const searchFilterFunction = text => {
      setSearch(text);
      filterRecords(text);
    };
  
    const filterRecords = (searchText) => {
      console.log('filterRecords', searchText)
      if (searchText) {
        const newData = list.filter(function (item) {
          const itemData = item.Title
            ? item.Title.toUpperCase()
            : ''.toUpperCase();
          const textData = searchText.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
      } else {
        setFilteredDataSource(list);
      }
    };
  
    const renderItem_vdo = ({item, index}) => {
      return (
        <VideoItem
          item={item}
          index={index}
          onPress={() => navigation.navigate('ViewVdo', {item: item})}
        />
      );
    };
  
    const ListEmptyComponent = () => {
      return !isLoading && <EmptyItem title={'Data not found'} />;
    };
  
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      getDataHandle();
    }, []);
  
    return (
      <View style={st.container}>
        {/* <View style={[st.mt_t60, st.pd_H10]}>
          <TextInput
            style={st.inputsty}
            onChangeText={text => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder={'Search'}
          />
        </View>
        <FlatList
          contentContainerStyle={st.pd10}
          data={filteredDataSource}
          renderItem={renderItem_vdo}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        /> */}
        {isLoading && <Loader />}
      </View>
    );
  };
  
  export default AwarenessVdo;
  