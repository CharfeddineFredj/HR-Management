/* eslint-disable prettier/prettier */
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoaderScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoaderScreen;


// /* eslint-disable prettier/prettier */
// import React from 'react';
// import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

// const backgroundImg = require('../assets/images/background.jpg'); // Ensure the correct path

// const LoaderScreen = () => {
//   return (
//     <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default LoaderScreen;
