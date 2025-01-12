/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomAlert from '../../components/CustomAlert';
import { changePassword, fetchUserById } from '../../config/apiService';

const backgroundImg = require('../../assets/images/background.jpg'); // Ensure this path is correct
const logoImg = require('../../assets/images/logodigid.png'); // Ensure this path is correct

const SettingsScreen = ({ route }) => {
  const { id, roles } = route.params || {};
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true); // Initial screen loading
  const [actionLoading, setActionLoading] = useState(false); // Loader for form submission

  useEffect(() => {
    console.log('SettingsScreen mounted');
    console.log('userId:', id);
    console.log('roles:', roles);

    // Simulating initial loading
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust as necessary
  }, [id, roles]);

  const handleChangePassword = async (values, { setSubmitting }) => {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      setAlertMessage('Roles are not defined or invalid.');
      setAlertVisible(true);
      setSubmitting(false);
      return;
    }

    setActionLoading(true);
    try {
      // Fetch the user by ID and roles
      await fetchUserById(id, roles);
      // Proceed to change the password
      await changePassword(id, values.currentPassword, values.newPassword);
      setAlertMessage('Password changed successfully.');
      setSubmitting(false);
      // Clear the form fields
      values.currentPassword = '';
      values.newPassword = '';
      values.confirmPassword = '';
    } catch (error) {
      setAlertMessage(error.response ? error.response.data.message : error.message || 'Failed to change password.');
      setSubmitting(false);
    } finally {
      setActionLoading(false);
      setAlertVisible(true);
    }
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'New password must be at least 8 characters long')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  if (loading) {
    return (
      <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
      {actionLoading && (
        <View style={styles.actionLoaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <View style={styles.settings}>
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.title}>Change Password</Text>
        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleChangePassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  secureTextEntry
                  value={values.currentPassword}
                  onChangeText={handleChange('currentPassword')}
                  onBlur={handleBlur('currentPassword')}
                />
                {touched.currentPassword && errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                />
                {touched.newPassword && errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                />
                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={actionLoading}>
                <Text style={styles.submitButtonText}>Change Password</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
      <CustomAlert
        isVisible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for initial loader
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  actionLoaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for action loader
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  settings: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background to ensure text visibility
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 50,
    marginTop: -60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default SettingsScreen;
