/* eslint-disable prettier/prettier */
// apiService.js
import axios from 'axios';
import { getToken, clearToken } from './asyncStorage';
import Config from 'react-native-config';

const baseURL = Config.API_BASE_URL; // Replace with your backend URL

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseURL}/api/auth/signin`, credentials, { timeout: 5000 });
    return response; // Instead of returning just the token, return the entire response
  } catch (error) {
    throw new Error('Login failed'); // You can handle errors more specifically if needed
  }
};

axios.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


// Function to fetch Admin profile
export const fetchAdminById = async (id, token) => {
  try {
    console.log(`Fetching admin with ID: ${id} using token: ${token}`);
    const response = await axios.get(`${baseURL}/administrateur/getone/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure the token is passed correctly
      },
    });
    console.log('Fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee:', error.response ? error.response.data : error);
    throw error;
  }
};

// Function to fetch Employee profile
export const fetchEmployeeById = async (id, token) => {
  try {
    console.log(`Fetching employee with ID: ${id} using token: ${token}`);
    const response = await axios.get(`${baseURL}/employee/getone/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure the token is passed correctly
      },
    });
    console.log('Fetch successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee:', error.response ? error.response.data : error);
    throw error;
  }
};


export const logout = async () => {
  try {
    const token = await getToken();
    if (token) {
      await axios.post(`${baseURL}/api/auth/signout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await clearToken(); // Use the clearToken function
    }
  } catch (error) {
    console.error('Logout failed:', error.response ? error.response.data : error);
    throw error;
  }
};

// Function to fetch User profile
export const fetchAllUsers = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const fetchUserById = async (id, roles) => {
  try {
    const token = await getToken();
    let response;

    if (roles.includes('Administrateur')) {
      response = await fetchAdminById(id, token);
    } else if (roles.includes('Employee') || roles.includes('Responsable') || roles.includes('Recruteur')) {
      response = await fetchEmployeeById(id, token);
    } else {
      throw new Error('No valid role found for fetching user data');
    }

    return response;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};


// Function to change password
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${baseURL}/users/changepassword`, {
      userId,
      currentPassword,
      newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Function to handle check-in
export const checkIn = async (username, checkInTime, latitude, longitude) => {
  try {
    const token = await getToken();
    const response = await axios.put(`${baseURL}/pointing/checkIn`, {
      username,
      checkInTime,
      latitude,
      longitude,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle check-out
export const checkOut = async (username, checkOutTime, latitude, longitude) => {
  try {
    const token = await getToken();
    const response = await axios.put(`${baseURL}/pointing/checkOut`, {
      username,
      checkOutTime,
      latitude,
      longitude,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to fetch pointage history
export const fetchPointageHistoryByUserId = async (userId) => {
  const token = await getToken();
  console.log('Fetched token:', token); // Log token for debugging
  const response = await axios.get(`${baseURL}/pointing/history/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to fetch pointage by id
// export const fetchPointageById = async (id) => {
//   const token = await getToken();
//   const response = await axios.get(`${baseURL}/pointing/getone/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// Function to fetch CheckIn Details
export const fetchCheckInDetails = async (username) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/pointing/checkInDetails`, {
      params: { username },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle case when no check-in data is found
      return null;
    }
    throw error;
  }
};

// Function to fetch CheckOut Details
export const fetchCheckOutDetails = async (username) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/pointing/checkOutDetails`, {
      params: { username },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle case when no check-out data is found
      return null;
    }
    throw error;
  }
};

// Function to fetch all pointages
export const fetchAllPointages = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/pointing/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 204)) {
      // Handle case when no data is found or no content
      return [];
    }
    console.error('Error fetching all pointages:', error);
    throw error;
  }
};

