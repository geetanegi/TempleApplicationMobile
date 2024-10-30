import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { colors, images } from '../../../global/theme';
import st from '../../../global/styles';
import { LandPlot } from 'lucide-react-native';
const StartScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.clubImage} source={images.splashBG}>
                <View style={[]}>
                    <View style={[st.align_C]}>
                        <Image
                            source={images.logo_txt}
                            style={[st.logoSty, { marginTop: -20 }]}
                        />
                    </View>

                    <View style={styles.clubInfo}>
                        <Text style={styles.clubName}>Saginaw Country Club</Text>
                        <Text style={styles.clubLocation}>Saginaw, MI</Text>
                    </View>
                </View>
            </ImageBackground>
            <Image source={images.user} style={styles.profileImage} />
            {/* Profile Greeting */}
            <Text style={styles.greeting}>Hey MeTizio</Text>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <LandPlot style={styles.leftImage} />
                <Text style={styles.welcomeClubName}>Saginaw Country Club</Text>
                <Text style={styles.holeInfo}>Hole #10, Par 3</Text>
                <Text style={styles.teeInfo}>Black Tees (157 yards)</Text>
            </View>
            <View style={[{ alignItems: 'center', marginTop: 70 }]}>
                <TouchableOpacity
                    style={styles.saveButton}
                // onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Enter Queue</Text>
                </TouchableOpacity>
            </View>
            {/* Action Button */}
            {/* <Button
        title="Enter Queue"
        buttonStyle={styles.enterQueueButton}
        onPress={() => alert('Entered Queue')}
      /> */}

        </View>
    );
}
export default StartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 156,
        height: 156,
        borderRadius: 78,
        borderWidth: 3,
        borderColor: '#fff',
        alignSelf: 'center',
        marginTop: -60,
    },
    leftImage: {
        width: 26,
        height: 26,
        color: '#95C11E',
        marginTop: 12
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#95C11E',
        borderRadius: 5,
        width: 291,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 19.1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userDetails: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'

    },
    userStats: {
        fontSize: 12,
        color: '#FFFFFF'
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreIcon: {
        marginLeft: 15,
    },
    clubImage: {
        width: '100%',
        height: 250,
    },
    clubInfo: {
        alignItems: 'flex-start',
        marginVertical: 10,
        marginTop: 10,
        marginLeft: 15
    },
    clubName: {
        fontSize: 18,
        fontWeight: 'Nunito',
        color: 'white'
    },
    clubLocation: {
        fontSize: 14,
        color: 'white'
    }, textContainer: {
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent background to the text
        padding: 10,
        borderRadius: 10,
    },
    greeting: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 10,
        fontWeight: 'Nunito',
        color: '#1D1A0C'

    },
    welcomeSection: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    welcomeText: {
        fontSize: 17,
        color: '#888',
    },
    welcomeClubName: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 5,
        font: 'Nunito'
    },
    holeInfo: {
        fontSize: 14,
        marginVertical: 5,
        marginTop: 15
    },
    teeInfo: {
        fontSize: 14,
        color: '#666',
    },
    enterQueueButton: {
        backgroundColor: '#8bc34a',
        marginHorizontal: 50,
        borderRadius: 5,
        paddingVertical: 10,
    },
});

