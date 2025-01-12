/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import { fetchUserById, fetchPointageHistoryByUserId } from '../../config/apiService';
import { getToken } from '../../config/asyncStorage';
import moment from 'moment';
import { connect } from 'react-redux';

const ProfileScreen = ({ navigation, id, roles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const defaultImage = require('../../assets/images/digidlogo.png');
  const backgroundImg = require('../../assets/images/background.jpg');

  const loadUserProfile = useCallback(async () => {
    if (!id || !roles) {
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }
      const userProfile = await fetchUserById(id, roles);
      console.log('Fetched userProfile:', userProfile); // Log userProfile for debugging
      setUser(userProfile);

      // Fetch pointage history by user ID
      const pointageHistory = await fetchPointageHistoryByUserId(id);
      console.log('Fetched pointageHistory:', pointageHistory); // Log pointageHistory for debugging

      if (pointageHistory.length > 0) {
        const lastPointage = pointageHistory[pointageHistory.length - 1]; // Get the last pointage
        setCheckInTime(lastPointage.checkInTime);
        setCheckOutTime(lastPointage.checkOutTime);
      } else {
        setCheckInTime(null);
        setCheckOutTime(null);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [id, roles]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  useEffect(() => {
    if (checkInTime) {
      if (checkOutTime) {
        const duration = moment.duration(moment(checkOutTime).diff(moment(checkInTime)));
        setElapsedTime(`${duration.hours()}:${duration.minutes()}:${duration.seconds()}`);
      } else {
        const interval = setInterval(() => {
          const now = moment();
          const checkInMoment = moment(checkInTime);
          const duration = moment.duration(now.diff(checkInMoment));
          setElapsedTime(`${duration.hours()}:${duration.minutes()}:${duration.seconds()}`);
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [checkInTime, checkOutTime]);

  const formatCheckInDate = (date) => {
    return moment(date).format('dddd, MMMM Do YYYY, HH:mm');
  };

  const calculateShiftDuration = (start, end) => {
    if (start && end) {
      const duration = moment.duration(moment(end).diff(moment(start)));
      return `${duration.hours()} hrs ${duration.minutes()} mins`;
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ImageBackground>
    );
  }

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text>Error loading profile</Text>
      </View>
    );
  }

  const imagePath = roles.includes('Administrateur')
    ? `administrateur/files/${user.image}`
    : `employee/files/${user.image}`;

  return (
    <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, {user.firstname || 'User'}</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profilePictureWrapper}>
            <Image
              source={user.image ? { uri: `${Config.API_BASE_URL}/${imagePath}` } : defaultImage}
              style={styles.profilePicture}
              onError={() => setUser(prevState => ({ ...prevState, image: null }))}
            />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="clock-outline" size={30} color="#FFF" />
              <Text style={styles.actionText}>Time Clock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="chat-outline" size={30} color="#FFF" />
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="calendar-outline" size={30} color="#FFF" />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="account-outline" size={30} color="#FFF" />
              <Text style={styles.actionText}>Directory</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.shiftSection}>
          <Text style={styles.shiftText}>Ongoing shift for {user.firstname || 'User'}</Text>
          <View style={styles.shiftRow}>
            <Icon name="calendar-clock" size={20} color="#6c757d" />
            <Text style={styles.shiftDetails}>
              Started at {checkInTime ? formatCheckInDate(checkInTime) : 'N/A'}
            </Text>
          </View>
          {checkOutTime && (
            <View style={styles.shiftRow}>
              <Icon name="clock-out" size={20} color="#6c757d" />
              <Text style={styles.shiftDetails}>
                Ended at {moment(checkOutTime).format('HH:mm')}
              </Text>
            </View>
          )}
          <Text style={styles.shiftDetails}>
            Duration: {calculateShiftDuration(checkInTime, checkOutTime)}
          </Text>
          <Text style={styles.timer}>{elapsedTime}</Text>
        </View>
        <View style={styles.tasksSection}>
          <Text style={styles.tasksText}>2 tasks are due tomorrow</Text>
        </View>
        <View style={styles.updatesSection}>
          <Text style={styles.updatesHeader}>Updates</Text>
          <View style={styles.update}>
            <Text style={styles.updateText}>Let's welcome our new team members, John and Erica!</Text>
          </View>
        </View>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>Today is {moment().format('MMMM Do YYYY')}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background to ensure text visibility
  },
  header: {
    padding: 20,
    paddingTop: 40, // Additional space at the top
    alignItems: 'center',
    backgroundColor: '#6a11cb', // Solid background color
  },
  greeting: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'DMSans-Bold',
    marginBottom: 10, // Space between text and profile picture
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  profilePictureWrapper: {
    position: 'relative',
    top: -40, // Move up the profile picture
    zIndex: 1,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: -40, // Adjust to move up the action buttons
    zIndex: 0,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347', // Updated color
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  actionText: {
    color: '#FFF',
    marginTop: 5,
    fontFamily: 'DMSans-Regular',
  },
  shiftSection: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shiftText: {
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  shiftDetails: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    color: '#6c757d',
    marginLeft: 5,
  },
  timer: {
    fontSize: 28,
    fontFamily: 'DMSans-Bold',
    color: '#343a40',
    textAlign: 'right',
    marginTop: 10,
  },
  tasksSection: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 10,
  },
  tasksText: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#dc3545',
  },
  updatesSection: {
    padding: 20,
  },
  updatesHeader: {
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    marginBottom: 10,
  },
  update: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  updateText: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
  },
  dateSection: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 10,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#343a40',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for loader
  },
});

const mapStateToProps = state => ({
  id: state.auth.id,
  roles: state.auth.roles,
});

export default connect(mapStateToProps)(ProfileScreen);






// ***************** Old Profile Screen with Static on going shift time ****************** //////////////
// /* eslint-disable prettier/prettier */
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Config from 'react-native-config';
// import { fetchUserById } from '../../config/apiService';
// import { getToken } from '../../config/asyncStorage';

// const ProfileScreen = ({ route, navigation }) => {
//   const { id, roles } = route.params || {};
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const defaultImage = require('../../assets/images/digidlogo.png');
//   const backgroundImg = require('../../assets/images/background.jpg');

//   const loadUserProfile = useCallback(async () => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error('No token found');
//       }
//       const userProfile = await fetchUserById(id, roles);
//       setUser(userProfile);
//     } catch (error) {
//       console.error('Failed to load user profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id, roles]);

//   useEffect(() => {
//     loadUserProfile();
//   }, [loadUserProfile]);

//   if (loading) {
//     return (
//       <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       </ImageBackground>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loader}>
//         <Text>Error loading profile</Text>
//       </View>
//     );
//   }

//   const imagePath = roles.includes('Administrateur')
//     ? `administrateur/files/${user.image}`
//     : `employee/files/${user.image}`;

//   return (
//     <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
//       <ScrollView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.greeting}>Good morning, {user.firstname || 'User'}</Text>
//         </View>
//         <View style={styles.profileSection}>
//           <View style={styles.profilePictureWrapper}>
//             <Image
//               source={user.image ? { uri: `${Config.API_BASE_URL}/${imagePath}` } : defaultImage}
//               style={styles.profilePicture}
//               onError={() => setUser(prevState => ({ ...prevState, image: null }))}
//             />
//           </View>
//           <View style={styles.actions}>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="clock-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Time Clock</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="chat-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Chat</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="calendar-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Schedule</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="account-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Directory</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.shiftSection}>
//           <Text style={styles.shiftText}>Ongoing shift</Text>
//           <Text style={styles.shiftDetails}>Started at 08:02</Text>
//           <Text style={styles.timer}>02:00:04</Text>
//         </View>
//         <View style={styles.tasksSection}>
//           <Text style={styles.tasksText}>2 tasks are due tomorrow</Text>
//         </View>
//         <View style={styles.updatesSection}>
//           <Text style={styles.updatesHeader}>Updates</Text>
//           <View style={styles.update}>
//             <Text style={styles.updateText}>Let's welcome our new team members, John and Erica!</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flexGrow: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background to ensure text visibility
//   },
//   header: {
//     padding: 20,
//     paddingTop: 40, // Additional space at the top
//     alignItems: 'center',
//     backgroundColor: '#6a11cb', // Solid background color
//   },
//   greeting: {
//     color: '#FFF',
//     fontSize: 24,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10, // Space between text and profile picture
//   },
//   profileSection: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//   },
//   profilePictureWrapper: {
//     position: 'relative',
//     top: -40, // Move up the profile picture
//     zIndex: 1,
//     backgroundColor: '#FFF',
//     borderRadius: 50,
//     padding: 5,
//   },
//   profilePicture: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: -40, // Adjust to move up the action buttons
//     zIndex: 0,
//   },
//   actionButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FF6347', // Updated color
//     borderRadius: 10,
//     padding: 10,
//     margin: 5,
//   },
//   actionText: {
//     color: '#FFF',
//     marginTop: 5,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   shiftText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftDetails: {
//     fontSize: 14,
//     fontFamily: 'DMSans-Medium',
//     color: '#6c757d',
//   },
//   timer: {
//     fontSize: 28,
//     fontFamily: 'DMSans-Bold',
//     color: '#343a40',
//   },
//   tasksSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   tasksText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//     color: '#dc3545',
//   },
//   updatesSection: {
//     padding: 20,
//   },
//   updatesHeader: {
//     fontSize: 18,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10,
//   },
//   update: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   updateText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for loader
//   },
// });

// export default ProfileScreen;







// ***************** Old Profile Design with background image ****************** //////////////
// /* eslint-disable prettier/prettier */
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Config from 'react-native-config';
// import { fetchUserById } from '../../config/apiService';
// import { getToken } from '../../config/asyncStorage';

// const ProfileScreen = ({ route, navigation }) => {
//   const { id, roles } = route.params || {};
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const defaultImage = require('../../assets/images/digidlogo.png');
//   const backgroundImg = require('../../assets/images/background.jpg');

//   const loadUserProfile = useCallback(async () => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error('No token found');
//       }
//       const userProfile = await fetchUserById(id, roles);
//       setUser(userProfile);
//     } catch (error) {
//       console.error('Failed to load user profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id, roles]);

//   useEffect(() => {
//     loadUserProfile();
//   }, [loadUserProfile]);

//   if (loading) {
//     return (
//       <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       </ImageBackground>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loader}>
//         <Text>Error loading profile</Text>
//       </View>
//     );
//   }

//   const imagePath = roles.includes('Administrateur')
//     ? `administrateur/files/${user.image}`
//     : `employee/files/${user.image}`;

//   return (
//     <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
//       <ScrollView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.greeting}>Good morning, {user.firstname || 'User'}</Text>
//         </View>
//         <View style={styles.profileSection}>
//           <View style={styles.profilePictureWrapper}>
//             <Image
//               source={user.image ? { uri: `${Config.API_BASE_URL}/${imagePath}` } : defaultImage}
//               style={styles.profilePicture}
//               onError={() => setUser(prevState => ({ ...prevState, image: null }))}
//             />
//           </View>
//           <View style={styles.actions}>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="clock-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Time Clock</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="chat-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Chat</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="calendar-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Schedule</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="account-outline" size={30} color="#FFF" />
//               <Text style={styles.actionText}>Directory</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.shiftSection}>
//           <Text style={styles.shiftText}>Ongoing shift</Text>
//           <Text style={styles.shiftDetails}>Started at 08:02</Text>
//           <Text style={styles.timer}>02:00:04</Text>
//         </View>
//         <View style={styles.tasksSection}>
//           <Text style={styles.tasksText}>2 tasks are due tomorrow</Text>
//         </View>
//         <View style={styles.updatesSection}>
//           <Text style={styles.updatesHeader}>Updates</Text>
//           <View style={styles.update}>
//             <Text style={styles.updateText}>Let's welcome our new team members, John and Erica!</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flexGrow: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background to ensure text visibility
//   },
//   header: {
//     backgroundColor: '#6200EE',
//     padding: 20,
//     paddingTop: 40, // Additional space at the top
//     alignItems: 'center',
//   },
//   greeting: {
//     color: '#FFF',
//     fontSize: 24,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10, // Space between text and profile picture
//   },
//   profileSection: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//   },
//   profilePictureWrapper: {
//     position: 'relative',
//     top: -40, // Move up the profile picture
//     zIndex: 1,
//     backgroundColor: '#FFF',
//     borderRadius: 50,
//     padding: 5,
//   },
//   profilePicture: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: -40, // Adjust to move up the action buttons
//     zIndex: 0,
//   },
//   actionButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#6200EE',
//     borderRadius: 10,
//     padding: 10,
//     margin: 5,
//   },
//   actionText: {
//     color: '#FFF',
//     marginTop: 5,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   shiftText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftDetails: {
//     fontSize: 14,
//     fontFamily: 'DMSans-Medium',
//     color: '#6c757d',
//   },
//   timer: {
//     fontSize: 28,
//     fontFamily: 'DMSans-Bold',
//     color: '#343a40',
//   },
//   tasksSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   tasksText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//     color: '#dc3545',
//   },
//   updatesSection: {
//     padding: 20,
//   },
//   updatesHeader: {
//     fontSize: 18,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10,
//   },
//   update: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   updateText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for loader
//   },
// });

// export default ProfileScreen;



// ***************** Old Profile Design without background image ****************** //////////////
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Config from 'react-native-config';
// import { fetchUserById } from '../../config/apiService';
// import { getToken } from '../../config/asyncStorage';

// const ProfileScreen = ({ route, navigation }) => {
//   const { id, roles } = route.params || {}; // Destructure id and roles from route params
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const defaultImage = require('../../assets/images/digidlogo.png'); // Path to the default image

//   const loadUserProfile = useCallback(async () => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error('No token found');
//       }

//       const userProfile = await fetchUserById(id, roles);
//       setUser(userProfile);
//     } catch (error) {
//       console.error('Failed to load user profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id, roles]);

//   useEffect(() => {
//     loadUserProfile();
//   }, [loadUserProfile]);

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loader}>
//         <Text>Error loading profile</Text>
//       </View>
//     );
//   }

