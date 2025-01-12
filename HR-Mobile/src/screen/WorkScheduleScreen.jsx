/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, FlatList, Switch } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createWorkSchedule, updateWorkSchedule, deleteWorkSchedule, fetchAllWorkSchedules, fetchAllUsers } from '../config/apiService';
import CustomAlert from '../components/CustomAlert';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const backgroundImg = require('../assets/images/background.jpg');

const WorkScheduleSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    scheduledCheckInTime: Yup.date().required('Scheduled Check-In Time is required'),
    scheduledCheckOutTime: Yup.date().required('Scheduled Check-Out Time is required'),
    workDays: Yup.array().of(
        Yup.object().shape({
            day: Yup.string().required(),
            declared: Yup.boolean().required()
        })
    ).min(1, 'Select at least one workday').required('Workdays are required'),
});

const WorkScheduleScreen = () => {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Loader for form submission
    const [workSchedules, setWorkSchedules] = useState([]);
    const [users, setUsers] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [openUserDropdown, setOpenUserDropdown] = useState(false);
    const [userDropdownValue, setUserDropdownValue] = useState(null);
    const [userDropdownItems, setUserDropdownItems] = useState([]);
    const [openWorkDaysDropdown, setOpenWorkDaysDropdown] = useState(false);
    const [workDaysValue, setWorkDaysValue] = useState([]);
    const [workDaysItems, setWorkDaysItems] = useState([
        { label: 'Monday', value: 'MONDAY' },
        { label: 'Tuesday', value: 'TUESDAY' },
        { label: 'Wednesday', value: 'WEDNESDAY' },
        { label: 'Thursday', value: 'THURSDAY' },
        { label: 'Friday', value: 'FRIDAY' },
        { label: 'Saturday', value: 'SATURDAY' },
        { label: 'Sunday', value: 'SUNDAY' },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateTimeField, setDateTimeField] = useState('');
    const [dateTimeValue, setDateTimeValue] = useState(new Date());
    const formikRef = useRef(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const schedules = await fetchAllWorkSchedules();
                setWorkSchedules(schedules);

                const usersData = await fetchAllUsers();
                setUsers(usersData);
                setUserDropdownItems(usersData.map(user => ({ label: `${user.firstname} ${user.lastname}`, value: user.username })));
            } catch (error) {
                console.error('Failed to load initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleCreateOrUpdateSchedule = async (values) => {
        setActionLoading(true); // Start action loader
        try {
            const workSchedule = {
                username: values.username,
                scheduledCheckInTime: values.scheduledCheckInTime.toLocaleTimeString('en-US', { hour12: false }),
                scheduledCheckOutTime: values.scheduledCheckOutTime.toLocaleTimeString('en-US', { hour12: false }),
                workDays: values.workDays.map(day => ({
                    dayOfWeek: day.day,
                    declared: day.declared
                }))
            };

            if (selectedScheduleId) {
                await updateWorkSchedule(selectedScheduleId, workSchedule);
                setAlertMessage('Work schedule updated successfully!');
            } else {
                await createWorkSchedule(workSchedule);
                setAlertMessage('Work schedule created successfully!');
            }
            setAlertVisible(true);
            setWorkSchedules(await fetchAllWorkSchedules());
            setSelectedScheduleId(null);
            formikRef.current.resetForm();
            setUserDropdownValue(null);
            setWorkDaysValue([]);
        } catch (error) {
            console.error('Failed to create or update work schedule:', error);
            setAlertMessage('Failed to create or update work schedule.');
            setAlertVisible(true);
        } finally {
            setActionLoading(false); // End action loader
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        setActionLoading(true); // Start action loader
        try {
            await deleteWorkSchedule(scheduleId);
            setWorkSchedules((prevSchedules) => prevSchedules.filter(schedule => schedule.id !== scheduleId));
            setAlertMessage('Work schedule deleted successfully!');
            setAlertVisible(true);
        } catch (error) {
            console.error('Failed to delete work schedule:', error);
            setAlertMessage('Failed to delete work schedule.');
            setAlertVisible(true);
        } finally {
            setActionLoading(false); // End action loader
        }
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    const handleDateTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateTimeValue;
        setShowDatePicker(false);
        setDateTimeValue(currentDate);
        formikRef.current.setFieldValue(dateTimeField, currentDate);
    };

    if (loading) {
        return (
            <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
                <View style={styles.InitialloaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </ImageBackground>
        );
    }

    const populateForm = (schedule) => {
        setSelectedScheduleId(schedule.id);
        formikRef.current.setFieldValue('username', schedule.user.username);

        const checkInTimeParts = schedule.scheduledCheckInTime.split(':');
        const checkInTime = new Date();
        checkInTime.setHours(parseInt(checkInTimeParts[0], 10));
        checkInTime.setMinutes(parseInt(checkInTimeParts[1], 10));
        checkInTime.setSeconds(parseInt(checkInTimeParts[2], 10));
        formikRef.current.setFieldValue('scheduledCheckInTime', checkInTime);

        const checkOutTimeParts = schedule.scheduledCheckOutTime.split(':');
        const checkOutTime = new Date();
        checkOutTime.setHours(parseInt(checkOutTimeParts[0], 10));
        checkOutTime.setMinutes(parseInt(checkOutTimeParts[1], 10));
        checkOutTime.setSeconds(parseInt(checkOutTimeParts[2], 10));
        formikRef.current.setFieldValue('scheduledCheckOutTime', checkOutTime);

        setUserDropdownValue(schedule.user.username);
        const mappedWorkDays = schedule.workDays.map(day => ({ day: day.dayOfWeek, declared: day.declared }));
        setWorkDaysValue(mappedWorkDays);
        formikRef.current.setFieldValue('workDays', mappedWorkDays);
    };

    return (
        <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
            {actionLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            <View style={styles.container}>
                <Formik
                    initialValues={{ username: '', scheduledCheckInTime: new Date(), scheduledCheckOutTime: new Date(), workDays: [] }}
                    validationSchema={WorkScheduleSchema}
                    onSubmit={(values) => handleCreateOrUpdateSchedule(values)}
                    innerRef={formikRef}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>
                            <Text style={styles.title}>Set Work Schedule</Text>
                            <DropDownPicker
                                open={openUserDropdown}
                                value={userDropdownValue}
                                items={userDropdownItems}
                                setOpen={setOpenUserDropdown}
                                setValue={(val) => {
                                    setFieldValue('username', val());
                                    setUserDropdownValue(val());
                                }}
                                setItems={setUserDropdownItems}
                                placeholder="Select a user"
                                style={styles.dropdown}
                                zIndex={3000}
                                zIndexInverse={1000}
                            />
                            {errors.username && touched.username ? (
                                <Text style={styles.errorText}>{errors.username}</Text>
                            ) : null}
                            <DropDownPicker
                                open={openWorkDaysDropdown}
                                value={workDaysValue.map(day => day.day)}
                                items={workDaysItems}
                                setOpen={setOpenWorkDaysDropdown}
                                setValue={(callback) => {
                                    setWorkDaysValue((currentValue) => {
                                        const selectedDays = callback(currentValue.map(day => day.day));
                                        const updatedWorkDays = selectedDays.map(day => {
                                            const existingDay = currentValue.find(workDay => workDay.day === day);
                                            return existingDay || { day, declared: false };
                                        });
                                        formikRef.current.setFieldValue('workDays', updatedWorkDays);
                                        return updatedWorkDays;
                                    });
                                }}
                                setItems={setWorkDaysItems}
                                multiple={true}
                                mode="BADGE"
                                placeholder="Select workdays"
                                style={styles.dropdown}
                                zIndex={2000}
                                zIndexInverse={1000}
                            />
                            {errors.workDays && touched.workDays ? (
                                <Text style={styles.errorText}>{errors.workDays}</Text>
                            ) : null}
                            {values.workDays.map((workDay, index) => (
                                <View key={index} style={styles.workDayContainer}>
                                    <Text style={styles.workDayText}>{workDay.day}</Text>
                                    <Text>Overtime Declaration:</Text>
                                    <Switch
                                        value={workDay.declared}
                                        onValueChange={(val) => {
                                            const updatedWorkDays = [...values.workDays];
                                            updatedWorkDays[index].declared = val;
                                            setFieldValue('workDays', updatedWorkDays);
                                        }}
                                    />
                                </View>
                            ))}
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => {
                                    setDateTimeField('scheduledCheckInTime');
                                    setShowDatePicker(true);
                                }}
                            >
                                <Text>{values.scheduledCheckInTime.toLocaleString()}</Text>
                            </TouchableOpacity>
                            {errors.scheduledCheckInTime && touched.scheduledCheckInTime ? (
                                <Text style={styles.errorText}>{errors.scheduledCheckInTime}</Text>
                            ) : null}
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => {
                                    setDateTimeField('scheduledCheckOutTime');
                                    setShowDatePicker(true);
                                }}
                            >
                                <Text>{values.scheduledCheckOutTime.toLocaleString()}</Text>
                            </TouchableOpacity>
                            {errors.scheduledCheckOutTime && touched.scheduledCheckOutTime ? (
                                <Text style={styles.errorText}>{errors.scheduledCheckOutTime}</Text>
                            ) : null}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dateTimeValue}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={handleDateTimeChange}
                                />
                            )}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>{selectedScheduleId ? 'Update Schedule' : 'Create Schedule'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                <Text style={styles.title}>Work Schedules</Text>
                <FlatList
                    data={workSchedules}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.scheduleItem}>
                            <Text>Username: {item.user?.username || 'N/A'}</Text>
                            <Text>Name: {item.user?.firstname} {item.user?.lastname}</Text>
                            <Text>Check-In: {item.scheduledCheckInTime}</Text>
                            <Text>Check-Out: {item.scheduledCheckOutTime}</Text>
                            <Text>Work Days: {item.workDays.map(day => `${day.dayOfWeek} (Declared: ${day.declared})`).join(', ')}</Text>
                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={() => populateForm(item)}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteSchedule(item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <CustomAlert
                isVisible={alertVisible}
                message={alertMessage}
                onClose={closeAlert}
            />
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    InitialloaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for initial loader
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#343a40',
        textAlign: 'center',
    },
    dropdown: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 40,
    },
    updateButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scheduleItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ced4da',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginTop: -15,
        marginBottom: 15,
        marginLeft: 3,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for action loader
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    workDayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    workDayText: {
        fontSize: 16,
        marginRight: 10,
    },
});

export default WorkScheduleScreen;
