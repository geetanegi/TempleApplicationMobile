import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  WEIGHT,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT} from '../../../global/theme';
import AppText from '../../../components/AppText';
import {ScrollView} from 'react-native-gesture-handler';

const BadgeScreenModal = ({imageData, onPress}) => {
  
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordSubmitClose = data => {
    onPress(data);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.imageContainer}>
      <Image source={images.achievementBadge} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomTextComponent
        title={APP_TEXT.ACHIEVEMENT_UNCLOCK}
        style={styles.ruleTxt}
      />
      <View style={styles.instructionsContainer}>
        <ScrollView>
          <FlatList
            scrollEnabled={true}
            data={imageData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={styles.flatlist}
          />
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => _recordSubmitClose('close')}
        style={styles.skipButton}>
        <Text style={styles.skipButtonText}>{APP_TEXT.CLOSE}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING.PADDING_20,
    backgroundColor: 'white',
    borderRadius: RADIUS.RADIUS_12,
    borderColor: colors.grey,
    borderWidth: SIZES.SIZES_1,
    width: WIDTH.WIDTH_97,
  },

  instructionsContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: colors.COLOR_BORDER,
    borderWidth: BORDERWIDTH.BORDERWIDTH_,
    borderRadius: RADIUS.RADIUS_10,
    marginBottom: MARGIN.MARGIN_20,
    height: SIZES.SIZES_322,
  },
  flatlist: {
    flex: SIZES.SIZES_1,
  },
  skipButton: {
    borderRadius: RADIUS.RADIUS_6,
    height: SIZES.SIZES_36,
    backgroundColor: colors.PRIMARY_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    paddingHorizontal: PADDING.PADDING_20,
    fontSize: FONTSIZE.FONTSIZE_12,
    color: colors.white,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_400,
  },

  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    paddingVertical: PADDING.PADDING_20,
    fontFamily: family.semibold,
    fontWeight: WEIGHT.WEIGHT_600,
    color: colors.LIGHT_RED,
  },
  imageContainer: {
    paddingHorizontal: PADDING.PADDING_15,
    paddingVertical: PADDING.PADDING_5,
    alignItems: 'center',
  },
  image: {
    width: SIZES.SIZES_72,
    height: SIZES.SIZES_72,
    resizeMode: 'cover',
  },
});

export default BadgeScreenModal;
