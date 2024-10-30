import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors, images} from '../../../global/theme';
//golfTrophy
//golfVedio
const screenWidth = Dimensions.get('window').width;

const imageData = [
  {id: '1', uri: 'https://via.placeholder.com/150'},
  {id: '2', uri: 'https://via.placeholder.com/150'},
  {id: '3', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
];

const PlayerVideo = () => {
  const [activeTab, setActiveTab] = useState('Betting Overview');

  const renderItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image 
        source={images.golfVedio}
        style={styles.image}
      />
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.metricBox}>
          <Text style={styles.overviewTitle}>Featured Highlights</Text>
          <Text style={styles.overviewValue}>View All</Text>
        </View>
        <FlatList
          horizontal={true}
          data={imageData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          // contentContainerStyle={{marginLeft:10}}
          // numColumns={4}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 12,
    marginVertical: 15,
    borderColor: '#E6E6E6',
    // borderWidth: 1,
  },
  cardContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    // paddingHorizontal:15,
    borderRadius: 10,
  },
  metricBox: {
    justifyContent:'space-between',
    flexDirection:'row',
    paddingHorizontal:15
  },
  overviewTitle: {
    color: '#1D1A0C',
    fontSize: 16,
    fontWeight: '600',
  },
  overviewValue: {
    fontWeight: '500',
    fontSize:11,
    color: '#95C11E',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical:10,
  },
  image: {
    width: 154,
    height: 84,
    marginLeft:10,
    resizeMode: 'cover',
  },
});
export default PlayerVideo;
