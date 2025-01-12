/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid, ImageBackground, Image, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import LoaderScreen from '../components/LoaderScreen';
import { checkIn, checkOut, fetchUserById, fetchPointageHistoryByUserId } from '../config/apiService';
import { getToken } from '../config/asyncStorage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';

const backgroundImg = require('../assets/images/background.jpg');
const defaultImage = require('../assets/images/digidlogo.png');

const CheckInOutScreen = ({ route, navigation }) => {
  const { id, roles } = route.params || {};
  const [loading, setLoading] = useState(true); // Initial loading state
  const [actionLoading, setActionLoading] = useState(false); // Action loading state for check-in/check-out
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);
  const [user, setUser] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

  const fetchPointageStatus = async (userId) => {
    try {
      const pointages = await fetchPointageHistoryByUserId(userId);
      const today = new Date().toISOString().split('T')[0];
      const todayPointage = pointages.find(pointage => pointage.checkInTime.split('T')[0] === today);
      if (todayPointage) {
        setHasCheckedIn(!!todayPointage.checkInTime);
        setHasCheckedOut(!!todayPointage.checkOutTime);
        await AsyncStorage.setItem('hasCheckedIn', (!!todayPointage.checkInTime).toString());
        await AsyncStorage.setItem('hasCheckedOut', (!!todayPointage.checkOutTime).toString());
      } else {
        setHasCheckedIn(false);
        setHasCheckedOut(false);
        await AsyncStorage.setItem('hasCheckedIn', 'false');
        await AsyncStorage.setItem('hasCheckedOut', 'false');
      }
    } catch (error) {
      console.error('Failed to fetch pointage status:', error);
    }
  };

  const loadUserProfile = useCallback(async () => {
    setLoading(true); // Set loading to true before data fetch
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }
      const userProfile = await fetchUserById(id, roles);
      setUser(userProfile);
      await fetchPointageStatus(id); // Use userId here
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false); // Set loading to false after data fetch
    }
  }, [id, roles]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleLocationAction = async (actionType) => {
    setActionLoading(true);
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to record attendance.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setAlertMessage('You need to enable location permissions to perform this action.');
        setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
        setShowCustomAlert(true);
        setActionLoading(false);
        return;
      }
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          if (!user) {
            setAlertMessage('User not loaded. Please try again.');
            setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
            setShowCustomAlert(true);
            setActionLoading(false);
            return;
          }
          const username = user.username;
          const currentTime = new Date().toISOString();
          try {
            if (actionType === 'Check In') {
              if (hasCheckedIn) {
                setAlertMessage('You have already checked in today.');
                setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
                setShowCustomAlert(true);
                setActionLoading(false);
                return;
              }
              await checkIn(username, currentTime, latitude, longitude);
              setHasCheckedIn(true);
              await AsyncStorage.setItem('hasCheckedIn', 'true');
              setAlertMessage('Thanks for using our service. Have a nice day at work!');
            } else {
              if (hasCheckedOut) {
                setAlertMessage('You have already checked out today.');
                setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
                setShowCustomAlert(true);
                setActionLoading(false);
                return;
              }
              await checkOut(username, currentTime, latitude, longitude);
              setHasCheckedOut(true);
              await AsyncStorage.setItem('hasCheckedOut', 'true');
              setAlertMessage('See you tomorrow. Have a great evening!');
            }
            setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
            setShowCustomAlert(true);
          } catch (error) {
            setAlertMessage('No work schedule found for today.');
            setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
            setShowCustomAlert(true);
          } finally {
            setActionLoading(false);
          }
        },
        error => {
          setActionLoading(false);
          setAlertMessage(`Location Error: ${error.message}`);
          setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
          setShowCustomAlert(true);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
      );
    } catch (err) {
      setActionLoading(false);
      setAlertMessage(`Location Permission Error: ${err.message}`);
      setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
      setShowCustomAlert(true);
    }
  };

  const imagePath = roles.includes('Administrateur')
    ? `administrateur/files/${user?.image}`
    : `employee/files/${user?.image}`;

  if (loading) {
    return (
      <ImageBackground source={backgroundImg} style={styles.background}>
        <View style={styles.loaderContainerData}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Check In or Check Out</Text>
        {user && (
          <View style={styles.profileContainer}>
            <Image
              source={user.image ? { uri: `${Config.API_BASE_URL}/${imagePath}` } : defaultImage}
              style={styles.profileImage}
              onError={() => setUser(prevState => ({ ...prevState, image: null }))}
            />
            <Text style={styles.welcomeText}>{hasCheckedOut ? 'Goodbye, see you tomorrow!' : `Welcome, ${user.firstname}!`}</Text>
          </View>
        )}
        <Text style={styles.emoji}>{hasCheckedOut ? '👋' : '😊'}</Text>
        <Text style={styles.motivationalText}>{hasCheckedOut ? 'See you tomorrow!' : 'Have a great day at work!'}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.checkInButton, hasCheckedIn && styles.disabledButton]}
            onPress={() => handleLocationAction('Check In')}
            disabled={hasCheckedIn}
          >
            <Icon name="sign-in" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.checkOutButton, hasCheckedOut && styles.disabledButton]}
            onPress={() => handleLocationAction('Check Out')}
            disabled={hasCheckedOut}
          >
            <Icon name="sign-out" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Check Out</Text>
          </TouchableOpacity>
        </View>
        <CustomAlert
          isVisible={showCustomAlert}
          message={alertMessage}
          buttons={alertButtons}
          onClose={() => setShowCustomAlert(false)}
        />
      </View>
      {actionLoading && (
        <View style={styles.loaderContainer}>
          <LoaderScreen />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background to ensure text visibility
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: '#343a40',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 20,
  },
  motivationalText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 10,
    elevation: 3,
  },
  checkInButton: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  checkOutButton: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
    shadowColor: '#c0c0c0',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainerData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for loader
  },
});

export default CheckInOutScreen;
