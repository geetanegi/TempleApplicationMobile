// import React, {useCallback, useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   BackHandler,
// } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MasterInfo from './MasterImformation';
// import InformationContainer from './InformationContainer';
// import TabSwitch from './TabSwitch';
// import {colors, images} from '../../../global/theme';
// import {useFocusEffect} from '@react-navigation/native';
// import useNetworkStatus from '../../../hooks/networkStatus';
// import EditProfileScreen from './EditProfileScreen';
// import BottomSheet from 'reanimated-bottom-sheet';
// import ImagePicker from 'react-native-image-crop-picker';
// import Animated from 'react-native-reanimated';
// import {store} from '../../../redux/store';
// import {API} from '../../../utils/endpoints';
// import st from '../../../global/styles';
// import Toast from 'react-native-simple-toast';
// import axios from 'axios';
// import Header from '../../../components/Header';
// import PlayerVideo from './PlayerVideo';
// import { getAllCourseDetailList } from '../../../utils/apicalls/betContestHandler';
// import { getUserProfileById } from '../../../utils/apicalls/profileHandler';
// const ProfileScreen = ({navigation, route}) => {
//   const backIconVisibility = route?.params?.backIconVisibility || false;
//   const isConnected = useNetworkStatus();
//   const [isLoading, setIsLoading] = useState(false);
//   const [image, setImage] = useState(null);
//   const bs = useRef(null);
//   var fall = new Animated.Value(1);
//   const [isImageSelected, setIsImageSelected] = useState(false);
//   const loginData = store.getState().logindata?.data?.token;
//   const userid = store.getState().logindata.data;
//   // const profileData = useSelector(state => state.profile?.data?.data);
//   const [profileData, setProfileData] = useState();
//   const [course, setCourse] = useState();

