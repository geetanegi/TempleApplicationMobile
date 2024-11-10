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
import { getAllCourseDetailList } from '../../../utils/apicalls/betContestHandler';
import { getUserProfileById } from '../../../utils/apicalls/profileHandler';
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
        handleLoginUserProfile(route?.params?.item?.UserId);
      } else {
        handleLoginUserProfile(userid?.userId);
        handleCourseList();
        // getAllCourse();
        // syncUserProfile(userid?.userId);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleLoginUserProfile = async (UserId) => {
    try {
      const playerListData = await getUserProfileById(UserId);
      if (playerListData?.error) {
        setIsLoading(false);
    } else {
      setProfileData(playerListData?.data);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleLoginUserProfile:", error); 
      setIsLoading(false);
      return null; 
    }
  };


  const handleCourseList = async () => {
    try {
      const courseListData = await getAllCourseDetailList();
      if (courseListData?.error) {
        setIsLoading(false);
    } else {
       setCourse(courseListData?.data);
       setIsLoading(false);
      } 
    } catch (error) {
      console.error("Error in handleCourseList:", error); 
      setIsLoading(false);
      return null; 
    }
  };


  useEffect(() => {
    startSync();
    cancel();
  }, []);

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
    <View style={st.ppanel}>
      <View style={{alignItems: 'center'}}>
        <Text style={st.ppanelTitle}>Upload Photo</Text>
        <Text style={st.ppanelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={st.ppanelButton}
        onPress={takePhotoFromCamera}>
        <Text style={st.ppanelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={st.ppanelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={st.ppanelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={st.ppanelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={st.ppanelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={st.pheader}>
      <View style={st.ppanelHeader}>
        <View style={st.ppanelHandle} />
      </View>
    </View>
  );

  return (
    <View style={[st.flex]}>
      <Header
        drawerIcon={backIconVisibility ? false : true}
        navigation={navigation}
        backIcon={backIconVisibility ? true : false}
        title={'Profile'}
      />
      <ScrollView style={st.pcontainer}>
        <View style={st.pprofileContainer}>
          <View style={st.pavatarContainer}>
            {!profileData?.userProfile?.imageBase64 ? (
              <Image source={images.user} style={st.pprofileImage} />
            ) : (
              <Image
                source={{
                  uri: `data:image/jpg;base64,${profileData?.userProfile?.imageBase64}`,
                }}
                style={st.pprofileImage}
              />
            )}

            {route?.params?.item?.item === 'ViewProfile' ? (
              <></>
            ) : (
              <TouchableOpacity
                style={st.pcameraIcon}
                onPress={() => bs.current.snapTo(0)}>
                <FontAwesome name="camera" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
          {/* Profile Information Box */}
          <View style={st.pinfoBoxContainer}>
            {route?.params?.item?.item === 'ViewProfile' ? (
              <></>
            ) : (
              <EditProfileScreen item={profileData} course={course} />
            )}
            {/* <MasterInfo
              firstName={profileData?.firstName}
              lastName={profileData?.lastName}
              location={profileData?.userProfile?.location}
            /> */}

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
        {/* <TabSwitch />
        <PlayerVideo /> */}
      </ScrollView>
    </View>
  );
};
export default ProfileScreen;
