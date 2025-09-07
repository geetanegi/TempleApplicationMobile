import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import st from '../../global/styles';
import {colors} from '../../global/theme';
import {useNavigation} from '@react-navigation/native';

const HeaderDashboard = ({LeftIcon, title, RightIcon, leftNav, rightNav}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.headerContainer, st.pd_H10, st.mt_B10]}>
      {/* Left Section */}
      <View style={styles.sideContainer}>
        {LeftIcon ? (
          <Pressable
            onPress={() => navigation.navigate(leftNav)}
            style={[styles.icon, styles.profileIcon, st.pd4]}>
            <LeftIcon
              strokeWidth={1}
              style={{color: colors.ICON_GREY}}
              size={24}
            />
          </Pressable>
        ) : (
          <View style={{width: 40}} /> // placeholder to keep spacing
        )}
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={st.tx18}>{title}</Text>
      </View>

      {/* Right Section */}
      <View style={styles.sideContainer}>
        {RightIcon ? (
          <Pressable
            onPress={() => navigation.navigate(rightNav)}
            style={[styles.icon, st.pd4]}>
            <RightIcon
              strokeWidth={1}
              style={{color: colors.ICON_GREY}}
              size={32}
            />
          </Pressable>
        ) : (
          <View style={{width: 40}} /> // placeholder to balance
        )}
      </View>
    </View>
  );
};

export default HeaderDashboard;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    height: 70,
  },
  sideContainer: {
    width: 50, // fixed width to balance left & right
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  profileIcon: {
    borderRadius: 100,
    borderWidth: 1,
  },
});
