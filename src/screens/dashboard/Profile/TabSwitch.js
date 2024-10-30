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
import {colors, images} from '../../../global/theme';
//golfTrophy
//golfVedio
const screenWidth = Dimensions.get('window').width;

const imageData = [
  {id: '1', uri: 'https://via.placeholder.com/150'},
  {id: '2', uri: 'https://via.placeholder.com/150'},
  {id: '3', uri: 'https://via.placeholder.com/150'},
  {id: '4', uri: 'https://via.placeholder.com/150'},
  {id: '5', uri: 'https://via.placeholder.com/150'},
  {id: '6', uri: 'https://via.placeholder.com/150'},
  {id: '7', uri: 'https://via.placeholder.com/150'},
  {id: '8', uri: 'https://via.placeholder.com/150'},
];

const TabSwitch = () => {
  const [activeTab, setActiveTab] = useState('Betting Overview');

  const renderItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image
        // resizeMethod='contain'
        source={images.golfTrophy}
        style={styles.image}
      />
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Performance' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Performance')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Performance' && styles.activeTabText,
            ]}>
            Performance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Betting Overview' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Betting Overview')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Betting Overview' && styles.activeTabText,
            ]}>
            Betting Overview
          </Text>
        </TouchableOpacity>
      </View>

      {/* Performance Content Wrapped in a Card */}
      {activeTab === 'Performance' && (
        <View style={styles.cardContainer}>
          {/* Top Performance Metrics Section */}
          <Text style={styles.sectionHeader}>Top Performance Metrics</Text>
          <View style={styles.metricsContainer}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={styles.metricBox}>
                <Text style={styles.metricTitle}>Scoring Average:</Text>
                <Text style={styles.metricValue}>2.93 (Top 5%)</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricTitle}>Closest Shot:</Text>
                <Text style={styles.metricValue}>4.12 feet (Top 3%)</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={styles.metricBox}>
                <Text style={styles.metricTitle}>Avg. Proximity:</Text>
                <Text style={styles.metricValue}>32.5 feet (Top 10%)</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricTitle}>GIR Percentage:</Text>
                <Text style={styles.metricValue}>66.5% (Top 15%)</Text>
              </View>
            </View>
          </View>

          {/* Featured Metric */}
          <Text style={[styles.sectionHeader, {marginVertical: 15}]}>
            Featured Metric
          </Text>
          <View style={{marginTop: -5}}>
            <Text style={styles.metricTitle}>Birdie Streak:</Text>
            <Text style={styles.metricValue}>3.00 (Top 1%)</Text>
          </View>

          {/* Top Achievements */}
          <Text style={[styles.sectionHeader, {marginVertical: 15}]}>
            Top Achievements
          </Text>

          <FlatList
            data={imageData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={4}
          />
        </View>
      )}

      {activeTab === 'Betting Overview' && (
        <View style={styles.cardContainer}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Total Wager Amount:</Text>
              <Text style={styles.overviewValue}>$1,685.50</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Total Winnings:</Text>
              <Text style={styles.overviewValue}>$34,560.00</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Net Earnings:</Text>
              <Text style={[styles.overviewValue, {color: '#7EBE42'}]}>
                $32,874.50
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionHeader, {marginTop: 15}]}>
            Contest and Competition
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>AceCam Jackpot:</Text>
              <Text style={styles.overviewValue}>$33,420.00</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Closest-to-Pin:</Text>
              <Text style={styles.overviewValue}>$615.00</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Hit-the-Green:</Text>
              <Text style={styles.overviewValue}>$380.00</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Other Challenges:</Text>
              <Text style={styles.overviewValue}>$20.00</Text>
            </View>
          </View>

          <Text style={[styles.sectionHeader, {marginTop: 15}]}>
            AceCam Tournaments & Events
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>AceCam Shootouts:</Text>
              <Text style={styles.overviewValue}>$0.00</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Best Finish:</Text>
              <Text style={styles.overviewValue}>T-11</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>AceCam Outings:</Text>
              <Text style={styles.overviewValue}>$125.00</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.overviewTitle}>Best Finish:</Text>
              <Text style={styles.overviewValue}>T-4</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    marginVertical: 15,
    borderColor: '#E6E6E6',
    borderWidth: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 43,
  },
  tabButton: {
    marginVertical: 5,
    backgroundColor: 'transparent',
    width: '45%',
    alignItems: 'center',
    height: 31,
    borderRadius: 20,
    justifyContent: 'center',
  },
  activeTab: {
    elevation: 1,
    marginVertical: 5,
    width: '45%',
    height: 31,
    borderRadius: 20,
    backgroundColor: '#95C11E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    letterSpacing: 0.2,
    fontWeight: '400',
    lineHeight: 19.1,
    top: -1,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 19.1,
    letterSpacing: 0.2,
    top: -1,
    fontWeight: '400',
  },
  cardContainer: {
    padding: 15,
    borderBottomColor: '#E6E6E6',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 1,
  },
  overviewRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overviewTitle: {
    fontSize: 14,
    color: 'Gray',
    fontWeight: '400',
    // color: '#888',
  },
  overviewValue: {
    fontWeight: '500',
    fontSize: 14,
    color: '#000',
  },
  sectionHeader: {
    fontWeight: '600',
    color: '#1D1A0C',
    fontSize: 14,
    // backgroundColor:'red',
    textDecorationLine: 'underline',
  },
  metricsContainer: {
    // paddingVertical: 10,
  },
  metricBox: {
    width: '50%',
    marginTop: 10,
  },
  metricTitle: {
    fontSize: 14,
    color: 'Gray',
    fontWeight: '400',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1A0C',
  },
  featuredMetric: {
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 90,
    position: 'relative',
  },
  achievementsContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  trophyIcon: {
    margin: 10,
  },
  infoBoxContainer: {
    backgroundColor: colors.PRIMARY_BUTTON,
    width: '90%',
    borderRadius: 10,
    paddingVertical: 60, // To make space for the profile image
    paddingHorizontal: 20,
    marginTop: -50, // This brings the avatar on top of the box
    alignItems: 'center',
    zIndex: 0,
  },

  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
  },
});
export default TabSwitch;
