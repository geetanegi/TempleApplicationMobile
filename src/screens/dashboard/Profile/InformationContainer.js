import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
const InformationContainer = ({item}) => {
  return (
    <View style={styles.infoContainer}>
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Age:</Text>
      <Text style={styles.infoValue}>{item?.age}</Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Handicap:</Text>
      <Text style={styles.infoValue}>
        <Text style={styles.extraInfo}>{item?.handicap}</Text>
      </Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Clubs:</Text>
      <Text style={styles.infoValue}>{item?.clubs}</Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Ball:</Text>
      <Text style={styles.infoValue}>{item?.ball}</Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Course:</Text>
      <Text style={styles.infoValue}>Preswick Village GC</Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}>Member Since:</Text>
      <Text style={styles.infoValue}>May 2024</Text>
    </View>
  </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: {
    width: '48%',
    height: 48,
    backgroundColor: '#556B2F',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '400',
  },
  infoValue: {
    color: '#fff',
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  extraInfo: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ghin: {
    width: 45,
    height: 18,
    left:5,
    alignSelf: 'center',
  },
});
export default InformationContainer;
