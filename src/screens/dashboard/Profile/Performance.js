import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../../global/theme';

const Performance = () => {
    const [activeTab, setActiveTab] = useState('Betting Overview');
  return (
    <View>
   
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overviewTitle: {
    color: '#888',
  },
  overviewValue: {
    fontWeight: 'bold',
    color: '#000',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#7EBE42',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricBox: {
    width: '48%',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 14,
    color: '#999',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  featuredMetric: {
    marginBottom: 20,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  trophyIcon: {
    margin: 10,
  },
});
export default Performance;