//   const imagePath = roles.includes('Administrateur')
//     ? `administrateur/files/${user.image}`
//     : `employee/files/${user.image}`;

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Good morning, {user.firstname || 'User'}</Text>
//       </View>
//       <View style={styles.profileSection}>
//         <View style={styles.profilePictureWrapper}>
//           <Image
//             source={user.image ? { uri: `${Config.API_BASE_URL}/${imagePath}` } : defaultImage}
//             style={styles.profilePicture}
//             onError={() => setUser(prevState => ({ ...prevState, image: null }))}
//           />
//         </View>
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="clock-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Time Clock</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="chat-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Chat</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="calendar-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Schedule</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="account-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Directory</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.shiftSection}>
//         <Text style={styles.shiftText}>Ongoing shift</Text>
//         <Text style={styles.shiftDetails}>Started at 08:02</Text>
//         <Text style={styles.timer}>02:00:04</Text>
//       </View>
//       <View style={styles.tasksSection}>
//         <Text style={styles.tasksText}>2 tasks are due tomorrow</Text>
//       </View>
//       <View style={styles.updatesSection}>
//         <Text style={styles.updatesHeader}>Updates</Text>
//         <View style={styles.update}>
//           <Text style={styles.updateText}>Let's welcome our new team members, John and Erica!</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#6200EE',
//     padding: 20,
//     paddingTop: 40, // Additional space at the top
//     alignItems: 'center',
//   },
//   greeting: {
//     color: '#FFF',
//     fontSize: 24,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10, // Space between text and profile picture
//   },
//   profileSection: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//   },
//   profilePictureWrapper: {
//     position: 'relative',
//     top: -40, // Move up the profile picture
//     zIndex: 1,
//     backgroundColor: '#FFF',
//     borderRadius: 50,
//     padding: 5,
//   },
//   profilePicture: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: -40, // Adjust to move up the action buttons
//     zIndex: 0,
//   },
//   actionButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#6200EE',
//     borderRadius: 10,
//     padding: 10,
//     margin: 5,
//   },
//   actionText: {
//     color: '#FFF',
//     marginTop: 5,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   shiftText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftDetails: {
//     fontSize: 14,
//     fontFamily: 'DMSans-Medium',
//     color: '#6c757d',
//   },
//   timer: {
//     fontSize: 28,
//     fontFamily: 'DMSans-Bold',
//     color: '#343a40',
//   },
//   tasksSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   tasksText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//     color: '#dc3545',
//   },
//   updatesSection: {
//     padding: 20,
//   },
//   updatesHeader: {
//     fontSize: 18,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10,
//   },
//   update: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   updateText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ProfileScreen;



