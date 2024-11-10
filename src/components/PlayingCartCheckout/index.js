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

const PlayingCartCheckout = ({navigation, courceData, onTotalPayableChange }) => {
  const [array, setArray] = useState(courceData);

  const totalPayable = array.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.entryFee;
  }, 0);

  useEffect(() => {
    if (onTotalPayableChange) {
      onTotalPayableChange(totalPayable); // Call the parent callback
    }
  }, [totalPayable]);
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
  

        <View>
          <View style={styles.metricBoxInside}>
            <Image source={images.golfPinShot} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <View style={styles.itemSubDetails}>
                <Text style={styles.listTitle}>{item?.contestType}</Text>
              </View>
              <View style={styles.itemSubDetails}>
                <Text style={styles.listPrice}>
                  {'$'}
                  {item?.entryFee}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item)}>
              <AntDesign
                name={'minuscircle'}
                size={SIZES.SIZES_30}
                color={'#FF3B30'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.CheckoutBtn}>
      <View style={styles.chectoutButton}>
        <Text style={styles.totalTitle}>{'Total:'}</Text>
        <Text style={styles.CheckoutTitle}>
          {'$'}
          {totalPayable}
        </Text>
      </View>
    </View>
  );

  const removeItem = obj => {
    const removeFromList = array.filter(val => val.index !== obj.index);
    setArray(removeFromList);
  };

  const renderEmptyList = () => {
    navigation.navigate('CourseScreen');
  };

  return (
    <ScrollView style={styles.container}>
           <View style={styles.metricBox}>
          <Text style={styles.clubTitle}>{'Contest'}</Text>
        </View>
      <FlatList
        data={array}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          marginTop: -10,
          paddingBottom: PADDING.PADDING_10,
          // backgroundColor: 'red',
        }}
        // extraData={}
        ListEmptyComponent={renderEmptyList}
        renderItem={({item, index}) => <CartItem item={item} />}
        ListFooterComponent={renderFooter}
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
    backgroundColor: colors.BACKGROUD_ICON_COLOR,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: SIZES.SIZES_57,
    paddingHorizontal: PADDING.PADDING_15,
    flexDirection: 'row',
    marginHorizontal: MARGIN.MARGIN_5,
    borderBottomLeftRadius: RADIUS.RADIUS_6,
    borderBottomRightRadius: RADIUS.RADIUS_6,
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
    marginHorizontal: MARGIN.MARGIN_5,
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