// Function to create a work schedule
export const createWorkSchedule = async (workSchedule) => {
  try {
    const response = await axios.post(`${baseURL}/workschedule/add`, workSchedule);
    return response.data;
  } catch (error) {
    console.error('Error creating work schedule:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to fetch all work schedules
export const fetchAllWorkSchedules = async () => {
  try {
    const response = await axios.get(`${baseURL}/workschedule/all`);
    // Transform the workDays to strings
    // const schedules = response.data.map(schedule => ({
    //   ...schedule,
    //   workDays: schedule.workDays.map(workDay => workDay.dayOfWeek) // Adjust workDays
    // }));
    // return schedules;
    return response.data;
  } catch (error) {
    console.error('Error fetching all work schedules:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to fetch a work schedule by ID
export const fetchWorkScheduleById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/workschedule/getone/${id}`);
    // const schedule = response.data;
    // return {
    //   ...schedule,
    //   workDays: schedule.workDays.map(day => day.dayOfWeek) // Transform workDays to strings
    // };
    return response.data;
  } catch (error) {
    console.error('Error fetching work schedule by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to fetch work schedules by username Old One

// export const fetchWorkSchedulesByUsername = async (username) => {
//   try {
//     const response = await axios.get(`${baseURL}/workschedule/${username}`);
//     const schedule = response.data;
//     return {
//       ...schedule,
//       workDays: schedule.workDays.map(day => day.dayOfWeek) // Transform workDays to strings
//     };
//   } catch (error) {
//     console.error('Error fetching work schedules by username:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// Function to fetch work schedules by username New One
export const fetchWorkSchedulesByUsername = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/workschedule/${username}`);
    // const schedules = response.data.map(schedule => ({
    //   ...schedule,
    //   workDays: schedule.workDays ? schedule.workDays.map(day => day.dayOfWeek) : [] // Ensure workDays is an array
    // }));
    // return schedules;
    return response.data;
  } catch (error) {
    console.error('Error fetching work schedules by username:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to update a work schedule
export const updateWorkSchedule = async (id, workSchedule) => {
  try {
    const response = await axios.put(`${baseURL}/workschedule/edit/${id}`, workSchedule);
    return response.data;
  } catch (error) {
    console.error('Error updating work schedule:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to delete a work schedule
export const deleteWorkSchedule = async (id) => {
  try {
    const response = await axios.delete(`${baseURL}/workschedule/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting work schedule:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function forgetPassword
export const forgetPassword = async (email) => {
  try {
    const response = await axios.post(`${baseURL}/users/forgetpassword`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error sending reset password link.');
  }
};

// Function to check if email exists
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`${baseURL}/employee/exists/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw error;
  }
};

// Function resetPassword
export const resetPassword = async (verificationCode, newPassword) => {
  try {
    const response = await axios.post(`${baseURL}/users/resetpassword`, { verificationCode, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid verification code\n Please check your email and enter the valid code.');
  }
};

// Function to fetch all vacations
export const fetchVacationsByUser = async () => {
  const token = await getToken();
  console.log('Token:', token);

  const url = `${baseURL}/vactions/all`;

  console.log('Fetching URL:', url);

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to fetch vacations specifically for employees
export const fetchEmployeeVacation = async (registrationNumber) => {
  const token = await getToken();
  console.log('Token:', token);

  const url = `${baseURL}/vactions/${registrationNumber}`;

  console.log('Fetching URL:', url);

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// Function to create vacation request
export const createVacationRequest = async (vacationRequest) => {
  const token = await getToken();
  const formData = new FormData();

  formData.append('registrationNumber', vacationRequest.registrationNumber);
  formData.append('created_at', vacationRequest.created_at.toISOString());
  formData.append('period', vacationRequest.period);
  formData.append('start_date', vacationRequest.startDate.toISOString().split('T')[0]);
  formData.append('end_date', vacationRequest.endDate.toISOString().split('T')[0]);
  formData.append('type_vacation', vacationRequest.reason);
  if (vacationRequest.file && vacationRequest.reason.toLowerCase() === 'sick vacation') {
    formData.append('file', {
      uri: vacationRequest.file.uri,
      type: vacationRequest.file.type,
      name: vacationRequest.file.name,
    });
  }

  const response = await axios.post(`${baseURL}/vactions/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Function to approve vacation
export const approveVacationRequest = async (id) => {
  const token = await getToken();
  const response = await axios.put(`${baseURL}/vactions/${id}/approve`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to reject vacation
export const rejectVacationRequest = async (id) => {
  const token = await getToken();
  const response = await axios.put(`${baseURL}/vactions/${id}/reject`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Function to delete vacation
export const deleteVacationRequest = async (id) => {
  const token = await getToken();
  await axios.delete(`${baseURL}/vactions/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to get vacation days
export const getVacationDays = async (registrationNumber, year) => {
  const token = await getToken();
  const response = await axios.get(`${baseURL}/vactions/vacation-days`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      registrationNumber,
      year,
    },
  });
  return response.data;
};

// Function to get vacation years
export const getAvailableYears = async () => {
  const token = await getToken();
  const response = await axios.get(`${baseURL}/vactions/available-years`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