// ***************** Old Profile Design without background image Check it if you want ****************** //////////////

/* eslint-disable prettier/prettier */
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Config from 'react-native-config';
// import { fetchUserById } from '../../config/apiService';
// import { getToken } from '../../config/asyncStorage';

// const ProfileScreen = ({ route, navigation }) => {
//   const { id, roles } = route.params || {}; // Destructure id and roles from route params
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const defaultImage = require('../../assets/images/digidlogo.png'); // Path to the default image

//   const loadUserProfile = useCallback(async () => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error('No token found');
//       }

//       const userProfile = await fetchUserById(id, roles);
//       setUser(userProfile);
//     } catch (error) {
//       console.error("Failed to load user profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [id, roles]);

//   useEffect(() => {
//     loadUserProfile();
//   }, [loadUserProfile]);

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loader}>
//         <Text>Error loading profile</Text>
//       </View>
//     );
//   }

//   const imagePath = roles.includes('Administrateur')
//     ? `administrateur/files/${user.image}`
//     : `employee/files/${user.image}`;

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Good morning, {user.firstname || 'User'}</Text>
//       </View>
//       <View style={styles.profileSection}>
//         <Image
//           source={user.image ? { uri: `${Config.API_BASE_URL}/${imagePath}` } : defaultImage}
//           style={styles.profilePicture}
//           onError={() => setUser(prevState => ({ ...prevState, image: null }))}
//         />
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="clock-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Time Clock</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="chat-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Chat</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="calendar-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Schedule</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="account-outline" size={30} color="#FFF" />
//             <Text style={styles.actionText}>Directory</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.shiftSection}>
//         <Text style={styles.shiftText}>Ongoing shift</Text>
//         <Text style={styles.shiftDetails}>Started at 08:02</Text>
//         <Text style={styles.timer}>02:00:04</Text>
//       </View>
//       <View style={styles.tasksSection}>
//         <Text style={styles.tasksText}>2 tasks are due tomorrow</Text>
//       </View>
//       <View style={styles.updatesSection}>
//         <Text style={styles.updatesHeader}>Updates</Text>
//         <View style={styles.update}>
//           <Text style={styles.updateText}>Let's welcome our new team members, John and Erica!</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#6200EE',
//     padding: 20,
//   },
//   greeting: {
//     color: '#FFF',
//     fontSize: 24,
//     fontFamily: 'DMSans-Bold',
//   },
//   profileSection: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//   },
//   profilePicture: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   actionButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#6200EE',
//     borderRadius: 10,
//     padding: 10,
//     margin: 5,
//   },
//   actionText: {
//     color: '#FFF',
//     marginTop: 5,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   shiftText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   shiftDetails: {
//     fontSize: 14,
//     fontFamily: 'DMSans-Medium',
//     color: '#6c757d',
//   },
//   timer: {
//     fontSize: 28,
//     fontFamily: 'DMSans-Bold',
//     color: '#343a40',
//   },
//   tasksSection: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 10,
//   },
//   tasksText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//     color: '#dc3545',
//   },
//   updatesSection: {
//     padding: 20,
//   },
//   updatesHeader: {
//     fontSize: 18,
//     fontFamily: 'DMSans-Bold',
//     marginBottom: 10,
//   },
//   update: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   updateText: {
//     fontSize: 16,
//     fontFamily: 'DMSans-Regular',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ProfileScreen;

// // Assuming this is part of asyncStorage.js or another utility file
// export const getUserIdFromToken = async (token) => {
//   // Decode the token or retrieve the user ID from secure storage/session
//   // This is a placeholder. Replace with actual implementation.
//   return 1; // Replace with actual user ID retrieval logic based on your application
// };
