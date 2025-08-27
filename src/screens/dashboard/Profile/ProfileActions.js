import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {colors} from '../../../global/theme';
import st from '../../../global/styles';

const ProfileActions = ({navigation}) => (
  <View style={[styles.btnContainer, st.justify_Row, st.justify_S]}>
    <Pressable
      style={styles.button}
      onPress={() => navigation.navigate('EditProfileScreen')}>
      <Text style={[st.tx12]}>Edit Profile</Text>
    </Pressable>
    <Pressable
      style={styles.button}
      onPress={() => navigation.navigate('EditProfileScreen')}>
      <Text style={[st.tx12]}>Share Profile</Text>
    </Pressable>
  </View>
);

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
