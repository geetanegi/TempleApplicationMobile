import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import React from 'react';
import {images} from '../../../global/theme';
import st from '../../../global/styles';
import {colors} from '../../../global/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {MapPin} from 'lucide-react-native';

const {width} = Dimensions.get('window');

const photos = [
  {id: 1, src: {uri: 'https://picsum.photos/id/1011/400/300'}},
  {id: 2, src: {uri: 'https://picsum.photos/id/1015/400/300'}},
  {id: 3, src: {uri: 'https://picsum.photos/id/1016/400/300'}},
  {id: 4, src: {uri: 'https://picsum.photos/id/1025/400/300'}},
  {id: 5, src: {uri: 'https://picsum.photos/id/1035/400/300'}},
];
const SerachPage = () => {
  return (
    <ScrollView style={[st.flex, st.pd_H20, {marginBottom: 100}]}>
      <View>
        <Image source={images.aarti} style={styles.image} />

        <View>
          <Text style={[st.tx18, st.txbold]}>Netus dignissum</Text>
          <Text style={[st.tx14, st.txtlight]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
        </View>
        <Text style={[st.tx16, st.pv10]}>More Photos</Text>
        <FlatList
          horizontal
          data={photos}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Image source={item.src} style={styles.imagesl} />
          )}
        />
      </View>
      <View style={[st.wdh100, st.justify_Row, st.mt_B10, st.mt_t20, st.gap10]}>
        <Pressable style={[styles.btn, st.justify_C, st.align_C]}>
          {/* <Image
            source={images.location}
            style={[styles.imgLogo, {marginTop: 20}]}
          /> */}
          {/* <Icon name="location" size={25} color={colors.white} /> */}
          <MapPin size={25} style={[styles.imgLogo]} color={colors.white} />
        </Pressable>
        <Pressable style={[styles.btn, st.justify_C, st.align_C, {flex: 4}]}>
          <Text style={[st.txAlignC, st.tx13, {color: colors.white}]}>
            Know More
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SerachPage;

const styles = StyleSheet.create({
  image: {
    width: width - 40, // full width with margin
    height: 300, // fixed height
    borderRadius: 15,
    marginBottom: 26,
    marginTop: 10,
    backgroundColor: colors.grey, // fallback color
  },
  container: {
    marginTop: 20,
  },

  imagesl: {
    width: width * 0.25, // about 30% of screen width
    height: 100,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  btn: {
    backgroundColor: colors.orange,
    flex: 1,
    height: 60,
    borderRadius: 14,
  },
  imgLogo: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
