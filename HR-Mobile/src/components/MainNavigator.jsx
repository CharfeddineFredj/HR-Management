/* eslint-disable prettier/prettier */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuModal from './MenuModal';
import HomeScreen from '../screen/HomeScreen/HomeScreen';
import CheckInOutScreen from '../screen/CheckInOutScreen';
import ConsultHistoryScreen from '../screen/ConsultHistoryScreen';
import HolidaysScreen from '../screen/HolidaysScreen';
import ProfileScreen from '../screen/profile/ProfileScreen';
import SettingsScreen from '../screen/setting/SettingsScreen';
import WorkScheduleScreen from '../screen/WorkScheduleScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const CustomHeader = ({ navigation }) => ({
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
      <Icon name="menu" size={25} color="#fff" />
    </TouchableOpacity>
  ),
  headerRight: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconButton}>
      <Icon name="home-outline" size={25} color="#fff" />
    </TouchableOpacity>
  ),
  headerStyle: {
    backgroundColor: '#6200EE',
  },
  headerTintColor: '#FFF',
});

const HomeStack = ({ route }) => {
  const { id, roles } = route.params || {};
  return (
    <Stack.Navigator screenOptions={CustomHeader}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CheckInOut" component={CheckInOutScreen} initialParams={{ id, roles }} />
      <Stack.Screen name="Consult History" component={ConsultHistoryScreen} initialParams={{ id, roles }} />
      <Stack.Screen name="Holidays" component={HolidaysScreen} initialParams={{ id, roles }}/>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ id, roles }} // Pass the id and roles to ProfileScreen
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ id, roles }} // Pass the id and roles to SettingsScreen
      />
            <Stack.Screen
        name="WorkSchedule"
        component={WorkScheduleScreen}
        initialParams={{ id, roles }} // Pass the id to WorkScheduleScreen
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <MenuModal {...props} />}>
    <Drawer.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  iconButton: {
    marginHorizontal: 10,  // Adjust this value to control the spacing
  },
});

export default MainNavigator;
