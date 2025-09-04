import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import React from 'react';
import {Dimensions} from 'react-native';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {musicList} from '../../../dummy';
import SongInfo from '../../../components/song/SongInfo';
import SongSlider from '../../../components/song/SongSlider';
import ControlCenter from '../../../components/song/ControlCenter';
import {FlatList} from 'react-native-gesture-handler';
import {WIDTH} from '../../../global/fonts';

musicList;
const {width, height} = Dimensions.get('window');

const MusicPlayer = () => {
  const [track, setTrack] = React.useState(null);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged) {
      const trackIndex = event.nextTrack;
      if (trackIndex !== null) {
        const playingTrack = await TrackPlayer.getTrack(trackIndex);
        setTrack(playingTrack);
      }
    }
  });

  React.useEffect(() => {
    const loadCurrentTrack = async () => {
      const currentIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentIndex !== null) {
        const currentTrack = await TrackPlayer.getTrack(currentIndex);
        setTrack(currentTrack);
      }
    };
    loadCurrentTrack();
  }, []);

  const renderArtWork = () => {
    return (
      <SafeAreaView>
        <View>
          {track?.artwork && (
            <Image
              source={{uri: track.artwork}}
              style={{width: 200, height: 200, borderRadius: 10}}
            />
          )}
        </View>
      </SafeAreaView>
    );
  };
  console.log(track);

  return (
    <View style={styles.container}>
      {track?.artwork && (
        <Image source={{uri: track.artwork}} style={styles.artwork} />
      )}
      <SongInfo track={track} />
      <SongSlider />
      <ControlCenter />
    </View>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    width: width,
    padding: 10,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 10,
  },
});
