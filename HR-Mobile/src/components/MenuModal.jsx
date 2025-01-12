/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchUserById, logout } from '../config/apiService';
import { getToken } from '../config/asyncStorage';
import { connect, useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../Redux/authActions';
import CustomAlert from './CustomAlert';
import Config from 'react-native-config';
import RoleGuard from '../guards/RoleGuard';

const MenuModal = ({ navigation, id, roles }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState('Loading...');
  const defaultImage = require('../assets/images/digidlogo.png'); // Path to the default image
  const dispatch = useDispatch();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const loadUserProfile = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      console.error('No token found, user may need to login again.');
      return;
    }

    try {
      const userProfile = await fetchUserById(id, roles);
      if (userProfile && userProfile.image) {
        const imagePath = roles.includes('Administrateur')
          ? `administrateur/files/${userProfile.image}`
          : `employee/files/${userProfile.image}`;

        setProfilePicture(`${Config.API_BASE_URL}/${imagePath}`);
      } else {
        setProfilePicture(defaultImage);
      }
      setUserName(
        userProfile.firstname && userProfile.lastname
          ? `${userProfile.firstname} ${userProfile.lastname}`
          : userProfile.username || 'No Name'
      );
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUserName('Failed to load');
      setProfilePicture(defaultImage);
    }
  }, [defaultImage, id, roles]);

  useEffect(() => {
    if (!id) {
      navigation.replace('Login');
      return;
    }
    loadUserProfile();
  }, [id, loadUserProfile, navigation]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(reduxLogout());
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setAlertMessage('Unable to log out. Please try again.');
      setAlertVisible(true);
    }
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <ScrollView style={styles.MenuModal}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Profile', params: { id, roles } })}>
          <View style={styles.profilePictureWrapper}>
            {profilePicture ? (
              typeof profilePicture === 'string' ? (
                <Image
                  key={profilePicture}
                  source={{ uri: profilePicture }}
                  style={styles.profilePicture}
                  onError={() => setProfilePicture(defaultImage)}
                />
              ) : (
                <Image source={profilePicture} style={styles.profilePicture} />
              )
            ) : (
              <Icon name="account-circle" size={90} color="#FFF" />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('HomeStack', { screen: 'Profile', params: { id, roles } })}>
        <Icon name="account-outline" size={20} color="#FFF" />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          navigation.navigate('HomeStack', { screen: 'CheckInOut', params: { id, roles } })
        }>
        <Icon name="clock-outline" size={20} color="#FFF" />
        <Text style={styles.menuText}>Check In/Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          navigation.navigate('HomeStack', { screen: 'Consult History', params: { id, roles } })
        }>
        <Icon name="history" size={20} color="#FFF" />
        <Text style={styles.menuText}>Consult History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('HomeStack', { screen: 'Holidays', params: { id, roles } })}>
        <Icon name="beach" size={20} color="#FFF" />
        <Text style={styles.menuText}>Holidays</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('HomeStack', { screen: 'Settings', params: { id, roles } })}>
        <Icon name="lock-reset" size={20} color="#FFF" />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>
      {RoleGuard(['Administrateur'], roles) && (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('HomeStack', { screen: 'WorkSchedule', params: { id, roles } })}>
        <Icon name="calendar-clock" size={20} color="#FFF" />
        <Text style={styles.menuText}>Work Schedule</Text>
      </TouchableOpacity>
          )}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <CustomAlert
        isVisible={alertVisible}
        message={alertMessage}
        onClose={closeAlert}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  MenuModal: {
    flex: 1,
    backgroundColor: '#6200EE',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePictureWrapper: {
    borderWidth: 4,
    borderColor: '#FFF',
    borderRadius: 50, // Half of the profilePicture size + border width
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profilePicture: {
    width: 90, // Increase the size of the profile picture
    height: 90,
    borderRadius: 45,
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10, // Adjust the margin to provide space between the picture and the name
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    marginLeft: 10,
  },
});

const mapStateToProps = state => ({
  id: state.auth.id,
  roles: state.auth.roles,
});

export default connect(mapStateToProps)(MenuModal);



// ***************** Old Design Chek it if you want ***********************//
// /* eslint-disable prettier/prettier */
// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {fetchUserById, logout} from '../config/apiService';
// import {getToken} from '../config/asyncStorage';
// import {connect, useDispatch} from 'react-redux';
// import {logout as reduxLogout} from '../Redux/authActions';
// import CustomAlert from './CustomAlert';
// import Config from 'react-native-config';

