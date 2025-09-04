import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import st from '../../global/styles/index';

const SongSlider = () => {
  const {position, duration} = useProgress();
  const [sliderValue, setSliderValue] = React.useState(0);
  const [isSliding, setIsSliding] = React.useState(false);

  const handleSeek = async value => {
    setIsSliding(false);
    await TrackPlayer.seekTo(value); // seek to new position
  };

  return (
    <View style={[st.wdh100, st.pd10, st.justify_C, st.pd_H20]}>
      <Slider
        value={isSliding ? sliderValue : position}
        minimumValue={0}
        maximumValue={duration || 1} // avoid NaN when duration = 0
        thumbTintColor="orange"
        minimumTrackTintColor="orange"
        maximumTrackTintColor="grey"
        style={[st.wdh100, styles.slider]}
        onSlidingComplete={handleSeek}
        onSlidingStart={() => setIsSliding(true)}
        onValueChange={setSliderValue}
      />
      <View style={[st.justify_Row, st.justify_S, st.pd10, st.pd_H20]}>
        <Text style={styles.time}>
          {new Date(position * 1000).toISOString().substring(14, 19)}
        </Text>
        <Text style={styles.time}>
          {new Date((duration - position) * 1000)
            .toISOString()
            .substring(14, 19)}
        </Text>
      </View>
    </View>
  );
};

export default SongSlider;

const styles = StyleSheet.create({
  slider: {
    height: 10, // ✅ make it touch-friendly
  },
  time: {
    color: '#000',
  },
});
