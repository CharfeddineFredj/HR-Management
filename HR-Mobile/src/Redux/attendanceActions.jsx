/* eslint-disable prettier/prettier */
import Geolocation from '@react-native-community/geolocation';

export const recordAttendance = (hasLocationPermission) => {
  if (hasLocationPermission) {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        // Send this position to the backend via an API
      },
      (error) => {
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
};
