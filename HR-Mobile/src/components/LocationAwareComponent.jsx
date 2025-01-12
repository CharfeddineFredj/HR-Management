/* eslint-disable prettier/prettier */
// LocationAwareComponent.jsx
import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, StyleSheet } from 'react-native';
import { requestLocationPermission } from '../utils/permissions';  // Adjust the import path as necessary to point to your permissions.js

const LocationAwareComponent = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestLocationPermission();
      setHasLocationPermission(granted);
      if (!granted) {
        Alert.alert('Permission Denied', 'This app requires location access to function properly.');
      }
    };

    checkPermissions();
  }, []);

  return (
    <View style={styles.container}>
      {hasLocationPermission ? (
        <Text style={styles.text}>Location access granted. You can now use location features.</Text>
      ) : (
        <Button title="Request Permission Again" onPress={() => requestLocationPermission().then(setHasLocationPermission)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default LocationAwareComponent;
