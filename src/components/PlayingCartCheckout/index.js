import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, images} from '../../global/theme';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../global/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const PlayingCartCheckout = ({courceData,  courceName}) => {
  const [array, setArray] = useState(courceData);

  const CartItem = ({item}) => {
    return (
      <View
        style={[
          styles.imageContainer,
          {
            borderColor: colors.BACKGROUD_ICON_COLOR,
            borderWidth: BORDERWIDTH.BORDERWIDTH_1,
          },
        ]}>
        <View style={styles.metricBox}>
          <Text style={styles.clubTitle}>{'Contest'}</Text>
        </View>

        <View>
          {item &&
            item?.accordianItem?.map(val => {
              return (
                <View style={styles.metricBoxInside}>
                  <Image source={images.golfPinShot} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <View style={styles.itemSubDetails}>
                      <Text style={styles.listTitle}>{val.name}</Text>
                    </View>
                    <View style={styles.itemSubDetails}>
                      <Text style={styles.listPrice}>
                        {'$'}
                        {val.price}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(val.id)}>
                    <Image source={images.delete} style={styles.removeImage} />
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>

        <View
          style={styles.CheckoutBtn}>
          <View style={styles.chectoutButton}>
            <Text style={styles.totalTitle}>{'Total:'}</Text>
            <Text style={styles.CheckoutTitle}>{'$1500'}</Text>
          </View>
        </View>
      </View>
    );
  };

  const removeItem = id => {
    alert(id);
    // const filteredItems = array[0].accordianItem.filter(
    //   items => items.id !== id,
    // );
    // setArray(filteredItems); // Update the state with the filtered list
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={array}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          marginTop: -10,
          paddingBottom: PADDING.PADDING_10,
          // backgroundColor: 'red',
        }}
        renderItem={({item, index}) => <CartItem item={item} />}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    // width: WIDTH.WIDTH_100,
    // height: HEIGHT.HEIGHT_100,
    // backgroundColor: 'red',
  },
  metricBox: {
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    paddingHorizontal: PADDING.PADDING_15,
    height: SIZES.SIZES_42,
  },
  CheckoutBtn: {
    marginTop: SIZES.SIZES_20,
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    height: SIZES.SIZES_57,
    paddingHorizontal: PADDING.PADDING_15,
    flexDirection: 'row',
  },
  chectoutButton: {
    width: SIZES.SIZES_157,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  metricBoxInside: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_95,
    height: SIZES.SIZES_67,
    marginTop: MARGIN.MARGIN_15,
    borderRadius: RADIUS.RADIUS_6,
    backgroundColor: colors.white,
  },
  clubTitle: {
    color: colors.PRIMARY_DARK,
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  CheckoutTitle: {
    color: colors.PRIMARY_DARK,
    fontSize: FONTSIZE.FONTSIZE_18,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_700,
  },
  totalTitle: {
    color: colors.PRIMARY_DARK,
    fontSize: FONTSIZE.FONTSIZE_18,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: MARGIN.MARGIN_15,
    marginHorizontal: MARGIN.MARGIN_15,
    backgroundColor: '#FFF',
    borderRadius: RADIUS.RADIUS_6,
  },
  removeImage: {
    elevation: 1,
    width: SIZES.SIZES_32,
    height: SIZES.SIZES_32,
  },
  itemImage: {
    width: SIZES.SIZES_56,
    height: SIZES.SIZES_56,
  },
  itemDetails: {
    flex: 1,
    paddingHorizontal: PADDING.PADDING_10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemSubDetails: {
    width: WIDTH.WIDTH_50,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: FONTSIZE.FONTSIZE_14,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  listPrice: {
    alignSelf: 'center',
    fontSize: FONTSIZE.FONTSIZE_16,
    color: colors.PRIMARY_SOLID_TEXT,
    fontFamily: family.medium,
    fontWeight: WEIGHT.WEIGHT_600,
  },
});
export default PlayingCartCheckout;
