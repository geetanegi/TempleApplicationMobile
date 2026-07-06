import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, getFocusedRouteNameFromRoute, useFocusEffect} from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import {APP_TEXT, colors, images} from '../../../global/theme';
import st from '../../../global/styles';

// Screens
import Community from '../../dashboard/community/CommunityList';

import ProfilePage from '../../dashboard/Profile/Profilepage';



import MainDashboard from '../../dashboard/Main/dashboard';
import SongsPage from '../../dashboard/songs';
import NotificationScreen from '../../dashboard/notification';
import VideoScreen from '../../dashboard/Main/videoScreen';
import PostScreen from '../../dashboard/posts';
import SubCategoryPage from '../../dashboard/jeevani/subCategory';
import JevaaniScreen from '../../dashboard/jeevani';
import SearchScreen from '../../dashboard/search';
import EditProfileScreen from '../../dashboard/Profile/EditProfileScreen';
import ViewPdf from '../../dashboard/Pdf/ViewPdf';
import ImageScreen from '../../dashboard/Main/imageScreen';
import StoryUploadScreen from '../../dashboard/Main/StoryUploadScreen';
import StoryViewScreen from '../../dashboard/Main/StoryViewScreen';
import ImagePicker from '../../../components/Posts/imagepicker';
import YouTubePlayerScreen from '../../dashboard/VideosReels/YouTubePlayerScreen';
import ReelsStack from '../../dashboard/Reels/ReelsStack';
import TempleList from '../../dashboard/TempleList';
import TempleDetails from '../../dashboard/TempleList/TempleDetails';
import LocateTempleScreen from '../../dashboard/TempleList/LocateTempleScreen';
import {MapPinned} from 'lucide-react-native';

import HomeIcon from '../../../components/icons/HomeIcon';
import JevaaniIcon from '../../../components/icons/JevaaniIcon';
import TempleIcon from '../../../components/icons/TempleIcon';
import VideoIcon from '../../../components/icons/VideoIcon';
import ProfileIcon from '../../../components/icons/ProfileIcon';
import { getUserId } from '../../../redux/store/getState';
import { getUserProfileById } from '../../../utils/apicalls/profileHandler';
import { setTempleBarRefreshCallback } from '../../../utils/templeBarRefresh';
import { prefetchReels } from '../../../utils/reelsPrefetchService';

// --------------------------------
// Stack Navigators
// --------------------------------
const HomeStack = createStackNavigator();
const JeevaniStack = createStackNavigator();


import ProfileScreen from '../../dashboard/Profile/Profilepage';
import PostPreviewScreen from '../../dashboard/Profile/PostPreviewScreen';
import CreateContentChoiceScreen from '../../dashboard/Profile/CreateContentChoiceScreen';
import FollowListScreen from '../../dashboard/Profile/FollowListScreen';
import ChatListScreen from '../../dashboard/chat/ChatListScreen';
import ChatScreen from '../../dashboard/chat/ChatScreen';




const ProfileStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Community" component={Community} />
    <HomeStack.Screen name="EditProfile" component={ProfilePage} />
    <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
    <HomeStack.Screen
      name="AllLeaderBoardVedio"
      component={AllLeaderBoardVedio}
    />
  </HomeStack.Navigator>
);

/** Stack for Profile tab: profile screen + followers/following list + locate temple. */
const ProfileTabStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="ProfileMain" component={ProfileScreen} />
    <HomeStack.Screen
      name="CreateContentChoice"
      options={{ headerShown: false }}
      component={CreateContentChoiceScreen}
    />
    <HomeStack.Screen
      name="FollowList"
      options={{ headerShown: false }}
      component={FollowListScreen}
    />
    <HomeStack.Screen
      name="Profiles"
      options={{ headerShown: false }}
      component={ProfileScreen}
    />
    <HomeStack.Screen
      name="EditProfileScreen"
      options={{headerShown: true, title: 'Edit Profile'}}
      component={EditProfileScreen}
    />
    <HomeStack.Screen
      name="LocateTempleScreen"
      options={({ navigation }) => ({
        headerShown: true,
        title: 'Locate your temple',
        headerTitleAlign: 'center',
        headerBackVisible: false,
        headerLeft: () => null,
        headerRight: () => (
          <Pressable onPress={() => navigation.goBack()} style={{paddingRight: 16}}>
            <Text style={{fontSize: 16, color: colors.orange, fontWeight: '600'}}>Close</Text>
          </Pressable>
        ),
      })}
      component={LocateTempleScreen}
    />
    <HomeStack.Screen
      name="PostPreview"
      options={{ headerShown: false }}
      component={PostPreviewScreen}
    />
  </HomeStack.Navigator>
);


