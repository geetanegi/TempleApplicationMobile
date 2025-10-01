import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import st from '../../../global/styles';
import Input from '../../../components/input';
import Button from '../../../components/button';
const {width} = Dimensions.get('window');
const ProfileEditScreen = ({route}) => {
  const {profile} = route.params;
  return (
    <SafeAreaView style={[st.flex]}>
      <View style={styles.profileSection}>
        <Image source={{uri: profile.avatar}} style={styles.avatar} />
        {/* <View style={styles.profileDetails}>
          <Text style={styles.username}>{profile.name}</Text>
          <View style={[st.row, st.justify_S]}>
            <View style={st.mt_t10}>
              <Text style={st.tx14}>{profile.posts}</Text>
              <Text style={st.tx14}>Posts</Text>
            </View>
            <View style={st.mt_t10}>
              <Text style={st.tx14}>{profile.followers}</Text>
              <Text style={st.tx14}>Followers</Text>
            </View>
            <View style={st.mt_t10}>
              <Text style={st.tx14}>{profile.following}</Text>
              <Text style={st.tx14}>Following</Text>
            </View>
          </View>
        </View> */}
        <View>
          <Input
            label={'Name'}
            inputsty={styles.inputsty}
            labelColor={'gray'}
            defaulValue={profile.name}
          />
          <Input
            label={'Username'}
            inputsty={styles.inputsty}
            labelColor={'gray'}
            defaulValue={profile.username}
          />
          <Input
            label={'Bio'}
            inputsty={[styles.inputsty, {height: 'auto'}]}
            labelColor={'gray'}
            multiLine={true}
            defaulValue={profile.bio}
          />
        </View>
        <View style={[st.gap20, {width: width - 40, marginTop: 10}]}>
          <Pressable style={[{}]}>
            <Text style={styles.secBtn}>Change Password</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.secBtn}>Change Email</Text>
          </Pressable>
        </View>
        <Button
          title={'Save'}
          backgroundColor={'orange'}
          buttonExtendedStyle={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'column',
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 70,
    marginVertical: 10,
  },
  username: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  inputsty: {
    width: width - 40,
    borderWidth: 0.5,
    marginTop: 5,
    borderColor: 'grey',
    marginBottom: 10,
  },
  btn: {
    width: width - 40,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 110,
    paddingVertical: 12,
  },
  secBtn: {
    textDecorationLine: 'underline',
    color: 'blue',
    fontSize: 14,
  },
});
