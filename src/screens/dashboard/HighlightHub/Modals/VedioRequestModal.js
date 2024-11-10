import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  size,
} from '../../../../global/fonts';
import {colors, images, APP_TEXT} from '../../../../global/theme';
import AppText from '../../../../components/AppText';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import RadioButton from '../../../../components/RadioButton';

const options = [
  {
    label: 'Top Shots',
    value: 'TopShots',
    backgroundClr: 'transparent',
    tintClr: colors.PRIMARY_DARK,
  },
  {
    label: 'Not Top Shots',
    value: 'NotTopShots',

    backgroundClr: colors.PRIMARY_SOLID_TEXT,
    tintClr: colors.white,
  },
  {
    label: 'Bloopers',
    value: 'Bloopers',

    backgroundClr: colors.PRIMARY_SOLID_TEXT,
    tintClr: colors.white,
  },
];

const VedioRequestModal = ({onPressRequestVedio, modalRequestVedioVisible}) => {
  const [selectedOption, setSelectedOption] = useState('TopShot');

  const [description, setDescription] = useState('');

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordSubmitClose = data => {
    onPressRequestVedio(data);
  };

  const handleOutsidePress = data => {
    onPressRequestVedio(data);
  };

  const _onClickRadioOption = selectedItem => {
    setSelectedOption(selectedItem);
  };

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={modalRequestVedioVisible}
      onBackdropPress={_recordSubmitClose}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOutsidePress}
        style={styles.modalOverlay}>
        <View style={[styles.modalContent, {pointerEvents: 'auto'}]}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View style={styles.publishedBtn}>
              <CustomTextComponent
                title={'Vedio Reuest'}
                style={[
                  styles.ruleTxt,
                  {
                    color: colors.DARK_BLACK,
                    fontSize: 18,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.publishedBtn}
              onPress={_recordSubmitClose}>
              <MaterialIcons name={'cancel'} size={20} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              // backgroundColor:'red',
            }}>
            <CustomTextComponent
              title={'Select your video category'}
              style={[
                styles.ruleTxt,
                {
                  fontSize: 13,
                  color: colors.DARK_BLACK,
                },
              ]}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              paddingVertical: 10,
              justifyContent: 'space-between',
            }}>
            <RadioButton
              selectedOption={selectedOption}
              options={options}
              fromRequestVedio={true}
              onPressRadio={_onClickRadioOption}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              width: '100%',
            }}>
            <CustomTextComponent
              title={'Describe your video'}
              style={[
                styles.ruleTxt,
                {
                  fontSize: 13,
                  color: colors.DARK_BLACK,
                  left: -10,
                },
              ]}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Description *"
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.deleteBtn} onPress={_recordSubmitClose}>
            <TouchableOpacity onPress={_recordSubmitClose} style={{right: 20}}>
              <Image
                source={images.Button_cancel}
                style={{height: 40, width: 76}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={_recordSubmitClose}>
              <Image
                source={images.button_Request}
                style={{height: 40, width: 85}}
              />
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: '100%',

    borderWidth: 1,
    borderColor: colors.grey,
    elevation: 1,
  },
  publishedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    paddingHorizontal: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 30,
    backgroundColor: colors.grey,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    textAlignVertical: 'top',
  },
});

export default VedioRequestModal;
