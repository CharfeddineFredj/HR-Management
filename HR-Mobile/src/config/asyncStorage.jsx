/* eslint-disable prettier/prettier */
// asyncStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    console.log('Attempting to store token:', token);  // Additional logging
    await AsyncStorage.setItem('token', token);
    console.log('Token stored successfully:', token); // Add this log to verify token storage
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    // console.log('Token retrieved successfully:', token); // Add this log to verify token retrieval
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    console.log('Token removed successfully');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
