import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MasterInfo from './MasterImformation';
import InformationContainer from './InformationContainer';
import TabSwitch from './TabSwitch';
import {colors, images} from '../../../global/theme';
import {useFocusEffect} from '@react-navigation/native';
import useNetworkStatus from '../../../hooks/networkStatus';
import EditProfileScreen from './EditProfileScreen';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import {store} from '../../../redux/store';
import {API} from '../../../utils/endpoints';
import st from '../../../global/styles';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import Header from '../../../components/Header';
import PlayerVideo from './PlayerVideo';
import {postAuth} from '../../../utils/apicalls/postApi';
const ProfileScreen = ({navigation, route}) => {

  const backIconVisibility = route?.params?.backIconVisibility || false;

  const isConnected = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const bs = useRef(null);
  var fall = new Animated.Value(1);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const loginData = store.getState().logindata?.data?.token;
  const userid = store.getState().logindata.data;
  // const profileData = useSelector(state => state.profile?.data?.data);
  const [profileData, setProfileData] = useState();
  const [course, setCourse] = useState();

  const startSync = () => {
    if (isConnected) {
      setIsLoading(true);
      if (route?.params?.item?.UserId !== undefined) {
        getUserProfile(route?.params?.item?.UserId);
      } else {
        getUserProfile(userid?.userId);
        getAllCourse();
        // getAllCourse();
        // syncUserProfile(userid?.userId);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const getUserProfile = async userId => {
    try {
      const url = API.GET_PROFILE_IMAGE;
      const params = {
        loginUserId: userId,
      };

      const result = await postAuth(url, params)
        .then(data => {
          // store.dispatch(setProfile(data));
          setProfileData(data?.data);
          // getAllCourse();
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      console.log('sync getUserProfile has error', err);
    }
  };

  const getAllCourse = async () => {
    try {
      const url = API.ALL_COURSE;
      const params = {};

      const result = await postAuth(url, params)
        .then(data => {
          setCourse(data?.data);
          console.log(data)
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      console.log('sync getAllProfile has error', err);
    }
  };

  //Start Sync to get data if checklist data is not fetched yet
  useEffect(() => {
    console.log('------------useeffectt--')
    startSync();
    cancel();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('------------useFocusEffect------')
  //     startSync(); // Fetch the data when the screen is focused
  //     cancel();
  //   }, []),
  // );

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      startSync(); // Fetch the data when the screen is focused
      cancel();
      return () => backHandler.remove();
    }, []),
  );
  
  const handleBackPress = () => {
    if(backIconVisibility==true){
      navigation.navigate('Community');
    }else{
      navigation.goBack()
    }
    return true;
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 192,
      compressImageMaxHeight: 192,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      cancel();
      setImage(image);
      saveData(image);
      setIsImageSelected(true);
    });
  };

  const cancel = () => {
    bs.current.snapTo(1);
  };

  const saveData = img => {
    const url = API.UPDATE_PIC;
    if (img != null) {
      const formData = new FormData();
      let timestamp = new Date();
      let fileName = `img ${timestamp.getMinutes()}`;
      if (img != null) {
        formData.append('file', {
          name: 'uploadImage.jpg',
          type: img?.mime,
          uri: img?.path,
          fileName: fileName.img?.mime,
        });
      }
      let body = {
        data: {
          selectedUserId: userid?.userId,
        },
      };
      formData.append('data', {
        string: JSON.stringify(body),
        type: 'application/json',
      });
      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
            Authorization: `Bearer ${loginData}`,
          },
        })
        .then(res => {
          startSync();
          Toast.show(res?.data?.data?.message);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
    }
  };

  const choosePhotoFromLibrary = () => {
    bs.current.snapTo(1);
    ImagePicker.openPicker({
      width: 192,
      height: 192,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      cancel();
      setImage(image);
      saveData(image);
      setIsImageSelected(true);
    });
  };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <View style={[st.flex]}>
      <Header navigation={navigation} backIcon={backIconVisibility ? true : false} title={'Profile'} />
      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {!profileData?.userProfile?.imageBase64 ? (
              <Image source={images.user} style={styles.profileImage} />
            ) : (
              <Image
                source={{
                  uri: `data:image/jpg;base64,${profileData?.userProfile?.imageBase64}`,
                }}
                style={styles.profileImage}
              />
            )}

            {route?.params?.item?.item === 'ViewProfile' ? (
              <></>
            ) : (
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={() => bs.current.snapTo(0)}>
                <FontAwesome name="camera" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
          {/* Profile Information Box */}
          <View style={styles.infoBoxContainer}>
            {/* {route?.params?.item?.item === 'ViewProfile' ? (
              <></>
            ) : (
              <EditProfileScreen item={profileData} course={course} />
            )} */}
            <MasterInfo
              firstName={profileData?.firstName}
              lastName={profileData?.lastName}
              location={profileData?.userProfile?.location}
            />

            {/* Information Grid */}
            {/* <InformationContainer item={profileData?.userProfile} /> */}
          </View>
        </View>
        <BottomSheet
          ref={bs}
          snapPoints={[850, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
        {/* <TabSwitch /> */}
        {/* <PlayerVideo /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
    position: 'relative',
  },

  infoBoxContainer: {
    backgroundColor: colors.white,
    width: '90%',
    // backgroundColor:'red',
    borderRadius: 8,
    paddingTop: 90, // To make space for the profile image
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginTop: -80, // This brings the avatar on top of the box
    alignItems: 'center',
    // zIndex: 0,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  location: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  avatarContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  profileImage: {
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    top: '49%',
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: colors.PRIMARY_BUTTON,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
});

export default ProfileScreen;