const HomeStackScreens = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      options={{headerShown: false}}
      name="MainDashboard"
      component={MainDashboard}
    />
    <HomeStack.Screen
      name="SongScreen"
      options={{
        headerTitle: 'Songs',
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 18},
      }}
      component={SongsPage}
    />
    <HomeStack.Screen
      name="VideoScreen"
      options={{
        headerTitle: 'Videos',
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 18},
      }}
      component={VideoScreen}
    />
    <HomeStack.Screen
      name="ImageScreen"
      options={{
        headerTitle: 'Images',
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 18},
      }}
      component={ImageScreen}
    />
    <HomeStack.Screen
      name="SearchScreen"
      options={{headerShown: false}}
      component={SearchScreen}
    />
    <HomeStack.Screen
      name="StoryUploadScreen"
      options={{headerShown: false}}
      component={StoryUploadScreen}
    />
    <HomeStack.Screen
      name="StoryViewScreen"
      options={{headerShown: false}}
      component={StoryViewScreen}
    />
    <HomeStack.Screen
      name="Profiles"
      options={{headerShown: false}}
      component={ProfilePage}
    />
    <HomeStack.Screen
      name="EditProfileScreen"
      options={{headerShown: true, title: 'Edit Profile'}}
      component={EditProfileScreen}
    />
    <HomeStack.Screen
      name="CreatePost"
      options={{headerShown: true, title: 'New Post'}}
      component={ImagePicker}
    />
    <HomeStack.Screen name="Posts" component={PostScreen} />
    {/* <HomeStack.Screen
      name="VideoPlayer"
      options={{
        headerTitleAlign: 'center',
        headerTitle: 'Video Player',
        headerTitleStyle: {fontSize: 18},
      }}
      component={VideoPlayer}
    /> */}
    <HomeStack.Screen
      name="PostPreview"
      options={{ headerShown: false }}
      component={PostPreviewScreen}
    />
    <HomeStack.Screen
      name="FollowList"
      options={{ headerShown: false }}
      component={FollowListScreen}
    />
    <HomeStack.Screen
      name="Chat"
      options={{ headerShown: true, title: 'Chats', headerTitleAlign: 'center' }}
      component={ChatListScreen}
    />
    <HomeStack.Screen
      name="ChatScreen"
      options={{ headerShown: false }}
      component={ChatScreen}
    />
    <HomeStack.Screen
      name="YouTubePlayer"
      options={{
        headerShown: false,
      }}
      component={YouTubePlayerScreen}
    />
        <HomeStack.Screen
      name="Notifications"
      options={{
        headerTitleAlign: 'center',
        headerTitle: 'Notifications',
        headerTitleStyle: {fontSize: 18},
      }}
      component={NotificationScreen}
    />
    <HomeStack.Screen
      name="TempleList"
      options={{
        headerShown: false,
      }}
      component={TempleList}
    />
  </HomeStack.Navigator>
);

const TempleListStack = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="TempleList" component={TempleList} />
    <HomeStack.Screen name="TempleDetails" component={TempleDetails} />
  </HomeStack.Navigator>
);

const JeevaniScreenStack = () => {
  return (
    <JeevaniStack.Navigator>
      <JeevaniStack.Screen
        name="Jinvani"
        options={{headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18}}}
        component={JevaaniScreen}
      />
      <JeevaniStack.Screen
        name="SubCategoryPage"
        options={{
          headerShown: false,
        }}
        component={SubCategoryPage}
      />
      <JeevaniStack.Screen
        name="ViewPDF"
        options={{
          headerShown: false,
        }}
        component={ViewPdf}
      />
    </JeevaniStack.Navigator>
  );
};

// --------------------------------
// Custom Components
// --------------------------------
const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -24,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}>
    <View style={{width: 65, height: 65, borderRadius: 57.5}}>{children}</View>
  </TouchableOpacity>
);
const renderTabImage =
  (image, name) =>
  ({focused}) =>
    (
      <View style={st.icon}>
        <Image
          source={image}
          style={{
            width: 28,
            height: 28,
            tintColor: focused ? colors.orange : colors.ICON_GREY,
            alignSelf: 'center',
            opacity: focused ? 1 : 0.5,
          }}
        />
      </View>
    );

/** Renders a custom SVG tab icon - focused: white in orange circle, unfocused: grey */
const renderCustomTabIcon = (IconComponent) => ({focused}) => {
  if (focused) {
    return (
      <View style={styles.tabIconWrap}>
        <View style={styles.tabIconActive}>
          <IconComponent size={20} color="#fff" />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.tabIconWrap}>
      <IconComponent size={22} color="#B5B5B5" />
    </View>
  );
};


const Tab = createBottomTabNavigator();

const FLOATING_TAB_BAR_STYLE = {
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  elevation: 5,
  backgroundColor: '#fff',
  borderRadius: 15,
  height: 64,
  paddingTop: 0,
  paddingBottom: 0,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowOffset: {width: 0, height: 5},
  shadowRadius: 10,
};

const TEMPLE_CHECK_THROTTLE_MS = 60000;