// const MenuModal = ({navigation, id, roles}) => {
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [userName, setUserName] = useState('Loading...');
//   const defaultImage = require('../assets/images/digidlogo.png'); // Path to the default image
//   const dispatch = useDispatch();
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');

//   const loadUserProfile = useCallback(async () => {
//     const token = await getToken();
//     if (!token) {
//       console.error('No token found, user may need to login again.');
//       return;
//     }

//     try {
//       const userProfile = await fetchUserById(id, roles);
//       if (userProfile && userProfile.image) {
//         const imagePath = roles.includes('Administrateur')
//           ? `administrateur/files/${userProfile.image}`
//           : `employee/files/${userProfile.image}`;

//         setProfilePicture(`${Config.API_BASE_URL}/${imagePath}`);
//       } else {
//         setProfilePicture(defaultImage);
//       }
//       setUserName(
//         userProfile.firstname && userProfile.lastname
//           ? `${userProfile.firstname} ${userProfile.lastname}`
//           : userProfile.username || 'No Name'
//       );
//     } catch (error) {
//       console.error('Failed to load user profile:', error);
//       setUserName('Failed to load');
//       setProfilePicture(defaultImage);
//     }
//   }, [defaultImage, id, roles]);

//   useEffect(() => {
//     if (!id) {
//       navigation.replace('Login');
//       return;
//     }
//     loadUserProfile();
//   }, [id, loadUserProfile, navigation]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       dispatch(reduxLogout());
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'Login'}],
//       });
//     } catch (error) {
//       setAlertMessage('Unable to log out. Please try again.');
//       setAlertVisible(true);
//     }
//   };

//   const closeAlert = () => {
//     setAlertVisible(false);
//   };

//   return (
//     <ScrollView style={styles.MenuModal}>
//       <View style={styles.profileSection}>
//         <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Profile', params: { id, roles } })}>
//           {profilePicture ? (
//             typeof profilePicture === 'string' ? (
//               <Image
//                 key={profilePicture}
//                 source={{uri: profilePicture}}
//                 style={styles.profilePicture}
//                 onError={() => setProfilePicture(defaultImage)}
//               />
//             ) : (
//               <Image source={profilePicture} style={styles.profilePicture} />
//             )
//           ) : (
//             <Icon name="account-circle" size={80} color="#FFF" />
//           )}
//         </TouchableOpacity>
//         <Text style={styles.userName}>{userName}</Text>
//       </View>
//       <TouchableOpacity
//       style={styles.menuItem}
//       onPress={() => navigation.navigate('HomeStack', { screen: 'Profile', params: { id, roles } })}>
//       <Icon name="account-outline" size={20} color="#FFF" />
//       <Text style={styles.menuText}>Profile</Text>
//     </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() =>
//           navigation.navigate('HomeStack', {screen: 'CheckInOut'})
//         }>
//         <Icon name="clock-outline" size={20} color="#FFF" />
//         <Text style={styles.menuText}>Check In/Out</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() =>
//           navigation.navigate('HomeStack', {screen: 'ConsultHistory'})
//         }>
//         <Icon name="history" size={20} color="#FFF" />
//         <Text style={styles.menuText}>Consult History</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.menuItem}
//         onPress={() => navigation.navigate('HomeStack', {screen: 'Holidays'})}>
//         <Icon name="beach" size={20} color="#FFF" />
//         <Text style={styles.menuText}>Holidays</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//         <Icon name="logout" size={24} color="#FFF" />
//         <Text style={styles.logoutText}>Log Out</Text>
//       </TouchableOpacity>
//       <CustomAlert
//         isVisible={alertVisible}
//         message={alertMessage}
//         onClose={closeAlert}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   MenuModal: {
//     flex: 1,
//     backgroundColor: '#6200EE',
//     padding: 20,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   profilePicture: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   userName: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   menuText: {
//     color: '#FFF',
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   logoutText: {
//     color: '#FFF',
//     marginLeft: 10,
//   },
// });

// const mapStateToProps = state => ({
//   id: state.auth.id,
//   roles: state.auth.roles,
// });

// export default connect(mapStateToProps)(MenuModal);
