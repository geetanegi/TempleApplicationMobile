import {
  Text,
  View,
  TouchableOpacity,
  Button,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';
import React from 'react';
import st from '../../../global/styles';
import Header from '../../../components/Header';
import Share from 'react-native-share';
import { images } from '../../../global/theme';
import { setupPlayer } from 'react-native-track-player/lib/src/trackPlayer';
// import { styled } from "nativewind";
const gridItems = [
  { id: '1', title: 'Bhakti', image: images.bhakti },
  { id: '2', title: 'Chalisa', image: images.chalisa },
  { id: '3', title: 'Puja Path', image:images.pujapath  },
  { id: '4', title: 'Stotra', image: images.stotra },
  { id: '5', title: 'Stuti', image:images.stuti  },
  { id: '6', title: 'Vidhi', image: images.vidhi },
  { id: '7', title: 'Aarti', image:images.aarti  },
  { id: '8', title: 'Granth', image:images.aarti },
];
const Home = ({navigation}) => {
  // const StyledText = styled(Text);

  // backAction = () => {
  //   Alert.alert('Exit ?', 'Are you sure you want to exit ?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     {text: 'YES', onPress: () => BackHandler.exitApp()},
  //   ]);
  //   return true;
  // };
  const handlePress = index => {
   console.log(index)
   navigation.navigate("IEC")
  };


  const share = async () => {
    const options = {
      message:
        'hello this is a demo message',
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

    // Share.open(options)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
  };
  return (
    <View style={[st.flex]}>
         <Header navigation={navigation} />
    <View style={{marginTop:15}}>
    <FlatList
      data={gridItems}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.gridItem}   onPress={() => handlePress(item)}>
          <Image source={item.image} style={styles.gridImage} />
          <View style={styles.gridOverlay}>
            <Text style={styles.gridText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
    </View>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#FF8C00' },
  searchBar: { marginBottom: 10 },
  gridContainer: { paddingBottom: 80 },
  gridItem: {
    flex: 1,
    margin: 5,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 140, 0, 0.8)',
    padding: 10,
    alignItems: 'center',
  },
  gridText: { color: '#fff', fontWeight: 'bold' },
});

