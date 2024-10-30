import {
    Text,
    View,
    FlatList,
    ScrollView,
    Platform,
    RefreshControl,
    TextInput,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import st from '../../../global/styles';
  import MagazinesItem from '../../../components/component-parts/magazinesItem';
  import EmptyItem from '../../../components/component-parts/emptyItem';
  import {getAuth} from '../../../utils/apicalls/getApi';
  import {API} from '../../../utils/endpoints';
  import Loader from '../../../components/loader';
  import {setPdf} from '../../../redux/reducers/Pdf';
  import {useSelector, useDispatch} from 'react-redux';
  const list =[
      {
        "id": 25,
        "Title": "FLW_FAQ English",
        "Description": "FLW_FAQ English",
        "Url": "https://niir.netlink.com/ni-assets/bci-products/FLW_FAQ English 14-09-23.pdf",
        "ThumbnailUrl": "https://niir.netlink.com/ni-assets/bci-products/thumbnails/thumb~FLW_FAQ English 14-09-23.png",
        "FileName": "FLW_FAQ English 14-09-23.pdf",
        "StatusId": 2,
        "ContentTypeId": 1,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "PDF"
      },
      {
        "id": 24,
        "Title": "FLW reference booklet English",
        "Description": "FLW reference booklet English",
        "Url": "https://niir.netlink.com/ni-assets/bci-products/FLW reference booklet English 14-09-23.pdf",
        "ThumbnailUrl": "https://niir.netlink.com/ni-assets/bci-products/thumbnails/thumb~FLW reference booklet English 14-09-23.pdf.png",
        "FileName": "FLW reference booklet English.pdf",
        "StatusId": 2,
        "ContentTypeId": 1,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "PDF"
      },
      {
        "id": 23,
        "Title": "WhatsApp posts-English",
        "Description": "1000 Days WhatsApp posts-English",
        "Url": "https://niir.netlink.com/ni-assets/bci-products/1000 Days WhatsApp posts-English 14-09-23.pdf",
        "ThumbnailUrl": "https://niir.netlink.com/ni-assets/bci-products/thumbnails/thumb~1000 Days WhatsApp posts-English 14-09-23.png",
        "FileName": "1000 Days WhatsApp posts-English 14-09-23.pdf",
        "StatusId": 2,
        "ContentTypeId": 1,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "PDF"
      },
      {
        "id": 22,
        "Title": "Showcard English",
        "Description": "1000 days Showcard English",
        "Url": "https://niir.netlink.com/ni-assets/bci-products/1000 days Showcard English 14-09-23.pdf",
        "ThumbnailUrl": "https://niir.netlink.com/ni-assets/bci-products/thumbnails/thumb~1000 days Showcard English 14-09-23.png",
        "FileName": "1000 days Showcard English 14-09-23.pdf",
        "StatusId": 2,
        "ContentTypeId": 1,
        "Status_Enum": "PUBLISH",
        "ContentType_Enum": "PDF"
      }
    ]
  const IEC = ({navigation}) => {
  //  const list = useSelector(state => state.pdf?.data);
  
    const [filteredDataSource, setFilteredDataSource] = useState(list);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
  
    const dispatch = useDispatch();
  
    // const getDataHandle = async () => {
    //   setIsLoading(true);
    //   getAuth(API.GET_PDF)
    //     .then(data => {
    //       dispatch(setPdf(data));
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
    //   filterRecords(search)
    // }, [list]);
  
    const renderItem_magazines = ({item, index}) => {
      return (
        <MagazinesItem
          item={item}
          onClickPdf={() => navigation.navigate('ViewPdf', {url: item.Url})}
        />
      );
    };
  
    const ListEmptyComponent = () => {
      return !isLoading && <EmptyItem title={'Data not found'} />;
    };
  
    const searchFilterFunction = text => {
      setSearch(text);
      filterRecords(text)
    };
  
    const filterRecords = searchText => {
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
  
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      getDataHandle();
    }, []);
  
    return (
      <View style={st.container}>
        <View style={[st.mt_t60, st.pd_H10]}>
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
          renderItem={renderItem_magazines}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item, index) => index.toString()}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        />
        {isLoading && <Loader />}
      </View>
    );
  };
  
  export default IEC;
  