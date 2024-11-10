import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  // Modal,
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
} from '../../../../global/fonts';
import {colors, images, APP_TEXT} from '../../../../global/theme';
import AppText from '../../../../components/AppText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

const FloatingOptionModal = ({onPress, modalVisible, itemID, arrayData}) => {
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordSubmitClose = data => {
    onPress(data);
  };

  const handleOutsidePress = data => {
    onPress(data);
  };

  const deletePress = (modalStatus, itemID,arrayData) => {
    // alert(itemID)
    onPress(modalStatus, itemID, arrayData);
  };

  return (
    <Modal
      // animationType="fade"
      // transparent={true}
      swipeDirection={['left', 'right']}
      // visible={modalVisible}
      // onRequestClose={_recordSubmitClose}

      backdropOpacity={0}
      isVisible={modalVisible}
      onBackdropPress={handleOutsidePress}
      animationIn="fadeIn"
      // coverScreen={false}
      animationOut="fadeOut"
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
            onPress={() => deletePress(modalVisible, itemID, arrayData)}>
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
    borderBottomWidth: BORDERWIDTH.BORDERWIDTH_,
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
