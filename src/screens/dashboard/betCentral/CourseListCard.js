import {
  Image,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { images} from '../../../global/theme';
import { family} from '../../../global/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
const screenWidth = Dimensions.get('window').width;

const CourceList = ({courceData, onPressList,holeData}) => {

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => onPressList(item)}
      activeOpacity={0.9}
      style={styles.imageContainer}>
      <Image
        source={images.golfVedio}
        resizeMode="stretch"
        style={styles.imageGolf}
      />
  <View style={styles.metricBox}>
    <Text style={styles.clubTitle}>{item?.courseName}</Text>
    <AntDesign name="right" size={20} color="black" />
    </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={false}
        data={courceData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{backgroundColor: 'transparent'}}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:"100%",
    backgroundColor:'#FFF',
  },
  metricBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    height: 47,
  },
  clubTitle: {
    color: '#1D1A0C',
    fontSize: 14, 
    fontFamily: family.medium,
    // fontWeight: '600',
  },
  overviewValue: {
    fontWeight: '500',
    fontSize: 11,
    color: '#95C11E',
  },
  imageContainer: {
    borderWidth: 1,
    elevation: 1,
    borderColor: '#FFF',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  imageGolf: {
    width: screenWidth - 30,
    borderRadius: 12,
    height: 172,
  },
});
export default CourceList;
