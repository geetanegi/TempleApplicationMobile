import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import st from '../../global/styles';
import {colors, images, APP_TEXT, NAVIGATION} from '../../global/theme';
const TermsAndCondition = () => {
//   const data = useSelector(state =>
//     state.checklist.data?.find(i => i.ChecklistId === ChecklistId),
//   );
const rememberMe = require('../../images/control.png');
const [rememberBtn, setRememberBtn] = useState(false);

  return ( 
            <View style={[st.mt_v]}>
              <Pressable>
                <View style={[st.row, st.align_C]}>

                {rememberBtn ? (
                    <Image source={rememberMe} style={styles.checkedIcon} />
                  ) : (
                    <View style={styles.uncheckedView} />
                  )}
                  {/* <Image
                    source={rememberMe}
                    style={{
                      width: 20,
                      height: 20,
                      alignSelf: 'center',
                    }}
                  /> */}

                  <Text
                    style={[
                      st.temsCondition,
                      {color: colors.PRIMARY_DARK, left: 5},
                    ]}>
                    {APP_TEXT.AGREEING_TO}
                    <Text
                      style={[
                        styles.txtForgotPwd,
                        {fontSize: 12, textDecorationLine: 'underline'},
                      ]}>
                      {APP_TEXT.TERMS_AND_CONDITION}
                    </Text>
                    <Text
                      style={[st.temsCondition, {color: colors.PRIMARY_DARK}]}>
                      {APP_TEXT.OF_THE_CONTEST}
                    </Text>
                  </Text>
                </View>
              </Pressable>
              </View>        

        );
};

export default TermsAndCondition;
const styles = StyleSheet.create({
    txtForgotPwd: {
      fontSize: 13,
      color: colors.PRIMARY_BLUE_TEXT,
      textAlign: 'justify',
    },
    checkedIcon: {
        width: 20,
        height: 20,
        left: 5,
        alignSelf: 'center',
      },
      uncheckedView: {
        height: 20,
        width: 20,
        backgroundColor: '#60A5FA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFF',
        left: 5,
      },
  });