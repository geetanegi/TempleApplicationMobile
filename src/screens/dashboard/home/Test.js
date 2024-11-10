import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
const {width} = Dimensions.get('window');

const SwipeButton = ({onPressMove, lockBtn}) => {
  const [swipeX, setSwipeX] = useState(new Animated.Value(0));
  const [isSwipe, setIsSwipe] = useState(false);
  const maxSwipeDistance = width * 0.72;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, {dx: swipeX}], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > maxSwipeDistance / 2) {
        Animated.timing(swipeX, {
          toValue: maxSwipeDistance,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setIsSwipe(true);
          onPressMove(true);
   //       console.log('Action confirmed!');
        });
      } else {
        Animated.timing(swipeX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setIsSwipe(false);
          onPressMove(false);
     //     console.log('Not completed!');
        });
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.swipeContainer}>
        <View
          style={[
            styles.buttonBackground,
            {backgroundColor: isSwipe ? colors.green : colors.grey},
          ]}>
          <Text style={styles.moveText}>Move</Text>
          <Text style={styles.arrowText}>{'>>>>'}</Text>
        </View>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.swipeableCircle, {transform: [{translateX: swipeX}]}]}>
          <Image
            source={lockBtn ? images.lockIcon : images.ball}
            style={styles.golfIcon}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  swipeContainer: {
    width: width * 0.8,
    height: 32,
    justifyContent: 'center',
    borderRadius: 25,
  },

  buttonBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  moveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1A0CCC',
    textAlign: 'center',
    left: '420%',
  },
  arrowText: {
    fontSize: 20,
    color: '#4d4d4d',
  },
  swipeableCircle: {
    width: 32,
    height: 32,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  golfIcon: {
    width: 44,
    height: 44,
  },
});

export default SwipeButton;
