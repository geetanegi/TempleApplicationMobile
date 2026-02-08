import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import React, {useMemo, useState, useCallback} from 'react';
import st from '../../../global/styles';
import Share from 'react-native-share';
import {images} from '../../../global/theme';
import InputText from '../../../components/InputText';

const gridItems = [
  {id: '1', title: 'Bhakti', image: images.bhakti, navigate: 'BhaktiScreen'},
  {id: '2', title: 'Chalisa', image: images.chalisa, navigate: 'BhaktiScreen'},
  {
    id: '3',
    title: 'Puja Path',
    image: images.pujapath,
    navigate: 'BhaktiScreen',
  },
  {id: '4', title: 'Stotra', image: images.stotra, navigate: 'StotraScreen'},
  {id: '5', title: 'Stuti', image: images.stuti, navigate: 'StutiScreen'},
  {id: '6', title: 'Vidhi', image: images.vidhi, navigate: 'VidhiScreen'},
  {id: '7', title: 'Aarti', image: images.aarti, navigate: 'AartiScreen'},
  {id: '8', title: 'Granth', image: images.aarti, navigate: 'GranthScreen'},
];

const JevaaniScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchText('');
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return gridItems;
    return gridItems.filter(item => item.title.toLowerCase().includes(q));
  }, [searchText]);

  const handlePress = item => {
    navigation.navigate('SubCategoryPage', {...item});
  };

  // (optional) kept your share function as-is
  const share = async () => {
    const options = {
      message: 'hello this is a demo message',
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
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handlePress(item)}>
      <Image source={item.image} style={styles.cardImage} />

      {/* Floating pill title */}
      <View style={styles.titlePill}>
        <Text style={styles.titleText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[st.flex, styles.container]}>
      {/* Search bar */}
      <View style={styles.searchWrap}>
        <InputText
          placeholder="Search"
          iconName="search"
          value={searchText}
          onChangeText={setSearchText}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D48A4A']}
            tintColor="#D48A4A"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No Data found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default JevaaniScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },

  /* Search */
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  // This assumes your InputText supports these keys via inputStyle
  searchInput: {
    height: 48,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#C7C7D1',
    backgroundColor: '#fff',
  },

  /* Grid */
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 90,
  },

  card: {
    flex: 1,
    margin: 8,
    height: 190,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},

    // Android shadow
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  /* Floating label pill */
  titlePill: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    paddingHorizontal: 42,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#D99A63', // warm Figma-like
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  emptyWrap: {
    paddingTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.6,
  },
});