export default function BottomNavigation() {
  const navigation = useNavigation();
  const [showLocateTemplePrompt, setShowLocateTemplePrompt] = useState(false);
  const lastTempleCheckRef = useRef(0);

  const checkTempleUserNeedsLocate = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setShowLocateTemplePrompt(false);
      return;
    }
    try {
      const profile = await getUserProfileById(userId);
      const isTempleMember = Boolean(profile?.isTempleMember);
      const temple = profile?.temple;
      const hasLocation = temple && temple.latitude != null && temple.longitude != null;
      setShowLocateTemplePrompt(isTempleMember && !hasLocation);
    } catch {
      setShowLocateTemplePrompt(false);
    }
  }, []);

  useEffect(() => {
    checkTempleUserNeedsLocate();
    prefetchReels();
  }, [checkTempleUserNeedsLocate]);

  useEffect(() => {
    setTempleBarRefreshCallback(checkTempleUserNeedsLocate);
  }, [checkTempleUserNeedsLocate]);

  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      if (now - lastTempleCheckRef.current < TEMPLE_CHECK_THROTTLE_MS) return;
      lastTempleCheckRef.current = now;
      checkTempleUserNeedsLocate();
    }, [checkTempleUserNeedsLocate]),
  );

  return (
    <>
    {showLocateTemplePrompt && (
      <Pressable
        style={styles.locateTempleBar}
        onPress={() => navigation.navigate('Profile')}
      >
        <MapPinned size={20} color="#fff" />
        <Text style={styles.locateTempleBarText}>Locate your temple to complete your profile</Text>
      </Pressable>
    )}
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: true,
        tabBarActiveTintColor: colors.orange,
        tabBarStyle: FLOATING_TAB_BAR_STYLE,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreens}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'MainDashboard';
          const hideBar = routeName === 'YouTubePlayer' || routeName === 'StoryUploadScreen' || routeName === 'StoryViewScreen' || routeName === 'EditProfileScreen' || routeName === 'CreatePost' || routeName === 'Chat' || routeName === 'ChatScreen' || routeName === 'PostPreview' || routeName === 'Notifications' || routeName === 'FollowList' || routeName === 'Profiles' || routeName === 'SearchScreen';
          return {
            tabBarIcon: renderCustomTabIcon(HomeIcon),
            headerShown: false,
            tabBarStyle: hideBar ? {...FLOATING_TAB_BAR_STYLE, display: 'none'} : FLOATING_TAB_BAR_STYLE,
          };
        }}
      />
      <Tab.Screen
        name="Jevaani"
        component={JeevaniScreenStack}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Jevaani';
          const hideBar = routeName === 'ViewPDF';
          return {
            tabBarIcon: renderCustomTabIcon(JevaaniIcon),
            headerShown: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 18},
            tabBarStyle: hideBar ? {...FLOATING_TAB_BAR_STYLE, display: 'none'} : FLOATING_TAB_BAR_STYLE,
          };
        }}
      />

      <Tab.Screen
        name="Temples"
        component={TempleListStack}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'TempleList';
            if (focusedRoute === 'TempleDetails') {
              e.preventDefault();
              navigation.navigate('Temples', { screen: 'TempleList' });
            }
          },
        })}
        options={{
          tabBarIcon: renderCustomTabIcon(TempleIcon),
          headerShown: false,
          tabBarStyle: FLOATING_TAB_BAR_STYLE,
        }}
      />

      {/* <Tab.Screen
        name="New Post"
        component={ImagePicker}
        options={{
          tabBarIcon: () => (
            <View style={styles.createBtn}>
              <AntDesign name="plus" color="#fff" size={24} />
            </View>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 18},
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      /> */}

      <Tab.Screen
        name="Video"
        component={ReelsStack}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'ReelsFeed';
            if (focusedRoute === 'PostReel') {
              e.preventDefault();
              navigation.navigate('Video', { screen: 'ReelsFeed' });
            }
          },
        })}
        options={{
          tabBarIcon: renderCustomTabIcon(VideoIcon),
          headerShown: false,
          tabBarStyle: { ...FLOATING_TAB_BAR_STYLE, display: 'none' },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileTabStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileMain';
          const hideBar = routeName === 'FollowList' || routeName === 'Profiles' || routeName === 'PostPreview' || routeName === 'LocateTempleScreen' || routeName === 'CreateContentChoice' || routeName === 'EditProfileScreen';
          const isFollowList = routeName === 'FollowList';
          return {
            headerShown: false,
            headerTitle: 'Profile',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 18 },
            headerLeft: undefined,
            tabBarIcon: renderCustomTabIcon(ProfileIcon),
            tabBarStyle: hideBar ? {...FLOATING_TAB_BAR_STYLE, display: 'none'} : FLOATING_TAB_BAR_STYLE,
          };
        }}
      />
    </Tab.Navigator>
    </>
  );
}

// --------------------------------
// Styles
// --------------------------------
const styles = StyleSheet.create({
  tabIconWrap: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange,
  },
  locateTempleBar: {
    position: 'absolute',
    bottom: 88,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.orange,
    borderRadius: 12,
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  locateTempleBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  shadow: {
    shadowColor: '#7cc242',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  createBtn: {
    width: 64,
    height: 64,
    alignSelf: 'center',
    marginTop: 6,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 55,
  },
});