//   const startSync = () => {
//     if (isConnected) {
//       setIsLoading(true);
//       if (route?.params?.item?.UserId !== undefined) {
//         handleLoginUserProfile(route?.params?.item?.UserId);
//       } else {
//         handleLoginUserProfile(userid?.userId);
//         handleCourseList();
//         // getAllCourse();
//         // syncUserProfile(userid?.userId);
//       }
//       setIsLoading(false);
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const handleLoginUserProfile = async (UserId) => {
//     try {
//       const playerListData = await getUserProfileById(UserId);
//       if (playerListData?.error) {
//         setIsLoading(false);
//     } else {
//       setProfileData(playerListData?.data);
//        setIsLoading(false);
//       }
//     } catch (error) {
//       console.error("Error in handleLoginUserProfile:", error);
//       setIsLoading(false);
//       return null;
//     }
//   };

//   const handleCourseList = async () => {
//     try {
//       const courseListData = await getAllCourseDetailList();
//       if (courseListData?.error) {
//         setIsLoading(false);
//     } else {
//        setCourse(courseListData?.data);
//        setIsLoading(false);
//       }
//     } catch (error) {
//       console.error("Error in handleCourseList:", error);
//       setIsLoading(false);
//       return null;
//     }
//   };

//   useEffect(() => {
//     startSync();
//     cancel();
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         handleBackPress,
//       );
//       startSync(); // Fetch the data when the screen is focused
//       cancel();
//       return () => backHandler.remove();
//     }, []),
//   );

//   const handleBackPress = () => {
//     if(backIconVisibility==true){
//       navigation.navigate('Community');
//     }else{
//       navigation.goBack()
//     }
//     return true;
//   };

//   const takePhotoFromCamera = () => {
//     ImagePicker.openCamera({
//       compressImageMaxWidth: 192,
//       compressImageMaxHeight: 192,
//       cropping: true,
//       compressImageQuality: 0.7,
//     }).then(image => {
//       cancel();
//       setImage(image);
//       saveData(image);
//       setIsImageSelected(true);
//     });
//   };

//   const cancel = () => {
//     bs.current.snapTo(1);
//   };

//   const saveData = img => {
//     const url = API.UPDATE_PIC;
//     if (img != null) {
//       const formData = new FormData();
//       let timestamp = new Date();
//       let fileName = `img ${timestamp.getMinutes()}`;
//       if (img != null) {
//         formData.append('file', {
//           name: 'uploadImage.jpg',
//           type: img?.mime,
//           uri: img?.path,
//           fileName: fileName.img?.mime,
//         });
//       }
//       let body = {
//         data: {
//           selectedUserId: userid?.userId,
//         },
//       };
//       formData.append('data', {
//         string: JSON.stringify(body),
//         type: 'application/json',
//       });
//       axios
//         .post(url, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Accept: 'application/json',
//             Authorization: `Bearer ${loginData}`,
//           },
//         })
//         .then(res => {
//           startSync();
//           Toast.show(res?.data?.data?.message);
//         })
//         .catch(e => {
//           console.log(e);
//         });
//     } else {
//     }
//   };

//   const choosePhotoFromLibrary = () => {
//     bs.current.snapTo(1);
//     ImagePicker.openPicker({
//       width: 192,
//       height: 192,
//       cropping: true,
//       compressImageQuality: 0.7,
//     }).then(image => {
//       cancel();
//       setImage(image);
//       saveData(image);
//       setIsImageSelected(true);
//     });
//   };

//   const renderInner = () => (
//     <View style={st.ppanel}>
//       <View style={{alignItems: 'center'}}>
//         <Text style={st.ppanelTitle}>Upload Photo</Text>
//         <Text style={st.ppanelSubtitle}>Choose Your Profile Picture</Text>
//       </View>
//       <TouchableOpacity
//         style={st.ppanelButton}
//         onPress={takePhotoFromCamera}>
//         <Text style={st.ppanelButtonTitle}>Take Photo</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={st.ppanelButton}
//         onPress={choosePhotoFromLibrary}>
//         <Text style={st.ppanelButtonTitle}>Choose From Library</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={st.ppanelButton}
//         onPress={() => bs.current.snapTo(1)}>
//         <Text style={st.ppanelButtonTitle}>Cancel</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={st.pheader}>
//       <View style={st.ppanelHeader}>
//         <View style={st.ppanelHandle} />
//       </View>
//     </View>
//   );

//   return (
//     <View style={[st.flex]}>
//       <Header
//         drawerIcon={backIconVisibility ? false : true}
//         navigation={navigation}
//         backIcon={backIconVisibility ? true : false}
//         title={'Profile'}
//       />
//       <ScrollView style={st.pcontainer}>
//         <View style={st.pprofileContainer}>
//           <View style={st.pavatarContainer}>
//             {!profileData?.userProfile?.imageBase64 ? (
//               <Image source={images.user} style={st.pprofileImage} />
//             ) : (
//               <Image
//                 source={{
//                   uri: `data:image/jpg;base64,${profileData?.userProfile?.imageBase64}`,
//                 }}
//                 style={st.pprofileImage}
//               />
//             )}

//             {route?.params?.item?.item === 'ViewProfile' ? (
//               <></>
//             ) : (
//               <TouchableOpacity
//                 style={st.pcameraIcon}
//                 onPress={() => bs.current.snapTo(0)}>
//                 <FontAwesome name="camera" size={20} color="white" />
//               </TouchableOpacity>
//             )}
//           </View>
//           {/* Profile Information Box */}
//           <View style={st.pinfoBoxContainer}>
//             {route?.params?.item?.item === 'ViewProfile' ? (
//               <></>
//             ) : (
//               <EditProfileScreen item={profileData} course={course} />
//             )}
//             {/* <MasterInfo
//               firstName={profileData?.firstName}
//               lastName={profileData?.lastName}
//               location={profileData?.userProfile?.location}
//             /> */}

//             {/* Information Grid */}
//             {/* <InformationContainer item={profileData?.userProfile} /> */}
//           </View>
//         </View>
//         <BottomSheet
//           ref={bs}
//           snapPoints={[850, 0]}
//           renderContent={renderInner}
//           renderHeader={renderHeader}
//           initialSnap={1}
//           callbackNode={fall}
//           enabledGestureInteraction={true}
//         />
//         {/* <TabSwitch />
//         <PlayerVideo /> */}
//       </ScrollView>
//     </View>
//   );
// };
// export default ProfileScreen;
import React from 'react';
import {Pressable} from 'react-native';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import st from '../../../global/styles';
import Header from '../../../components/Header';
import ProfileHeader from './ProfileHeader';
import BioSection from './BioSection';
import ProfileActions from './ProfileActions';
import TabBar from './TabBar';
import {Eye} from 'lucide-react-native'; // or use react-native-vector-icons
import DialogComponent from '../../../components/dialog';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/native';
const profileData = {
  username: 'john_doe',
  name: 'John Doe',
  bio: 'Lover of code, coffee and cats 8888888lppkp-------------------------- 🐾',
  avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
  videoData: [
    {
      id: '1',
      thumbnail:
        'https://images.pexels.com/photos/33639142/pexels-photo-33639142.jpeg',
      views: '3.5 M',
      caption: 'My first travel vlog 🌍✈️',
    },
    {
      id: '2',
      thumbnail:
        'https://images.pexels.com/photos/33639137/pexels-photo-33639137.jpeg',
      views: '64 M',
      caption: 'Behind the scenes 🎬',
    },
    {
      id: '3',
      thumbnail:
        'https://images.pexels.com/photos/33647384/pexels-photo-33647384.jpeg',
      views: '15.2 M',
      caption: 'A day in the life ☕💻',
    },
    {
      id: '4',
      thumbnail:
        'https://images.pexels.com/photos/33647384/pexels-photo-33647384.jpeg',
      views: '11.2 M',
      caption: 'Chill vibes with friends 🎶',
    },
  ],

  photos: Array.from({length: 16}).map((_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/id/${i + 10}/300/300`,
    caption: `This is caption for photo ${i + 1}`,
    likes: 2,
  })),
};
const TABS = ['Photo', 'Text', 'Video'];

const numColumns = 3;
const imageSize = Dimensions.get('window').width / numColumns;
const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation, route}) => {
  const [activeTab, setActiveTab] = React.useState('Photo');
  const [visible, setVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedCaption, setSelectedCaption] = React.useState('');
  const navigate = useNavigation();
  const backIconVisibility = route?.params?.backIconVisibility || false;

  const showDialog = (img, caption) => {
    setSelectedImage(img);
    setSelectedCaption(caption);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedImage(null);
    setSelectedCaption('');
  };

  return (
    <View style={st.flex}>
      <Header
        drawerIcon={!backIconVisibility}
        navigation={navigation}
        backIcon={backIconVisibility}
        title={'@' + profileData.username}
      />
      <SafeAreaView style={[styles.container]}>
        <FlatList
          key={
            activeTab === 'Photo'
              ? 'photo-grid'
              : activeTab === 'Video'
              ? 'video-grid'
              : 'text-list'
          }
          data={
            activeTab === 'Photo'
              ? profileData.photos
              : activeTab === 'Video'
              ? profileData.videoData
              : profileData.photos
          }
          numColumns={
            activeTab === 'Photo' ? numColumns : activeTab === 'Video' ? 3 : 1
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            if (activeTab === 'Photo') {
              return (
                <Pressable
                  onPress={() =>
                    navigate.navigate('Posts', {
                      posts: profileData.photos,
                      initialIndex: item.id,
                    })
                  }>
                  <Image source={{uri: item.url}} style={styles.gridImage} />
                </Pressable>
              );
            }
            if (activeTab === 'Text') {
              return <Text style={styles.contentText}>{item.caption}</Text>;
            }
            if (activeTab === 'Video') {
              return (
                <View style={styles.videoItem}>
                  <Image
                    source={{uri: item.thumbnail}}
                    style={styles.thumbnail}
                  />
                  <View style={styles.overlay}>
                    <Eye color="white" size={16} />
                    <Text style={styles.viewText}>{item.views}</Text>
                  </View>
                </View>
              );
            }

            return null;
          }}
          ListHeaderComponent={
            <>
              <ProfileHeader
                avatar={profileData.avatar}
                name={profileData.name}
                posts={profileData.photos.length}
                followers={'10k'}
                following={'120'}
              />
              <BioSection bio={profileData.bio} />
              <ProfileActions navigation={navigation} profile={profileData} />
              <TabBar
                tabs={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {/* <GridView data={profileData.photos} activeTab={activeTab} /> */}
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Dialog */}
      <DialogComponent visible={visible} onCancel={handleCancel}>
        {selectedImage && (
          <>
            <Image
              source={{uri: selectedImage}}
              style={styles.largeImage}
              resizeMode="cover"
            />
            <View style={[st.justify_Row, st.justify_S]}>
              <Text style={[st.txAlignC, st.pd_H10, st.tx14]}>
                {selectedCaption}
              </Text>
              <View style={[st.justify_Row, st.pd_H10]}>
                <EvilIcons name="like" color="#292929ff" size={28} />
                <EvilIcons name="comment" color="#292929ff" size={28} />
              </View>
            </View>
          </>
        )}
      </DialogComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: -10},
  gridImage: {width: imageSize, height: imageSize, margin: 1},

  // Video grid
  videoItem: {
    width: Dimensions.get('window').width / 3, // 2 columns
    height: (Dimensions.get('window').width / 2) * 1.3, // keep aspect ratio
    margin: 1,
    position: 'relative',
  },
  contentText: {
    fontSize: 16,
    margin: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  viewText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  largeImage: {
    width: width - 10,
    minHeight: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
