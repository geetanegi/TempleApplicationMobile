import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {APP_TEXT, colors, images} from '../../../global/theme';
import {House, Users, User, CircleDollarSign, Hand} from 'lucide-react-native';
import st from '../../../global/styles';
import Community from '../../dashboard/community/CommunityList';
import CourceDetails from '../../dashboard/betCentral/HoleScreen';
import CourceCart from '../../dashboard/betCentral/TeeScreen';
import PayingCart from '../../dashboard/betCentral/CheckoutCart';
import ProfileCard from '../../dashboard/Profile/Profilepage';
import {createStackNavigator} from '@react-navigation/stack';
import QRCodeScanner from '../../dashboard/QrScanner/scan';
import EnterQueueHome from '../../dashboard/EnterQueue/EnterQueueHome';
import RecordResult from '../../dashboard/EnterQueue/RecordYourResult';
import AchievementScreen from '../../dashboard/EnterQueue/AchievmentScreen';
import TeeBoxScreen from '../../dashboard/EnterQueue/TeeScreen';
import CountdownBox from '../../dashboard/EnterQueue/CountdownBox';
import TeeBoxResults from '../../dashboard/EnterQueue/TeeBoxResult';
import HitTheGreen from '../../dashboard/EnterQueue/HitTheGreen';
import CourseScreen from '../../dashboard/betCentral/CourseScreen';
import Dashboard from '../../dashboard/HomeScreen/HomeDashBoard';
import VedioHighlights from '../../dashboard/HighlightHub/VedioHighlights';
import LeaderBoard from '../../dashboard/LeaderBoard/LeaderBoard';
import AllLeaderBoardVedio from '../../dashboard/LeaderBoard/AllLeaderBoardVedio';
import PlayerLeaderboard from '../../dashboard/LeaderBoard/PlayerLeaderboard';
import Home from '../../dashboard/qr';


const BetCentral = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="CourseScreen"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="CourseScreen" component={CourseScreen} />
      <HomeStack.Screen name="CourceDetails" component={CourceDetails} />
      <HomeStack.Screen name="CourceCart" component={CourceCart} />
      <HomeStack.Screen name="PayingCart" component={PayingCart} />
    </HomeStack.Navigator>
  );
};

const leaderBoardStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="LeaderBoard"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
      <HomeStack.Screen
        name="AllLeaderBoardVedio"
        component={AllLeaderBoardVedio}
      />
      <HomeStack.Screen
        name="PlayerLeaderboard"
        component={PlayerLeaderboard}
      />
    </HomeStack.Navigator>
  );
};

// const Home = () => {
//   return (
//     <HomeStack.Navigator
//       initialRouteName="HomeDashboard"
//       screenOptions={{headerShown: false}}>
//       <HomeStack.Screen name="HomeDashboard" component={Dashboard} />
//     </HomeStack.Navigator>
//   );
// };

const HomeStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const ProfileStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Community"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Community" component={Community} />
      <HomeStack.Screen name="EditProfile" component={ProfileCard} />
      <HomeStack.Screen name="LeaderBoard" component={LeaderBoard} />
      <HomeStack.Screen name="AllLeaderBoardVedio" component={AllLeaderBoardVedio} />
      
    </HomeStack.Navigator>
  );
};


const QueStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="EnterQue"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="EnterQue" component={EnterQueueHome} />
      <HomeStack.Screen name="RecordResults" component={RecordResult} />
      <HomeStack.Screen
        name="AchievementScreen"
        component={AchievementScreen}
      />
      <HomeStack.Screen name="TeeBoxScreen" component={TeeBoxScreen} />
      <HomeStack.Screen name="CountdownBox" component={CountdownBox} />
      <HomeStack.Screen name="TeeBoxResults" component={TeeBoxResults} />
      <HomeStack.Screen name="HitTheGreen" component={HitTheGreen} />
      <HomeStack.Screen name="VedioHighlights" component={VedioHighlights} />
      
    </HomeStack.Navigator>
  );
};

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -30, // Elevated button
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}>
    <View
      style={{
        width: 75,
        height: 75,

        borderWidth: 5, // Define border width
        borderColor: '#FFF',

        borderRadius: 37.5,
        backgroundColor: '#FFF',
      }}>
      {children}
    </View>
    <Text
      style={{
        color: colors.black,
        fontSize: 12,
        marginTop: 9,
      }}>
      {APP_TEXT.HOME}
    </Text>
  </TouchableOpacity>
);


function ScanScanner() {
  // const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      {/* <VideoPlayer/> */}

      {/* <ApplicationButton
        backgroundColor={colors.PRIMARY_BUTTON}
        label={'Logout'}
        onButtonPress={() => {
          dispatch(clearLogin());
          dispatch(cleanLogindata());
        }}
      /> */}
    </View>
  );
}

function HomeScanner() {
  // const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <Text>Profile Screen</Text>
      {/* <VideoPlayer/> */}

      {/* <ApplicationButton
        backgroundColor={colors.PRIMARY_BUTTON}
        label={'Logout'}
        onButtonPress={() => {
          dispatch(clearLogin());
          dispatch(cleanLogindata());
        }}
      /> */}
    </View>
  );
}

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        initialRouteName: 'Home',
        headerShown: false,
        tabBarActiveTintColor: colors.PRIMARY_BUTTON,
        showLabel: false,
        style: {
          height: 20,
          elevation: 0,
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          top: 30,
          borderRadius: 15,
        },

        tabBarLabelPosition: {
          marginBottom: 10,
        },
        tabBarStyle: {
          // shadowColor: 'red',
          height: 80,
          // backgroundColor: colors.BACKGROUD_ICON_COLOR,
        },
        activeTintColor: 'black',
        tabBarLabelStyle: {marginBottom: 20},
      }}>
      <Tab.Screen
        name="Home"
        // component={VedioHighlights}
        // component={Home}
        // component={QueStack}
        // component={LeaderBoard}
        component={ScanScanner}
        
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <House
                strokeWidth={1}
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                }}
                size={32}
              />
              <Text
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                  fontSize: 10,
                }}>
                {APP_TEXT.HOME}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={ProfileStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <Users
                strokeWidth={1}
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                }}
                size={32}
              />
              <Text
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                  fontSize: 10,
                }}>
                {APP_TEXT.COMMUNITIES}
              </Text>
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Contests"
        component={ContestsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <TvMinimalPlay
                strokeWidth={1}
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                }}
                size={32}
              />
              <Text
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                  fontSize: 10,
                }}>
                {APP_TEXT.CONTESTS}
              </Text>
            </View>
          ),
        }}
      /> */}
         <Tab.Screen
        name="Scan"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
            source={images.logoBuddha}
            style={{
              width: 50,
              height: 50,
              alignSelf: 'center',
              marginTop: -10,
            }}
          />
            // <Plus
            //   strokeWidth={1}
            //   style={{
            //     color: colors.white,
            //     padding: 10,
            //   }}
            //   size={32}
            // />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="BetCentral"
        component={BetCentral}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <Hand
                strokeWidth={1}
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                }}
                size={32}
              />
              <Text
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                  fontSize: 10,
                }}>
                {APP_TEXT.BET_CENTRAL}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profiles"
        component={ProfileCard}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[st.icon]}>
              <User
                strokeWidth={1}
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                }}
                size={32}
              />
              <Text
                style={{
                  color: focused ? colors.PRIMARY_BUTTON : colors.ICON_GREY,
                  fontSize: 10,
                }}>
                {APP_TEXT.PROFILE}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#7cc242',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    // elevation: 1,
  },
  tabBarStyle: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 90,
    // ...styles.shadow,
  },
});
