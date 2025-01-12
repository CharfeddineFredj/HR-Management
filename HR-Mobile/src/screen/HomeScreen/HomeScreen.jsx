/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Image, Linking } from 'react-native';
import { connect } from 'react-redux';
import { fetchAllPointages, fetchPointageHistoryByUserId } from '../../config/apiService';
import Config from 'react-native-config';
import CircularProgress from '../../components/CircularProgress';

const backgroundImg = require('../../assets/images/background.jpg');
const defaultImage = require('../../assets/images/digidlogo.png');
const googleMapsImg = require('../../assets/images/map.png');

const HomeScreen = ({ navigation, id, roles }) => {
  const [pointageData, setPointageData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !roles) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let data = [];
        if (roles.includes('Administrateur') || roles.includes('Responsable')) {
          data = await fetchAllPointages();
        } else {
          const userProfile = await fetchPointageHistoryByUserId(id);
          data = userProfile || [];
        }
        setPointageData(data);
      } catch (error) {
        console.error('Failed to fetch pointage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, roles]);

  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const calculatePercentage = (checkInTime, checkOutTime) => {
    const totalMinutes = 8 * 60; // Assuming 8-hour workday
    const workedMinutes = (new Date(checkOutTime) - new Date(checkInTime)) / 60000;
    return Math.min((workedMinutes / totalMinutes) * 100, 100).toFixed(2);
  };

  const renderItem = ({ item }) => {
    const percentage = calculatePercentage(item.checkInTime, item.checkOutTime);

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            source={item.user.image ? { uri: `${Config.API_BASE_URL}/employee/files/${item.user.image}` } : defaultImage}
            style={styles.userImage}
            onError={() => item.user.image = null}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.firstname} {item.user.lastname}</Text>
            <Text style={styles.userRegistration}>{item.user.username}</Text>
          </View>
          <View style={styles.dateMapContainer}>
            {(roles.includes('Administrateur') || roles.includes('Responsable')) && (
              <TouchableOpacity onPress={() => openMap(item.latitude, item.longitude)} style={styles.mapIcon}>
                <Image source={googleMapsImg} style={styles.mapImage} />
              </TouchableOpacity>
            )}
            <View style={styles.todayDate}>
              <Text style={styles.weekday}>{renderDate(item.checkInTime).split(' ')[0]}</Text>
              <Text style={styles.day}>{renderDate(item.checkInTime).split(' ')[1]}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Check-In</Text>
            <Text style={styles.cardDescription}>{new Date(item.checkInTime).toLocaleString()}</Text>
            <Text style={styles.cardTitle}>Check-Out</Text>
            <Text style={styles.cardDescription}>{new Date(item.checkOutTime).toLocaleString()}</Text>
            <Text style={[styles.status, !item.completed && styles.uncompleted]}>{item.completed ? 'Full Hours Worked 🟢' : 'Partial Hours Worked 🔴'}</Text>
          </View>
          <View style={styles.progressContainer}>
            <CircularProgress
              percent={parseFloat(percentage)}
              radius={30}
              borderWidth={5}
              color="#3399FF"
              shadowColor="#999"
              bgColor="#fff"
            />
            <Text style={[styles.totalHoursText, styles.cardTitle, { color: 'gray' }]}>Total Hours Worked</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.container}>
        {id && roles ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('CheckInOut', { id, roles })}
              style={styles.button}>
              <Text style={styles.buttonText}>Clock In/Out</Text>
            </TouchableOpacity>
            {loading ? (
              <></>
            ) : (
              <FlatList
                data={pointageData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
              />
            )}
          </>
        ) : (
          <Text>Please log in to view your data.</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRegistration: {
    fontSize: 14,
    color: 'gray',
  },
  dateMapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    color: 'green',
    marginTop: 5,
  },
  uncompleted: {
    color: 'red',
  },
  mapIcon: {
    marginRight: 10,
    marginTop: 5,
  },
  mapImage: {
    width: 34,
    height: 34,
  },
  todayDate: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#ADD8E6',
  },
  weekday: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  day: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  progressContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  totalHoursText: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
    fontFamily:'argon',
  },
});

const mapStateToProps = state => ({
  id: state.auth.id,
  roles: state.auth.roles,
});

export default connect(mapStateToProps)(HomeScreen);
