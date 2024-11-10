import React, { useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet, Image, Dimensions } from 'react-native';

const DraggableButton = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const screenWidth = Dimensions.get('window').width; // Get the screen width

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // We are only interested in horizontal movement (dx), not vertical (dy)
        Animated.event([null, { dx: pan.x }], {
          useNativeDriver: false,
          listener: null, // Or handle with a listener
        })(event, gestureState);
      },
      onPanResponderRelease: (e, gesture) => {
        const screenWidth = Dimensions.get('window').width; // Get the screen width
        // Move back to the start position if not dragged far enough
        if (gesture.dx < screenWidth * 0.5) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          // Optionally, snap to the end if dragged far enough
          Animated.spring(pan, {
            toValue: { x: screenWidth * 0.6, y: 0 }, // Adjust the snap point to the end
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  

  return (
    <View style={styles.container}>
      {/* Ready Text */}
      <Text style={styles.readyText}>YES, I'M READY TO HIT</Text>

      {/* Draggable Button */}
      <View style={styles.track}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[pan.getLayout(), styles.draggableButton]}
        >
          {/* <Image source={require('./golf-ball-icon.png')} style={styles.golfIcon} /> */}
          <Text style={styles.moveText}>Move</Text>
          <Text style={styles.arrowText}>›››</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  readyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  track: {
    width: '100%',
    height: 60,
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  draggableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
  },
  golfIcon: {
    width: 30,
    height: 30,
  },
  moveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  arrowText: {
    fontSize: 18,
    color: '#888',
  },
});

export default DraggableButton;
