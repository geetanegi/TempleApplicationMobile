import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import st from '../../../global/styles';
const ProfileHeader = ({avatar, name, posts, followers, following}) => (
  <View style={styles.profileSection}>
    <Image source={{uri: avatar}} style={styles.avatar} />
    <View style={styles.profileDetails}>
      <Text style={styles.username}>{name}</Text>
      <View style={[st.row, st.justify_S]}>
        <View style={st.mt_t10}>
          <Text style={st.tx14}>{posts}</Text>
          <Text style={st.tx14}>Posts</Text>
        </View>
        <View style={st.mt_t10}>
          <Text style={st.tx14}>{followers}</Text>
          <Text style={st.tx14}>Followers</Text>
        </View>
        <View style={st.mt_t10}>
          <Text style={st.tx14}>{following}</Text>
          <Text style={st.tx14}>Following</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 20,
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
});

export default ProfileHeader;
