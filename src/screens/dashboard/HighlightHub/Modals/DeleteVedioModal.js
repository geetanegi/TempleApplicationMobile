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


const DeleteVedioModal = ({onPressVedioDeleteVedio, modalDeleteVedioVisible}) => {
  const [selectedOption, setSelectedOption] = useState('TopShot');

  const [description, setDescription] = useState('');

  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };

  const _recordSubmitClose = data => {
    onPressVedioDeleteVedio(data);
  };

  

  const handleOutsidePress = data => {
    onPressVedioDeleteVedio(data);
  };

  const _onClickRadioOption = selectedItem => {
    setSelectedOption(selectedItem);
  };

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={modalDeleteVedioVisible}
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
                title={'Confirmation'}
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
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              paddingVertical: 10,
              // backgroundColor:'red',
              justifyContent: 'center',
            }}>
 
              <Image
                source={images.icon_delete}
                style={{height: 48, width: 48}}
              />
              <CustomTextComponent
              title={'Are you sure you want to delete this Video?'}
              style={[
                styles.ruleTxt,
                {
                  paddingVertical:10,
                  fontSize: 13,
                  color: colors.DARK_BLACK,
                },
              ]}
            />
          </View>

          <View style={styles.deleteBtn} onPress={_recordSubmitClose}>
            <TouchableOpacity onPress={_recordSubmitClose} style={{right: 20}}>
              <Image
                source={images.Button_No}
                style={{height: 40, width: 93}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={_recordSubmitClose}>
              <Image
                source={images.Button_Yes}
                style={{height: 40, width: 97}}
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // backgroundColor:'red',
    // width:"100%",
    // height:"100%",
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  modalContent: {
    // position: 'absolute',
    // top: 100,
    // right: 60,
    // marginHorizontal:5,
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
    // borderBottomWidth: 0.5,
    // borderColor: colors.grey,
  },
  deleteBtn: {
    flexDirection: 'row',
    // height: 45,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // borderTopWidth: 0.6,
    marginTop: 30,
    // backgroundColor:'red',
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

export default DeleteVedioModal;
