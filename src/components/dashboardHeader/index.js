import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; // ✅ if you have it
import st from '../../global/styles';
import { colors, images } from '../../global/theme';

const HeaderDashboard = ({
  title,
  logoSource,
  LeftIcon,
  RightIcon1,
  RightIcon2,
  leftNav,
  rightNav1,
  rightNav2,
  onLeftPress,
  onRightPress1,
  onRightPress2,
}) => {
  const navigation = useNavigation();

  const handleNav = (route) => {
    if (!route) return;
    navigation.navigate(route);
  };

  const IconButton = ({ children, onPress }) => {
    return (
      <Pressable onPress={onPress} style={styles.btnPressable}>
        <LinearGradient
          colors={['rgba(248, 175, 83, 1)', 'rgba(192, 108, 75, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          {children}
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <View style={[styles.headerContainer, st.pd_H10, st.mt_B10,st.mt_t10]}>
      {/* Left */}
      <View style={styles.leftArea}>
        {LeftIcon ? (
          <IconButton
            onPress={onLeftPress ? onLeftPress : () => handleNav(leftNav)}
          >
            <LeftIcon size={22} strokeWidth={1.8} color={colors.DARK_BLACK} />
          </IconButton>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* Center Title / Logo */}
      <View style={styles.centerArea}>
        {logoSource ? (
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        ) : images.jainSansaarLogo ? (
          <Image source={images.jainSansaarLogo} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.titleText}>{title}</Text>
        )}
      </View>

      {/* Right (two icons) */}
      <View style={styles.rightArea}>
        {RightIcon1 ? (
          <IconButton
            onPress={onRightPress1 ? onRightPress1 : () => handleNav(rightNav1)}
          >
            <RightIcon1 size={22} strokeWidth={1.8} color={colors.DARK_BLACK} />
          </IconButton>
        ) : (
          <View style={{ width: 44 }} />
        )}

        <View style={{ width: 10 }} />

        {RightIcon2 ? (
          <IconButton
            onPress={onRightPress2 ? onRightPress2 : () => handleNav(rightNav2)}
          >
            <RightIcon2 size={22} strokeWidth={1.8} color={colors.DARK_BLACK} />
          </IconButton>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
    </View>
  );
};

export default HeaderDashboard;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  leftArea: {
    width: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },

  rightArea: {
    width: 110,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 2,
  },

  btnPressable: {
    borderRadius: 14,
    overflow: 'hidden',
  },

  btn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.DARK_BLACK,
  },

  logo: {
    height: 34,
    width: 170,
  },
});

