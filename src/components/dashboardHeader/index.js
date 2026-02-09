import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  rightIcon1BadgeCount,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleNav = (route) => {
    if (!route) return;
    if (route === 'HomeDrawer') {
      navigation.dispatch(DrawerActions.openDrawer());
      return;
    }
    navigation.navigate(route);
  };

  const IconButton = ({ children, onPress }) => {
    return (
      <Pressable onPress={onPress} style={styles.btnPressable}>
        {children}
      </Pressable>
    );
  };

  return (
    <View style={[styles.headerContainer, st.pd_H10, st.mt_B10, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Left */}
      <View style={styles.leftArea}>
        {LeftIcon ? (
          <IconButton
            onPress={onLeftPress ? onLeftPress : () => handleNav(leftNav)}
          >
            <LeftIcon size={22} color={colors.DARK_BLACK} fill={colors.DARK_BLACK} />
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
            <View style={styles.iconWrap}>
              <RightIcon1 size={22} color={colors.DARK_BLACK} fill={colors.white} />
              {rightIcon1BadgeCount != null && rightIcon1BadgeCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {rightIcon1BadgeCount > 99 ? '99+' : rightIcon1BadgeCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </IconButton>
        ) : (
          <View style={{ width: 44 }} />
        )}

        <View style={{ width: 10 }} />

        {RightIcon2 ? (
          <IconButton
            onPress={onRightPress2 ? onRightPress2 : () => handleNav(rightNav2)}
          >
            <RightIcon2 size={22} color={colors.DARK_BLACK} fill={colors.white} />
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
    width: 44,
    height: 44,
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
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

