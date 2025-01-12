/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet,
  ImageBackground, ActivityIndicator
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  fetchVacationsByUser, createVacationRequest, approveVacationRequest, rejectVacationRequest, deleteVacationRequest, getVacationDays,
  fetchAdminById, fetchEmployeeById, fetchEmployeeVacation
} from '../config/apiService';
import CustomAlert from '../components/CustomAlert';
import { connect } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import { getToken } from '../config/asyncStorage';
import RoleGuard from '../guards/RoleGuard';

const backgroundImg = require('../assets/images/background.jpg');

const formatDateString = (date) => {
  return date ? moment(date).format('YYYY-MM-DD') : 'N/A';
};

const HolidaysScreen = ({ roles = [], id = '' }) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [remainingDays, setRemainingDays] = useState(0);
  const [year, setYear] = useState(moment().year());
  const [file, setFile] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // For action loader
  const [openReasonDropdown, setOpenReasonDropdown] = useState(false); // Reason dropdown state

  const validateForm = () => {
    if (!registrationNumber || !startDate || !endDate || !reason) {
      setAlertMessage('All fields are required.');
      return false;
    }
    if (reason.toLowerCase() === 'sick vacation' && !file) {
      setAlertMessage('Medical certificate is required for sick vacation.');
      return false;
    }
    return true;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;

    setActionLoading(true); // Start action loader

    const newRequest = {
      registrationNumber,
      startDate,
      endDate,
      reason, // Ensure reason is correctly included here
      period: moment(endDate).diff(moment(startDate), 'days') + 1,
      created_at: new Date(),
      file,
    };

    try {
      await createVacationRequest(newRequest);
      setAlertMessage('Holiday request submitted successfully!');
      setRequests(prevRequests => [...prevRequests, newRequest]); // Update requests directly
      fetchVacationRequests(); // Refresh data after submitting request
    } catch (error) {
      setAlertMessage('Failed to submit request.');
    } finally {
      setStartDate(null);
      setEndDate(null);
      setReason('');
      setFile(null);
      setActionLoading(false); // End action loader
    }
  };

  const fetchVacationRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = roles.includes('Administrateur') || roles.includes('Responsable')
        ? await fetchVacationsByUser()
        : await fetchEmployeeVacation(registrationNumber);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch vacation requests:', error);
    } finally {
      setLoading(false);
    }
  }, [registrationNumber, roles]);

  const fetchVacationDays = useCallback(async () => {
    try {
      const { remainingDays } = await getVacationDays(registrationNumber, year);
      setRemainingDays(remainingDays);
    } catch (error) {
      console.error('Failed to fetch vacation days:', error);
    }
  }, [registrationNumber, year]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      if (roles.includes('Administrateur')) {
        const adminProfile = await fetchAdminById(id, token);
        setRegistrationNumber(adminProfile.username);
      } else if (roles.includes('Employee') || roles.includes('Responsable') || roles.includes('Recruteur')) {
        const employeeProfile = await fetchEmployeeById(id, token);
        setRegistrationNumber(employeeProfile.username);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, [id, roles]);

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on mount
  }, [fetchUserProfile]);

  useEffect(() => {
    if (registrationNumber) {
      fetchVacationRequests();
      fetchVacationDays();
    }
  }, [fetchVacationRequests, fetchVacationDays, registrationNumber]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled');
      } else {
        throw err;
      }
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approveVacationRequest(id);
      fetchVacationRequests();
    } catch (error) {
      console.error('Failed to approve vacation:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      await rejectVacationRequest(id);
      fetchVacationRequests();
    } catch (error) {
      console.error('Failed to reject vacation:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await deleteVacationRequest(id);
      fetchVacationRequests();
    } catch (error) {
      console.error('Failed to delete vacation:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>Registration Number: {item.registrationNumber}</Text>
      <Text style={styles.requestText}>Period: {formatDateString(item.start_date)} to {formatDateString(item.end_date)}</Text>
      <Text style={styles.requestText}>Reason: {item.type_vacation || 'N/A'}</Text>
      <Text style={styles.requestText}>Status: {item.status || 'N/A'}</Text>
      {RoleGuard(['Administrateur', 'Responsable'], roles) && item.registrationNumber !== registrationNumber && (
        <View style={styles.actions}>
          {item.status === 'Pending' && (
            <>
              <TouchableOpacity onPress={() => handleApprove(item.id)} style={styles.approveButton}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReject(item.id)} style={styles.rejectButton}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => handleApprove(item.id)} style={styles.approveButton}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReject(item.id)} style={styles.rejectButton}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Request Holiday</Text>
      <Text style={styles.remainingDays}>Remaining Vacation Days: {remainingDays}</Text>
      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        value={registrationNumber}
        onChangeText={setRegistrationNumber}
        editable={false} // Make the input read-only
      />
      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        minDate={new Date()}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
        onDateChange={(date, type) => {
          if (type === 'END_DATE') {
            setEndDate(date);
          } else {
            setStartDate(date);
            setEndDate(null);
          }
        }}
        todayBackgroundColor="#7300e6"  // Set today's background color to purple from the start
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
      />
      <DropDownPicker
        open={openReasonDropdown}
        value={reason}
        items={[
          { label: 'Individual Training Vacation', value: 'individual training vacation' },
          { label: 'Annual Vacation', value: 'annual vacation' },
          { label: 'Parental Vacation', value: 'parental vacation' },
          { label: 'Sick Vacation', value: 'sick vacation' },
          { label: 'Without Pay Vacation', value: 'without pay vacation' }
        ]}
        setOpen={setOpenReasonDropdown}
        setValue={setReason}
        placeholder="Select an item"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
        zIndex={3000}
        zIndexInverse={1000}
      />
      {reason.toLowerCase() === 'sick vacation' && (
        <View>
          <TouchableOpacity style={styles.dateButton} onPress={handleFilePick}>
            <Text style={styles.dateButtonText}>Upload Medical Certificate</Text>
          </TouchableOpacity>
          {file && <Text>{file.name}</Text>}
        </View>
      )}
      <TouchableOpacity style={styles.submitButton} onPress={submitRequest}>
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Holiday Requests</Text>
    </View>
  );

  if (loading) {
    return (
      <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
        <View style={styles.loaderContainerData}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatListContent}
      />
      {alertMessage ? <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} /> : null}
      {actionLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  flatListContent: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  remainingDays: {
    fontSize: 16,
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  requestText: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  loaderContainerData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for loader
  },
  dropdownContainer: {
    marginBottom: 40,
    marginTop: 20,
    zIndex: 1000, // Ensure dropdown is above other components
  },
  dropdown: {
    marginBottom: 20,
  },
});

const mapStateToProps = state => ({
  roles: state.auth.roles,
  id: state.auth.id, // Assuming you have the user ID in your state
});

export default connect(mapStateToProps)(HolidaysScreen);
