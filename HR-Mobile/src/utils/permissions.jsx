/* eslint-disable prettier/prettier */
import { PermissionsAndroid } from 'react-native';

/**
 * Requests location permission from the user and returns a boolean indicating
 * whether the permission was granted.
 *
 * @return {Promise<boolean>} true if permission granted, otherwise false
 */
export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // {
      //   title: 'Location Access Permission',
      //   message: 'We would like to use your location for attendance marking.',
      // }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  }
}
