import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Modal,
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
import Entypo from 'react-native-vector-icons/Entypo';

const FloatingFilterModal = ({onPress, modalVisible,onPressList}) => {
  
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordSubmitClose = data => {
    onPress(data);
  };

  const handleOutsidePress = data => {
    onPress(data);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={_recordSubmitClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOutsidePress}
        style={styles.modalOverlay}>
        <View style={[styles.modalContent, {pointerEvents: 'auto'}]}>
          <TouchableOpacity
            style={styles.publishedBtn}
            onPress={_recordSubmitClose}>
            <CustomTextComponent
              title={'Top Shot'}
              style={[
                styles.ruleTxt,
                {
                  color: colors.DARK_BLACK,
                },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.publishedBtn}
            onPress={_recordSubmitClose}>
            <CustomTextComponent
              title={'Not Top Shots'}
              style={[
                styles.ruleTxt,
                {
                  color: colors.DARK_BLACK,
                },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.publishedBtn}
            onPress={() => {
              _recordSubmitClose(); // Calling _recordSubmitClose
              onPressList(item); // Passing 'item' to onPressList function
            }}
            >
            <CustomTextComponent
              title={'Shot Of The Week'}
              style={[
                styles.ruleTxt,
                {
                  color: colors.DARK_BLACK,
                },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={_recordSubmitClose}>
            <Entypo name={'circle-with-cross'} size={16} color={colors.grey} />
            <CustomTextComponent title={'Clear'} style={[styles.ruleTxt]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.grey,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    top: 100,
    right: 60,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'flex-start',
    borderWidth:1,
    borderColor:colors.grey,
    elevation:1,
  },
  publishedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    paddingHorizontal: 10,
    // borderBottomWidth: 0.5,
    // borderColor: colors.grey,
  },
  deleteBtn: {
    flexDirection: 'row',
    height: 45,
    width:"100%",
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 0.6,
    // backgroundColor:'red',
    borderColor: colors.grey,
  },
});

export default FloatingFilterModal;
