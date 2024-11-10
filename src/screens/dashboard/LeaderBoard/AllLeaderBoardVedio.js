import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  size,
  family,
  BORDERWIDTH,
  PADDING,
  MARGIN,
  WIDTH,
  RADIUS,
  Alert,
  HEIGHT,
  WEIGHT,
  ELEVATION,
  FONTSIZE,
  SIZES,
} from '../../../global/fonts';
import {colors, images, APP_TEXT, NAVIGATION} from '../../../global/theme';
import AppText from '../../../components/AppText';
import Share from 'react-native-share';
import moment from 'moment';
import { GitCommitVertical, MessageCircle, PlayCircle, Share2, ThumbsUp } from 'lucide-react-native';
import HeaderHome from '../../../components/HeaderHome';

const AllLeaderBoardVedio = ({navigation, route,imageData, onPressItem}) => {
  console.log('-----in screen---',route?.params?.imageData)
  const CustomTextComponent = ({title, style}) => {
    return <AppText style={style}>{title}</AppText>;
  };
 const data= imageData || route?.params?.imageData

  const share = async (url) => {
    const options = {
      // message:
      //   'hello this is a demo message',
      title:'Share video',
      url: url,
      // email: 'geetanegi10917@gmail.com',
      // subject: 'hello',
      // recipient: '919755638573',
    };

    try {
      const res = await Share.open(options);
      console.log(res);
    } catch (err) {
      console.log(err);
    }

    // Share.open(options)
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
  };

  const VideoCard = ({ video }) => {
    const startDate = moment.utc(video?.dateTime).local().format('MM/DD/YYYY');
  //  console.log('----------videovideovideovideo',video)
    return (
      <View style={styles.card}>
        {/* Video Thumbnail */}
        <View style={styles.thumbnailContainer}>
        <Image
        source={{
          uri: 'https://www.shutterstock.com/image-photo/front-view-golfer-driver-back-260nw-2446559499.jpg',
        }}
        style={styles.image}
      />
          <Text style={styles.duration}>90:0</Text>
          <View style={styles.playIcon}>
            <PlayCircle size={30} color="#fff" />
          </View>
        </View>
  
        {/* Video Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{video?.firstName}{' '}{video?.lastName}</Text>
          <Text style={styles.title}>{video?.contestType}</Text>
          <Text style={styles.metaData}>
            {video?.videos?.views}{' Views'} • {video?.videos?.likes}{' Likes'} • {startDate}
          </Text>
  
          {/* Actions Row */}
          <View style={styles.actionsRow}>
          <View style={styles.iconWithBadge}>
            <MessageCircle   strokeWidth={1} size={20} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <ThumbsUp strokeWidth={1} size={20} color="#fff" style={styles.actionIcon} />
          <TouchableOpacity onPress={() => share(video?.videos?.url)}>
          <Share2 strokeWidth={1} size={20} color="#fff" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
         <HeaderHome
        drawerIcon={true}
        playerImage={images.user}
        navigation={navigation}
        playerName={'MeTizio'}
        GHIN={'2460170'}
        HDCP={'1.5'}
      />
       <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          // alignItems: 'center',
          marginHorizontal: 20,
          marginTop:20
        }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={images.backIconHeader} style={styles.leftImage} />
            </TouchableOpacity>
        <CustomTextComponent
          title={'Shot of the Week'}
          style={styles.ruleTxt}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
       horizontal={false}
       numColumns={2}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VideoCard video={item} />}
      contentContainerStyle={styles.listContainer}
    />
    </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    // marginHorizontal: 13,
    // justifyContent:"center",
    // //  backgroundColor: 'red',
    // height: 263,
    // marginTop:90
   },
  metricBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: WIDTH.WIDTH_100,
  },
  buttonAre: {
    justifyContent: 'flex-end',
    // backgroundColor:'red',
    alignItems: 'center',
    flexDirection: 'row',
    // flex:1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // marginVertical:10,
    // paddingTop: 10,
    width: WIDTH.WIDTH_100,
  },
  overviewTitle: {
    fontSize: SIZES.SIZES_12,
    fontWeight: WEIGHT.WEIGHT_400,
    color: colors.DISABLE,
    fontFamily: family.regular,
  },
  overviewValue: {
    fontSize: SIZES.SIZES_14,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.white,
    fontFamily: family.regular,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 6,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    resizeMode: 'cover',
  },

  timerContainer: {
    position: 'absolute',
    top: 80,
    right: 10,
  },  
  ruleTxt: {
    fontSize: FONTSIZE.FONTSIZE_14,
    // paddingVertical: PADDING.PADDING_10,
    fontFamily: family.regular,
    fontWeight: WEIGHT.WEIGHT_600,
    color: colors.black,
    marginLeft:10
  },
  leftImage: {
    width: 24,
    height: 24,
  },
  dot: {
    height: 6,
    width: 6,
    backgroundColor: 'gray',
    borderRadius: 3,
    marginHorizontal: 5,
  },
  teeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: WIDTH.WIDTH_100,
    padding: 3,
    paddingHorizontal: 15,
  },
  pointName: {
    fontSize: 12,
    fontWeight: WEIGHT.WEIGHT_300,
    color: colors.PRIMARY_LIGHT_TEXT,
    fontFamily: family.regular,
  },
  timerText: {
    fontSize: 10,
    fontWeight: WEIGHT.WEIGHT_500,
    color: colors.white,
    fontFamily: family.regular,
    backgroundColor: colors.BG_LIGHT_TRANSPARENT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    letterSpacing: 2,
  },card: {
    width: 175,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent:'center',
    margin: 10,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 100,
  },
  duration: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 12,
  },
  playIcon: {
    position: 'absolute',
    top: '35%',
    left: '35%',
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#222',
  },
  username: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  metaData: {
    fontSize: 12,
    color: '#777',
  },
  actionsRow: {
      flexDirection: 'row',
      alignSelf: 'flex-end', // Align buttons to the right

  
  },
  iconWithBadge: {
    position: 'relative',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  actionIcon: {
    marginLeft: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
export default AllLeaderBoardVedio;
