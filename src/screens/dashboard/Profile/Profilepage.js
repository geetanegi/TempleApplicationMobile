import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import st from '../../../global/styles';
import { Feather } from 'lucide-react-native';

// ---- Dummy data (replace with your API data) ----
const profileData = {
  appTitle: 'JainSansaar',
  username: 'Shivanshu_123',
  name: 'Shivanshu Mathur',
  posts: 87,
  followers: 877,
  following: 153,
  bio: `Stepping into my power,one imperfect moment at a time. I'm a work in progress, a story still being written, and I'm loving the messy, beautiful chapters.`,
  avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
  photos: [
    {
      id: '1',
      thumbnail:
        'https://images.pexels.com/photos/33639142/pexels-photo-33639142.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'video',
    },
    {
      id: '2',
      thumbnail:
        'https://images.pexels.com/photos/33639137/pexels-photo-33639137.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'video',
    },
    {
      id: '3',
      thumbnail:
        'https://images.pexels.com/photos/33647384/pexels-photo-33647384.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'video',
    },
    {
      id: '4',
      thumbnail:
        'https://images.pexels.com/photos/33646957/pexels-photo-33646957.jpeg?auto=compress&cs=tinysrgb&w=800',
      type: 'video',
    },
  ],
};

const TABS = [
  { key: 'Photo', icon: (active) => (
    <MaterialCommunityIcons name="image" size={22} color={active ? COLORS.orange : COLORS.icon} />
  )},
  // { key: 'Text', icon: (active) => (
  //   <MaterialCommunityIcons name="format-text" size={22} color={active ? COLORS.orange : COLORS.icon} />
  // )},
  { key: 'Video', icon: (active) => (
    <MaterialCommunityIcons name="film" size={22} color={active ? COLORS.orange : COLORS.icon} />
  )},
  { key: 'Edit', icon: (active) => (
    <Feather name="edit" size={22} color={active ? COLORS.orange : COLORS.icon} />
  )},
];


const {width} = Dimensions.get('window');
const CARD_GAP = 14;
const NUM_COLS = 2;
const CARD_W = (width - 24 * 2 - CARD_GAP) / NUM_COLS; // screen padding 24 each side
const CARD_H = CARD_W * 0.72;

const COLORS = {
  orange: '#D48A4A',
  icon: '#B07C57',
  text: '#1B1B1B',
  sub: '#7A7A7A',
  line: '#E7E0DA',
  bg: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.12)',
};

export default function ProfileScreen({route}) {
  const nav = useNavigation();
  const backIconVisibility = route?.params?.backIconVisibility || false;

  const [activeTab, setActiveTab] = useState('Photo');

  const data = useMemo(() => {
    // you can swap lists per tab later
    if (activeTab === 'Text') {
      return [{id: 't1', text: profileData.bio}];
    }
    return profileData.photos;
  }, [activeTab]);

  const renderHeader = () => {
    return (
      <View style={styles.headerWrap}>
        {/* Top bar */}
        {/* <View style={styles.topBar}>
          <View style={{width: 40}} />
          <Text style={styles.appTitle}>{profileData.appTitle}</Text>

          <Pressable
            hitSlop={10}
            onPress={() => nav.navigate('Settings')}
            style={styles.settingsBtn}>
            <Ionicons name="settings" size={18} color={COLORS.orange} />
          </Pressable>
        </View> */}

        {/* Profile row */}
        <View style={styles.profileRow}>
          <Image source={{uri: profileData.avatar}} style={styles.avatar} />

          <View style={styles.profileRight}>
            <Text style={styles.name}>{profileData.name}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profileData.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profileData.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profileData.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Username */}
        <Text style={styles.username}>{profileData.username}</Text>

        {/* Bio */}
        <Text style={styles.bio}>{profileData.bio}</Text>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setActiveTab(t.key)}
                style={styles.tabBtn}>
                <View style={styles.tabIconWrap}>{t.icon(isActive)}</View>
                {isActive ? <View style={styles.tabUnderline} /> : <View style={styles.tabUnderlineOff} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />
      </View>
    );
  };

  const renderItem = ({item}) => {
    if (activeTab === 'Text') {
      return (
        <View style={styles.textCard}>
          <Text style={styles.textPost}>{item.text}</Text>
        </View>
      );
    }

    return (
      <Pressable
        // onPress={() => nav.navigate('VideoPlayer', {item})}
        style={styles.card}>
        <Image source={{uri: item.thumbnail}} style={styles.cardImg} />

        {/* Play overlay like Figma */}
        <View style={styles.playOverlay}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={18} color="#fff" />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[st.flex, {backgroundColor: COLORS.bg}]}>
      {/* If you want to keep your existing <Header /> remove the topBar above and use Header instead */}
      {/* <Header drawerIcon={!backIconVisibility} navigation={nav} backIcon={backIconVisibility} title={'Profile'} /> */}

      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          key={activeTab} // force layout refresh when tab changes
          keyExtractor={(it, idx) => it?.id?.toString?.() ?? String(idx)}
          numColumns={activeTab === 'Text' ? 1 : 2}
          columnWrapperStyle={activeTab === 'Text' ? undefined : styles.columnWrap}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bg},

  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  headerWrap: {
 //   paddingTop: 6,
    paddingBottom: 10,
  },

  topBar: {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },

  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },

  profileRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },

  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#eee',
  },

  profileRight: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 22,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 2,
    fontWeight: '600',
  },

  username: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  bio: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#8A8A8A',
    fontWeight: '600',
  },

  tabRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  tabBtn: {
    alignItems: 'center',
    width: '25%',
  },

  tabIconWrap: {
    width: 36,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabUnderline: {
    marginTop: 8,
    height: 3,
    width: 44,
    borderRadius: 3,
    backgroundColor: COLORS.orange,
  },

  tabUnderlineOff: {
    marginTop: 8,
    height: 3,
    width: 44,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },

  divider: {
    marginTop: 10,
    height: 1,
    backgroundColor: COLORS.line,
  },

  columnWrap: {
    justifyContent: 'space-between',
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },

  cardImg: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  textPost: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontWeight: '600',
  },
});
