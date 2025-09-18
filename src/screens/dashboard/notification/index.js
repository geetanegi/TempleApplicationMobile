import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../global/theme';
import st from '../../../global/styles';
import SecondaryHeader from '../../../components/Header/secondaryHeader';
//  Reusable Request Item
const RequestItem = ({name, image, onAccept, onReject}) => {
  return (
    <View style={styles.requestItem}>
      <Image source={{uri: image}} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
        <Text style={styles.acceptText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReject}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

//  Reusable Notification Item
const NotificationItem = ({image, message}) => {
  return (
    <View style={styles.notificationItem}>
      <Image source={{uri: image}} style={styles.avatar} />
      <Text style={styles.notificationText}>{message}</Text>
    </View>
  );
};

//  Notification Screen
const NotificationScreen = () => {
  const [showAll, setShowAll] = React.useState(false);

  const requests = [
    {
      id: '1',
      name: 'Chance Vetrovs',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
      id: '2',
      name: 'Ann Bergson',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '3',
      name: 'Corey Culhane',
      image: 'https://randomuser.me/api/portraits/men/43.jpg',
    },
    {
      id: '4',
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      id: '5',
      name: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/47.jpg',
    },
    {
      id: '6',
      name: 'Michael Johnson',
      image: 'https://randomuser.me/api/portraits/men/48.jpg',
    },
    {
      id: '7',
      name: 'Emily Davis',
      image: 'https://randomuser.me/api/portraits/women/49.jpg',
    },
    {
      id: '8',
      name: 'David Wilson',
      image: 'https://randomuser.me/api/portraits/men/50.jpg',
    },
    {
      id: '9',
      name: 'Sophia Martinez',
      image: 'https://randomuser.me/api/portraits/women/51.jpg',
    },
    {
      id: '10',
      name: 'Liam Brown',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
    },
  ];

  const notifications = [
    {
      id: '1',
      message: 'Dictumst quis pellentesque maecenas',
      image: 'https://randomuser.me/api/portraits/men/40.jpg',
    },
    {
      id: '2',
      message: 'Dictumst quis pellentesque maecenas',
      image: 'https://randomuser.me/api/portraits/women/41.jpg',
    },
    {
      id: '3',
      message: 'Dictumst quis pellentesque maecenas',
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
    },
    {
      id: '4',
      message: 'Dictumst quis pellentesque maecenas',
      image: 'https://randomuser.me/api/portraits/men/39.jpg',
    },
  ];
  const visibleRequests = showAll ? requests : requests.slice(0, 3);

  return (
    <>
      {/* <SecondaryHeader title="Notifications" /> */}
      <FlatList
        ListHeaderComponent={
          <>
            {requests.length > 0 && (
              <SafeAreaView>
                <Text style={styles.sectionTitle}>Request</Text>
                <LinearGradient
                  colors={[colors.orange, '#d59564ff']}
                  style={styles.requestBox}>
                  {visibleRequests.map(req => (
                    <RequestItem
                      key={req.id}
                      name={req.name}
                      image={req.image}
                      onAccept={() => console.log('Accepted', req.name)}
                      onReject={() => console.log('Rejected', req.name)}
                    />
                  ))}
                  <TouchableOpacity
                    onPress={() => setShowAll(!showAll)}
                    style={styles.seeMore}>
                    <Text style={{color: colors.black}}>
                      {showAll ? 'See less ▲' : 'See more ▼'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </SafeAreaView>
            )}
            <Text style={styles.sectionTitle}>Notification</Text>
          </>
        }
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <NotificationItem image={item.image} message={item.message} />
        )}
        style={[st.pd10]}
      />
    </>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f77f00',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  requestBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    paddingVertical: 20,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 60,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
  acceptBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  acceptText: {
    color: '#f77f00',
    fontWeight: '600',
  },
  seeMore: {
    alignItems: 'center',
    marginTop: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
});

export default NotificationScreen;
