/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { fetchPointageHistoryByUserId } from '../config/apiService';
import LoaderScreen from '../components/LoaderScreen';

const backgroundImg = require('../assets/images/background.jpg'); // Ensure this path is correct

const ConsultHistoryScreen = ({ route }) => {
  const { id } = route.params || {}; // Retrieve userId from route params
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('No userId provided.');
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log('Fetching history for userId:', id);
        const data = await fetchPointageHistoryByUserId(id);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Date: {new Date(item.checkInTime).toLocaleDateString()}</Text>
      <Text style={styles.historyText}>Check-In: {new Date(item.checkInTime).toLocaleTimeString()}</Text>
      <Text style={styles.historyText}>Check-Out: {new Date(item.checkOutTime).toLocaleTimeString()}</Text>
      <Text style={styles.historyText}>Status: {item.completed ? 'Completed' : 'Incomplete'}</Text>
    </View>
  );

  if (loading) {
    return (
      <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
        <View style={styles.loaderContainer}>
          <LoaderScreen />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Consult History</Text>
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.historyList}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background to ensure text visibility
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  historyList: {
    flexGrow: 1,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  historyText: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for loader
  },
});

export default ConsultHistoryScreen;
