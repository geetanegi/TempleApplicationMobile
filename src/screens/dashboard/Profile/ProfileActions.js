import React from 'react';
import {View, Text, Pressable, StyleSheet, Share, Alert} from 'react-native';
import {colors} from '../../../global/theme';
import st from '../../../global/styles';

const ProfileActions = ({navigation, profile}) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: `${profile.name}'s Profile`,
        message: `Check out ${profile.name}'s profile on JainSansaar!\n\nUsername: ${profile.username}\njainsansaar:profile/${profile.username}`,
        url: `jainsansaar://profile/${profile.username}`, // useful if you have a deep link or web profile
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with specific app
        } else {
          // shared successfully
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={[styles.btnContainer, st.justify_Row, st.justify_S]}>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('EditProfileScreen', {profile})}>
        <Text style={[st.tx12]}>Edit Profile</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onShare}>
        <Text style={[st.tx12]}>Share Profile</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  button: {
    backgroundColor: colors.grey,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
});

export default ProfileActions;
