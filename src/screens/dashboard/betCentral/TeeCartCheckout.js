import {
  Image,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, { useState } from 'react';
import { APP_TEXT, colors, images } from '../../../global/theme';
import {
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
} from '../../../global/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getAllActiveChallenge } from '../../../utils/apicalls/betContestHandler';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TeeCartCheckout = ({ courceData, onPressList }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkOutArray, setCheckOutArray] = useState([]);
  const [contest, setContest] = useState();
  const [teeId, setTeeId] = useState();

  const handlePress = async ({ index, item }) => {
    if (checkOutArray.length !== 0) {
      Toast.show(APP_TEXT.REGISTER_ON_ONE_TEE_AT_A_TIME);
    } else {
      setSelectedItems([]);
      setCheckOutArray([]);
      try {
        const teeName = item
        const course1 = await getAllActiveChallenge(item?.id);
        const addIndex = course1.map((item, index) => ({
          ...item, // Spread existing properties of each object
          index: index,
          tee: teeName,
          teeId:teeId// Add the index as a new property
        }));
        // setContest(course1);
        setContest(addIndex);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedIndex(index === expandedIndex ? null : index);
    }

  };

  const isItemSelected = itemId => selectedItems.includes(itemId);

  const AccordionItem = ({ item, onPress, expanded }) => {
    const BorderClr = expanded ? colors.green : colors.PRIMARY_LIGHT_TEXT;
    const BorderWidth = expanded
      ? BORDERWIDTH.BORDERWIDTH_1
      : BORDERWIDTH.BORDERWIDTH_;
    return (
      <View
        style={[
          styles.imageContainer,
          { borderColor: BorderClr, borderWidth: BorderWidth },
        ]}>
        <TouchableOpacity onPress={onPress} style={styles.metricBox}>
          <Text style={styles.clubTitle}>{item.teeName}</Text>
          {!expanded ? (
            <AntDesign
              name={APP_TEXT.RIGHT}
              size={SIZES.SIZES_18}
              color={colors.PRIMARY_LIGHT_TEXT}
            />
          ) : (
            <AntDesign
              name={APP_TEXT.DOWN}
              size={SIZES.SIZES_18}
              color={colors.PRIMARY_LIGHT_TEXT}
            />
          )}
        </TouchableOpacity>

        {expanded && (
          <View>
            {contest &&
              contest?.map(val => {
                const isSelected = isItemSelected(val.contestId);
                const startDate = moment.utc(val?.registrationStartTime).local().format('h:mm A');
                const endDate = moment.utc(val?.registrationEndTime).local().format('h:mm A');
                const now = moment();
                const isInRestrictedTime = now.isBetween(startDate, endDate);
                return (
                  <View style={styles.metricBoxInside}>
                    <Image
                      source={images.golfPinShot}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <View style={styles.itemSubDetails}>
                        <Text style={styles.listTitle}>{val?.contestType}</Text>
                        <Text style={styles.listPrice}>
                          {'$'}
                          {val.entryFee}
                        </Text>
                      </View>

                      <View style={styles.itemSubDetails}>
                        <Text style={styles.dateRange}>{startDate} - {endDate}</Text>
                        <View style={styles.activeStatus}>
                          <FontAwesome5
                            name="golf-ball"
                            size={13}
                            color={colors.SUCCESS_GREEN}
                          />
                          <Text style={styles.activeText}>{APP_TEXT.ACTIVE}</Text>
                        </View>
                      </View>
                    </View>
                    {/* {!isInRestrictedTime && ( */}
                      <TouchableOpacity
                        style={[styles.itemPlusImage]}
                        onPress={() => {
                          toggleSelect(val);
                        }}>
                        <AntDesign
                          name={isSelected ? APP_TEXT.MINUS : APP_TEXT.PLUS}
                          size={SIZES.SIZES_32}
                          color={isSelected ? colors.PRIMARY_SOLID_TEXT : colors.green}
                        />
                      </TouchableOpacity>
                    {/* )} */}
                  </View>
                );
              })}
          </View>
        )}

        {expanded && (
          <View>
            {contest?.length !== 0 && (
              <View style={styles.CheckoutBtn}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={checkOutArray?.length === 0}
                  style={styles.chectoutButton}
                  onPress={() => {
                    onPressList(checkOutArray);
                  }}>
                  {checkOutArray.length !== 0 && (
                    <View style={styles.checkoutPopUp}>
                      <Text style={styles.checkoutCount}>
                        {checkOutArray?.length}
                      </Text>
                    </View>
                  )}
                  <AntDesign
                    name="shoppingcart"
                    size={SIZES.SIZES_19}
                    color={colors.white}
                  />
                  <Text style={styles.CheckoutTitle}>{APP_TEXT.REGISTER}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const toggleSelect = item => {
    setTeeId(item?.tee?.id)
    const isSelected = selectedItems.includes(item.contestId);
    if (isSelected) {
      // If the item is already selected, remove it
      setSelectedItems(
        selectedItems.filter(contestId => contestId !== item.contestId),
      );
      const removeCheckout = checkOutArray.filter(
        val => val.index !== item.index,
      );
      setCheckOutArray(removeCheckout);
    } else {
      setCheckOutArray([...checkOutArray, item]);
      // Otherwise, add the item to selected items
      setSelectedItems([...selectedItems, item.contestId]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courceData}
        extraData={selectedItems}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          backgroundColor: 'transparent',
          paddingBottom: PADDING.PADDING_10,
        }}
        renderItem={({ item, index }) => (

          <AccordionItem
            item={item}
            expanded={expandedIndex === index}
            onPress={() => handlePress({ index, item })}
          />

        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: WIDTH.WIDTH_100,
    height: HEIGHT.HEIGHT_100,
    backgroundColor: colors.white,
  },
  metricBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    paddingHorizontal: PADDING.PADDING_15,
    height: SIZES.SIZES_48,
  },
  CheckoutBtn: {
    elevation: ELEVATION.ELEVATION_1,
    marginTop: SIZES.SIZES_15,
    borderTopColor: 'white',
    borderTopWidth: BORDERWIDTH.BORDERWIDTH_,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    paddingHorizontal: PADDING.PADDING_15,
  },
  chectoutButton: {
    height: SIZES.SIZES_32,
    width: SIZES.SIZES_132,
    marginVertical: SIZES.SIZES_10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.PRIMARY_BUTTON,
    borderRadius: RADIUS.RADIUS_6,
  },
  metricBoxInside: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_95,
    height: SIZES.SIZES_67,
    marginTop: MARGIN.MARGIN_15,
    marginHorizontal: MARGIN.MARGIN_10,
    borderRadius: RADIUS.RADIUS_6,
    paddingHorizontal: SIZES.SIZES_10,
    backgroundColor: colors.white,
    elevation: ELEVATION.ELEVATION_8,
  },
  clubTitle: {
    color: colors.PRIMARY_LIGHT_TEXT,
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },
  CheckoutTitle: {
    color: '#FFF',
    fontSize: FONTSIZE.FONTSIZE_13,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },

  checkoutPopUp: {
    position: 'absolute',
    height: SIZES.SIZES_14,
    width: SIZES.SIZES_14,
    top: 0,
    left: SIZES.SIZES_26,
    borderRadius: SIZES.SIZES_6,
    backgroundColor: 'red',
    alignItems: 'center',
    alignSelf: 'center',
  },

  checkoutCount: {
    color: '#FFF',
    fontSize: FONTSIZE.FONTSIZE_8,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },

  imageContainer: {
    alignItems: 'center',
    marginTop: MARGIN.MARGIN_15,
    marginHorizontal: MARGIN.MARGIN_15,
    backgroundColor: '#FFF',
    borderRadius: RADIUS.RADIUS_6,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: SIZES.SIZES_12,
    borderRadius: SIZES.SIZES_8,
    marginVertical: SIZES.SIZES_8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: SIZES.SIZES_2,
  },
  itemImage: {
    width: SIZES.SIZES_32,
    height: SIZES.SIZES_34,
  },
  itemPlusImage: {
    // width: SIZES.SIZES_32,
    // height: SIZES.SIZES_34,
    elevation: 1,
    width: SIZES.SIZES_32,
    height: SIZES.SIZES_32,
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

  actionButton: {
    width: SIZES.SIZES_24,
    height: SIZES.SIZES_24,
    borderRadius: SIZES.SIZES_12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: colors.PRIMARY_SOLID_TEXT,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  actionText: {
    color: '#fff',
    fontWeight: WEIGHT.WEIGHT_600,
    fontFamily: family.medium,
    fontSize: FONTSIZE.FONTSIZE_15,
  },
  listTitle: {
    fontSize: FONTSIZE.FONTSIZE_13,
    color: colors.PRIMARY_DARK,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  listPrice: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.PRIMARY_SOLID_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  dateRange: {
    fontSize: FONTSIZE.FONTSIZE_11,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
    marginLeft: 14
  },

  activeStatus: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.BACKGROUD_GREY_COLOR,
    borderRadius: RADIUS.RADIUS_4,
    height: SIZES.SIZES_22,
    width: SIZES.SIZES_62,
  },
  activeText: {
    color: colors.SUCCESS_GREEN,
    fontSize: FONTSIZE.FONTSIZE_12,
  },
});
export default TeeCartCheckout;
