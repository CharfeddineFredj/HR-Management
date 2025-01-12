/* eslint-disable prettier/prettier */
// import React, { useState } from 'react';
// import { TouchableOpacity, Text, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// const CheckInOutButton = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);

//   const requestPermissionsAndGetLocation = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'This app needs access to your location to record attendance.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         Geolocation.getCurrentPosition(
//           position => {
//             const { latitude, longitude } = position.coords;
//             setCurrentLocation({ latitude, longitude });
//             Alert.alert("Location Access", `Latitude: ${latitude}, Longitude: ${longitude}`);
//           },
//           error => {
//             console.error(error);
//             Alert.alert("Location Error", error.message);
//           },
//           { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
//         );
//       } else {
//         console.log('Location permission denied');
//         Alert.alert("Location Permission", "Location permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//       Alert.alert("Location Permission Error", err.message);
//     }
//   };

//   return (
//     <TouchableOpacity onPress={requestPermissionsAndGetLocation} style={styles.button}>
//       <Text style={styles.buttonText}>Clock In/Out</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#007BFF',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default CheckInOutButton;

/* eslint-disable prettier/prettier */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CheckInOutButton = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('CheckInCheckOut')} style={styles.button}>
      <Text style={styles.buttonText}>Clock In/Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckInOutButton;
