import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const BirdieScoreScreen = ({navigation, route, onPress}) => {
  const [score, setScore] = useState('1');

  const renderCircles = () => {
    if (score === '1') {
      return (
        <View style={styles.circleContainer}>
          <View style={styles.circle} />
          <View style={styles.circle} />
        </View>
      );
    } else if (score === '2') {
      return (
        <View style={styles.circleContainer}>
          <View style={styles.circle} />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.header}>[HIT THE GREEN] &gt; 28.50 FT</Text>

        {/* Subheading */}
        <Text style={styles.subHeading}>
          Great Shot - <Text style={styles.boldText}>inside 30 feet!</Text>
        </Text>

        {/* Bordered Score Input Section */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>What happened next?</Text>
          <Text style={styles.instructions}>Enter your score...</Text>

          {/* Dynamic Circles */}
          {renderCircles()}

          <Text style={styles.holeInOneText}>Birdie? Hell Yeah</Text>
        </View>

        {/* Buttons */}
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Score</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Score Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.scoreInput}
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  card: {
    width: Dimensions.get('window').width * 0.9,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  instructionsContainer: {
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#007bff',
    borderWidth: 2,
    marginHorizontal: 5,
  },
  holeInOneText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 10,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#8CC63E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#666',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  scoreInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    width: 100,
    color:'black',
    textAlign: 'center',
  },
});

export default BirdieScoreScreen;
