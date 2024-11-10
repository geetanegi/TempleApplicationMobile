import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  Alert,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import AppText from '../../../components/AppText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ActiveStatus = ({navigation, accordianData, onPressList}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handlePress = async ({index, item}) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

 
  const AccordionItem = ({item, onPress, expanded}) => {
     
    // alert(JSON.stringify(item));
    // alert(expanded)
    return (
      <View style={[styles.imageContainer]}>
        <TouchableOpacity onPress={onPress} style={styles.metricBox}>
          <Text style={styles.clubTitle}>{item.title}</Text>
          {!expanded ? (
            <AntDesign
              name={APP_TEXT.RIGHT}
              size={SIZES.SIZES_18}
              color={colors.white}
            />
          ) : (
            <AntDesign
              name={APP_TEXT.DOWN}
              size={SIZES.SIZES_18}
              color={colors.white}
            />
          )}
        </TouchableOpacity>

        {expanded && (
          <View>
            {accordianData &&
              accordianData?.map(val => {
                return (
                  <View style={styles.metricBoxInside}>
                    <View style={styles.itemDetails}>
                      <View style={styles.itemSubDetails}>
                        <Text style={styles.listTitle}>Closest-to-Pin</Text>
                        <Text style={styles.listPrice}>Entry Fees: $5</Text>
                        <Text style={styles.listPrice}>Payout: (80/15/5)</Text>
                      </View>

                      <View style={styles.itemSubDetails}>
                        <View style={styles.activeStatus}>
                          <Text style={styles.activeText}>{'Status:'}</Text>
                          <Text style={[styles.activeText, {color: '#07CE6F'}]}>
                            {' Open'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={toggleSwitch}
                        style={[
                          styles.toggleContainer,
                          isEnabled
                            ? styles.toggleEnabled
                            : styles.toggleDisabled,
                        ]}>
                        <Animated.View
                          style={[
                            styles.toggleButton,
                            isEnabled
                              ? styles.toggleButtonEnabled
                              : styles.toggleButtonDisabled,
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        {expanded && (
          <View>
            <View style={styles.CheckoutBtn}>
              <View style={styles.chectoutButton}>
                <Text style={styles.CheckoutTitle}>Start Time:</Text>

                <Text style={styles.CheckoutTitle}> 7:00 AM</Text>
              </View>
              <View style={styles.chectoutButton}>
                <Text style={styles.CheckoutTitle}>End Time:</Text>

                <Text style={styles.CheckoutTitle}> 7:30 PM</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={accordianData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          backgroundColor: 'transparent',
          paddingBottom: PADDING.PADDING_10,
        }}
        renderItem={({item, index}) => (
          <AccordionItem
            item={item}
            expanded={expandedIndex === index}
            onPress={() => handlePress({index, item})}
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
    backgroundColor:'#191818',
    // borderRadius: RADIUS.RADIUS_6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    borderTopWidth: BORDERWIDTH.BORDERWIDTH_,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_100,
    paddingHorizontal: PADDING.PADDING_15,
  },
  chectoutButton: { 
    marginVertical: SIZES.SIZES_10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
   },
  metricBoxInside: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH.WIDTH_95,
    height: SIZES.SIZES_87,
    marginTop: MARGIN.MARGIN_15,
    marginHorizontal: MARGIN.MARGIN_10,
    borderRadius: RADIUS.RADIUS_6,
    paddingHorizontal: SIZES.SIZES_10,
    backgroundColor: '#07CE6F',
    elevation: ELEVATION.ELEVATION_8,
  },
  clubTitle: {
    color: colors.white,
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

 
 
  imageContainer: {
    alignItems: 'center',
    marginTop: MARGIN.MARGIN_15,
    marginHorizontal: MARGIN.MARGIN_15,
    backgroundColor: '#07CE6F',
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
    shadowOffset: {width: 0, height: 2},
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
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  listPrice: {
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
  },
  dateRange: {
    fontSize: FONTSIZE.FONTSIZE_11,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
    marginLeft: 14,
  },

  activeStatus: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: '#191818',
    borderRadius: RADIUS.RADIUS_4,
    height: SIZES.SIZES_22,
    paddingHorizontal:3,
    // width: SIZES.SIZES_62,
  },
  activeText: {
    color: colors.white,
    fontSize: FONTSIZE.FONTSIZE_10,
  },
  //
  toggleContainer: {
    width: 40,
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 3,
    marginRight: 15,
  },
  toggleButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  toggleEnabled: {
    backgroundColor: colors.PRIMARY_SMALL_TEXT, // Green background when enabled
  },
  toggleDisabled: {
    backgroundColor: '#7B7887', // Gray background when disabled
  },
  toggleButtonEnabled: {
    backgroundColor: '#fff', // White circle when enabled
    alignSelf: 'flex-end', // Position to the right
  },
  toggleButtonDisabled: {
    backgroundColor: '#fff', // White circle when disabled
    alignSelf: 'flex-start', // Position to the left
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActiveStatus;
