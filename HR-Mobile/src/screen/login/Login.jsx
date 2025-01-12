/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../Redux/authActions';
import { login, forgetPassword, resetPassword, checkEmailExists  } from '../../config/apiService';
import { storeToken } from '../../config/asyncStorage';
import LoaderScreen from '../../components/LoaderScreen';
import CustomAlert from '../../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '../../utils/permissions';
import Icon from 'react-native-vector-icons/Ionicons';

const backgroundImg = require('../../assets/images/background.jpg');
const userIcon = require('../../assets/icons/user.png');
const passwordIcon = require('../../assets/icons/loginpassword.png');

const validationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .test('is-valid', 'Invalid registration number or email', function (value) {
      if (!value) {return false;}
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(value);
      const isUsername = !isEmail; // Assume a simple validation for username
      return isEmail || isUsername;
    })
    .required('Registration number or Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const resetPasswordSchema = Yup.object().shape({
  verificationCode: Yup.string().required('Verification code is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain one uppercase, one lowercase, one number, and one special character'
    )
    .required('New password is required'),
});

const getPasswordStrength = (password) => {
  const strength = {
    length: password.length >= 10,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };

  const strengthCount = Object.values(strength).reduce((acc, curr) => acc + curr, 0);

  let strengthLabel = '';
  let strengthColor = '';

  if (strengthCount <= 2) {
    strengthLabel = 'Weak';
    strengthColor = 'red';
  } else if (strengthCount === 3) {
    strengthLabel = 'Moderate';
    strengthColor = 'yellow';
  } else if (strengthCount >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'green';
  }

  return { strengthCount, strengthLabel, strengthColor };
};


const LoginForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({ usernameOrEmail: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  // const [email, setEmail] = useState('');
  // const [verificationCode, setVerificationCode] = useState('');
  // const [newPassword, setNewPassword] = useState('');

  const checkPermissions = useCallback(async () => {
    const termsStatus = await AsyncStorage.getItem('termsAccepted');
    const permissionsStatus = await requestLocationPermission();
    setTermsAccepted(termsStatus === 'true');
    setPermissionsGranted(permissionsStatus);

    if (permissionsStatus) {
      Geolocation.getCurrentPosition(
        (position) => {
          // GPS is enabled
          setPermissionsGranted(true);
          setAlertVisible(false);
        },
        (error) => {
          setPermissionsGranted(false);
          if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
            setAlertMessage('You must enable location permissions to use the app.');
            setAlertVisible(true);
          }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      setPermissionsGranted(false);
      setAlertMessage('You must enable location permissions to use the app.');
      setAlertVisible(true);
    }
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const requestPermissions = async () => {
    const status = await requestLocationPermission();
    if (status) {
      setPermissionsGranted(true);
      setAlertVisible(false);
      checkPermissions();
    } else {
      setPermissionsGranted(false);
      setAlertMessage('This app requires location services to function properly.');
      setAlertVisible(true);
    }
  };

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    const { usernameOrEmail, password } = values;
    const loginValues = {
      username: usernameOrEmail,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : null,
      password,
    };

    if (termsAccepted && !permissionsGranted) {
      setSubmitting(false);
      return requestPermissions();
    } else if (!termsAccepted && permissionsGranted) {
      setAlertMessage('You must accept the terms');
      setAlertVisible(true);
      setSubmitting(false);
      return;
    } else if (!termsAccepted && !permissionsGranted) {
      setAlertMessage('You must accept the terms and enable permissions to use the app.');
      setAlertVisible(true);
      setSubmitting(false);
      return;
    }

    setLoading(true);
    dispatch(loginRequest());
    try {
      const response = await login(loginValues);
      const { accessToken, id, roles } = response.data;
      if (!accessToken) {
        console.error('Received null or undefined token:', accessToken);
        throw new Error('Token is null or undefined');
      }
      console.log('Login Response:', response.data);
      await storeToken(accessToken);
      dispatch(loginSuccess(accessToken, id, roles));
      navigation.replace('Main');
    } catch (error) {
      console.log(error);
      dispatch(loginFailure(error.message));
      setFieldError('usernameOrEmail', 'Invalid registration number or email');
      setFieldError('password', 'Invalid password');
      setAlertMessage('Invalid registration number or email or password\n Please try again.');
      setAlertVisible(true);
      setFormValues(values);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (values, { setSubmitting, setFieldError }) => {
    try {
      const emailExists = await checkEmailExists(values.email);
      if (!emailExists) {
        setAlertMessage('Email does not exist.');
        setAlertVisible(true);
        setFieldError('email', 'Email does not exist');
        setSubmitting(false);
        return;
      }
      setLoading(true);
      const response = await forgetPassword(values.email);
      setLoading(false);
      setShowForgotPasswordForm(false);
      setShowResetPasswordForm(true);
      setAlertMessage('Reset link sent to your email.');
      setAlertVisible(true);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    }
  };


  const handleResetPassword = async (values) => {
    try {
      const response = await resetPassword(values.verificationCode, values.newPassword);
      setShowResetPasswordForm(false);
      setShowForgotPasswordForm(false);
      setAlertMessage('Password reset successful\n You can now log in with your new password.');
      setAlertVisible(true);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    }
  };

  const showForgotPassword = () => {
    setShowForgotPasswordForm(true);
    setShowResetPasswordForm(false);
  };

  const showLoginForm = () => {
    setShowForgotPasswordForm(false);
    setShowResetPasswordForm(false);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      {loading ? (
        <LoaderScreen />
      ) : (
        <>
        {!showForgotPasswordForm && !showResetPasswordForm && (
          <Formik
            initialValues={formValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleLogin(values, actions)}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Login</Text>
                <View style={styles.inputContainer}>
                  <Image source={userIcon} style={styles.icon} />
                  <TextInput
                    style={[styles.input, touched.usernameOrEmail && errors.usernameOrEmail && styles.inputError]}
                    placeholder="Registration number or Email"
                    onChangeText={handleChange('usernameOrEmail')}
                    onBlur={handleBlur('usernameOrEmail')}
                    value={values.usernameOrEmail}
                  />
                </View>
                {touched.usernameOrEmail && errors.usernameOrEmail && <Text style={styles.error}>{errors.usernameOrEmail}</Text>}

                <View style={styles.inputContainer}>
                  <Image source={passwordIcon} style={styles.icon} />
                  <TextInput
                    style={[styles.input, touched.password && errors.password && styles.inputError]}
                    placeholder="Password"
                    secureTextEntry={!isPasswordVisible}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                    <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#333" />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                <View style={styles.checkboxContainer}>
                  <CheckBox value={termsAccepted} onValueChange={setTermsAccepted} style={styles.checkbox} />
                  <TouchableOpacity onPress={openModal}>
                    <Text style={styles.label}>
                      I agree with the <Text style={styles.link}>Privacy Policy.</Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.forgotPasswordLink}>
                  <TouchableOpacity onPress={showForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot your password ?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        )}

{showForgotPasswordForm && (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={(values, actions) => handleForgotPassword(values, actions)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Forgot Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.email && errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
              </View>
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={showLoginForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      )}


{showResetPasswordForm && (
  <Formik
    initialValues={{ verificationCode: '', newPassword: '' }}
    validationSchema={resetPasswordSchema}
    onSubmit={(values, actions) => handleResetPassword(values, actions)}
  >
    {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => {
      const { strengthCount, strengthLabel, strengthColor } = getPasswordStrength(values.newPassword);

      return (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Reset Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, touched.verificationCode && errors.verificationCode && styles.inputError]}
              placeholder="Verification Code"
              onChangeText={handleChange('verificationCode')}
              onBlur={handleBlur('verificationCode')}
              value={values.verificationCode}
            />
          </View>
          {touched.verificationCode && errors.verificationCode && <Text style={styles.error}>{errors.verificationCode}</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, touched.newPassword && errors.newPassword && styles.inputError]}
              placeholder="New Password"
              secureTextEntry
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              value={values.newPassword}
            />
          </View>
          {touched.newPassword && errors.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}

          {values.newPassword && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View style={[styles.strengthFill, { width: `${(strengthCount / 4) * 100}%`, backgroundColor: strengthColor }]} />
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={showLoginForm}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }}
  </Formik>
)}

        <CustomAlert isVisible={alertVisible} message={alertMessage} onClose={closeAlert} />
      </>
    )}

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.termsTitle}>Terms and Conditions</Text>
              <Text style={styles.termsText}>
                <Text style={styles.termsSection}>Last updated :</Text> <Text style={styles.termsTextBold}>May 30, 2024</Text>
                {'\n\n'}
                This <Text style={styles.termsTextBold}>Privacy Policy</Text> describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                {'\n\n'}
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this <Text style={styles.termsTextBold}>Privacy Policy</Text>. This Privacy Policy has been created with the help of the Free Privacy Policy Generator.
                {'\n\n'}
                <Text style={styles.termsSection}>Interpretation and Definitions</Text>
                {'\n\n'}
                <Text style={styles.termsTextBold}>Interpretation</Text>
                {'\n\n'}
                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Definitions</Text>
                {'\n\n'}
                For the purposes of this <Text style={styles.termsTextBold}>Privacy Policy</Text>:
                {'\n\n'}
                <Text style={styles.termsTextBold}>Account</Text> means a unique account created for You to access our Service or parts of our Service.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Affiliate</Text> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Application</Text> refers to HrPoint, the software program provided by the Company.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Company</Text> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Digital identity, megrine tunis.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Country</Text> refers to: Tunisia
                {'\n\n'}
                <Text style={styles.termsTextBold}>Device</Text> means any device that can access the Service such as a computer, a cellphone or a digital tablet.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Personal Data</Text> is any information that relates to an identified or identifiable individual.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Service</Text> refers to the Application.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Service Provider</Text> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.
                {'\n\n'}
                Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
                {'\n\n'}
                You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                {'\n\n'}
                <Text style={styles.termsSection}>Collecting and Using Your Personal Data</Text>
                {'\n\n'}
                <Text style={styles.termsTextBold}>Types of Data Collected</Text>
                {'\n\n'}
                <Text style={styles.termsTextBold}>Personal Data</Text>
                {'\n\n'}
                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                {'\n\n'}
                Email address
                {'\n\n'}
                First name and last name
                {'\n\n'}
                Phone number
                {'\n\n'}
                Address, State, Province, ZIP/Postal code, City
                {'\n\n'}
                <Text style={styles.termsSection}>Usage Data</Text>
                {'\n\n'}
                Usage Data is collected automatically when using the Service.
                {'\n\n'}
                Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                {'\n\n'}
                When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                {'\n\n'}
                We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
                {'\n\n'}
                <Text style={styles.termsSection}>Information Collected while Using the Application</Text>
                {'\n\n'}
                While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:
                {'\n\n'}
                Information regarding your location
                {'\n\n'}
                We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.
                {'\n\n'}
                You can enable or disable access to this information at any time, through Your Device settings.
                {'\n\n'}
                <Text style={styles.termsSection}>Use of Your Personal Data</Text>
                {'\n\n'}
                The Company may use Personal Data for the following purposes:
                {'\n\n'}
                To provide and maintain our Service, including to monitor the usage of our Service.
                {'\n\n'}
                To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.
                {'\n\n'}
                For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.
                {'\n\n'}
                To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.
                {'\n\n'}
                To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.
                {'\n\n'}
                To manage Your requests: To attend and manage Your requests to Us.
                {'\n\n'}
                For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.
                {'\n\n'}
                For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.
                {'\n\n'}
                We may share Your personal information in the following situations:
                {'\n\n'}
                With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.
                {'\n\n'}
                For business transfers: We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.
                {'\n\n'}
                With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.
                {'\n\n'}
                With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.
                {'\n\n'}
                With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.
                {'\n\n'}
                With Your consent: We may disclose Your personal information for any other purpose with Your consent.
                {'\n\n'}
                <Text style={styles.termsSection}>Retention of Your Personal Data</Text>
                {'\n\n'}
                The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                {'\n\n'}
                The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
                {'\n\n'}
                <Text style={styles.termsSection}>Transfer of Your Personal Data</Text>
                {'\n\n'}
                Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.
                {'\n\n'}
                Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
                {'\n\n'}
                The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.
                {'\n\n'}
                <Text style={styles.termsSection}>Delete Your Personal Data</Text>
                {'\n\n'}
                You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
                {'\n\n'}
                Our Service may give You the ability to delete certain information about You from within the Service.
                {'\n\n'}
                You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.
                {'\n\n'}
                Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
                {'\n\n'}
                <Text style={styles.termsSection}>Disclosure of Your Personal Data</Text>
                {'\n\n'}
                <Text style={styles.termsTextBold}>Business Transactions</Text>
                {'\n\n'}
                If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
                {'\n\n'}
                <Text style={styles.termsTextBold}>Law enforcement</Text>
                {'\n\n'}
                Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
                {'\n\n'}
                <Text style={styles.termsTextBold}>Other legal requirements</Text>
                {'\n\n'}
                The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                {'\n\n'}
                Comply with a legal obligation
                {'\n\n'}
                Protect and defend the rights or property of the Company
                {'\n\n'}
                Prevent or investigate possible wrongdoing in connection with the Service
                {'\n\n'}
                Protect the personal safety of Users of the Service or the public
                {'\n\n'}
                Protect against legal liability
                {'\n\n'}
                <Text style={styles.termsSection}>Security of Your Personal Data</Text>
                {'\n\n'}
                The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                {'\n\n'}
                <Text style={styles.termsSection}>Children's Privacy</Text>
                {'\n\n'}
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                {'\n\n'}
                If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.
                {'\n\n'}
                <Text style={styles.termsSection}>Links to Other Websites</Text>
                {'\n\n'}
                Our Service may contain links to other websites that are not operated by Us. If You click on a third-party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.
                {'\n\n'}
                We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
                {'\n\n'}
                <Text style={styles.termsSection}>Changes to this Privacy Policy</Text>
                {'\n\n'}
                We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                {'\n\n'}
                We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
                {'\n\n'}
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                {'\n\n'}
                <Text style={styles.termsSection}>Contact Us</Text>
                {'\n\n'}
                If you have any questions about this Privacy Policy, You can contact us:
                {'\n\n'}
                <Text style={styles.termsSection}>By email : </Text><Text style={styles.linkemail}>digid.contact@gmail.com</Text>
              </Text>
            </ScrollView>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={closeModal}>
                <Text style={styles.buttonTextTerms}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => { setTermsAccepted(true); closeModal(); }}>
                <Text style={styles.buttonTextTerms}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingVertical: 5, // Increase padding
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#000',
    // borderBottomWidth: 1,
    paddingRight: 10, // Add right padding
    paddingLeft: 10,
    marginRight: 10,
    borderBottomWidth: 0, // Remove border bottom here
    fontSize: 16, // Adjust font size
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
    // marginLeft: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    marginLeft: 8,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  linkemail: {
    color: '#007bff',
  },
  button: {
    backgroundColor: '#120E43',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  //   fontSize: 16,
  // },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop:10,
    marginBottom: -10,
  },
  termsTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2B2D42',
    textAlign: 'center',
    fontFamily: 'Argon',
  },
  termsSection: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#8D99AE',
    fontFamily: 'DM Sans Bold',
  },
  termsText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: '#2B2D42',
    fontFamily: 'DM Sans Regular',
  },
  termsTextBold: {
    fontWeight: 'bold',
    color: '#EF233C',
    fontFamily: 'DM Sans Bold',
  },
  termsTextItalic: {
    fontStyle: 'italic',
    color: '#D90429',
    fontFamily: 'DM Sans Medium',
  },
  acceptButton: {
    backgroundColor: 'green',
    width: '25%',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5, // Adjust this value to reduce the height
  },
  declineButton: {
    backgroundColor: 'red',
    width: '25%',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5, // Adjust this value to reduce the height
  },
  buttonTextTerms: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
  },
  iconContainer: {
    padding: 5,
    borderColor: '#000',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  forgotPasswordLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007bff',
    // textDecorationLine: 'underline',
    textDecorationLine: 'none',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#f8f9fa',
    textDecorationLine: 'none',
    fontSize: 16,
    // fontWeight: 'bold',
  },
  strengthContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  strengthBar: {
    height: 10,
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#d3d3d3',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 5,
  },
  strengthLabel: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default LoginForm;
