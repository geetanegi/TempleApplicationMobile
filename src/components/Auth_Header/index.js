import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../global/theme';
import Back from '../back';
import st from '../../global/styles';
import LinearGradient from 'react-native-linear-gradient';

const AuthHeader = ({
  title,
  subtitle,
  onBack,
  checklistEnum,
  code1,
  code2,
  isReadyOnly,
  monitoringDate,
  onMonitoringDateChange,
}) => {
  return (
    <View>
      {code1 != undefined && code2 != undefined ? (
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          colors={[code1, code2]}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 40,
            paddingHorizontal: 15,
            paddingBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={st.wdh10}>
            <Back onPress={onBack} />
          </View>

        </LinearGradient>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 40,
            paddingHorizontal: 15,
            paddingBottom: 10,
            backgroundColor: colors.indian_red,
          }}>
          <View style={st.wdh10}>
            <Back onPress={onBack} />
          </View>
          <View style={st.wdh90}>
            <Text style={st.txheader}>{title}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({});
