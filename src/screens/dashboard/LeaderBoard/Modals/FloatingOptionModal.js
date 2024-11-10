import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  family,
  BORDERWIDTH,
  PADDING,
  WEIGHT,
  FONTSIZE,
  SIZES,
} from '../../../../global/fonts';
import {colors} from '../../../../global/theme';
import AppText from '../../../../components/AppText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

const FloatingOptionModal = ({onPress, modalVisible}) => {

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordSubmitClose = data => {
    onPress(data);
  };

  const handleOutsidePress = data => {
    onPress(data);
  };

  const deletePress = data => {
    console.log("data_delete", data);
    onPress(data);
  };

  return (
    <Modal
      isVisible={modalVisible}
      // backdropOpacity={0.3}
      // swipeDirection={['left', 'right']}
      onBackdropPress={handleOutsidePress}
      animationIn="fadeIn"      // Incoming animation, e.g., slide in from the left
      // animationInTiming={500}        // Customize the animation speed if needed
      animationOut="fadeOut"         // Set the outgoing animation as fade-out (or any other)
      // animationOutTiming={500}       // Timing for the outgoing animation
      // useNativeDriver={true}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOutsidePress}
        style={styles.modalOverlay}>
        <View style={[styles.modalContent, {pointerEvents: 'auto'}]}>
          <TouchableOpacity
            style={styles.publishedBtn}
            onPress={_recordSubmitClose}>
            <MaterialCommunityIcons
              name={'publish-off'}
              size={16}
              color={colors.PRIMARY_BUTTON}
            />
            <CustomTextComponent
              title={'Published'}
              style={[
                styles.ruleTxt,
                {
                  color: colors.PRIMARY_BUTTON,
                },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={deletePress}>
            <AntDesign name={'delete'} size={16} color={colors.PRIMARY_DARK} />
            <CustomTextComponent title={'Delete'} style={[styles.ruleTxt]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.semibold,
    fontWeight: WEIGHT.WEIGHT_600,
    color: colors.PRIMARY_DARK,
    paddingHorizontal: PADDING.PADDING_5,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    top: SIZES.SIZES_200,
    right: SIZES.SIZES_60,
    backgroundColor: colors.white,
    borderRadius: SIZES.SIZES_10,
    alignItems: 'flex-start',
    borderColor: colors.grey,
    elevation: SIZES.SIZES_1,
  },
  publishedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZES.SIZES_45,
    paddingHorizontal: PADDING.PADDING_10,
    borderBottomWidth: BORDERWIDTH.BORDERWIDTH_1,
    borderColor: colors.grey,
  },
  deleteBtn: {
    flexDirection: 'row',
    height: SIZES.SIZES_45,
    paddingHorizontal: PADDING.PADDING_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingOptionModal;
