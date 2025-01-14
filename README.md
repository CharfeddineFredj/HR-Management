# 🌟 HRM & Online Attendance Management



## 🚀 Project Description
This project is a web and mobile application for human resource management (HRM) and online attendance tracking. Developed as part of my final engineering project at Digital Identity, the application integrates Angular and Spring Boot for the frontend and backend, and React Native for mobile development. It follows a microservices architecture and applies the Scrum methodology to ensure efficient and collaborative development.

---

## 🎯 Main Features

### 🧑‍💻 Administrator
- 🔧 Manage and supervise the system's operations.
- 🛠️ Respond to user needs and ensure the system runs smoothly.

### 👤 HR Manager
- 🗂️ Manage users, work schedules, leave requests, payroll, and events.

### 👨‍💼 Employee
- 🕐 Use the app for online attendance tracking.
- 📅 Submit leave requests and view personal history.
- 🔔 Receive notifications and stay updated on events.

### 🧑‍💼 Recruiter
- 📄 Manage job applications and schedule interviews.

### 🧑‍🎓 Candidate
- 💼 Apply for job or internship opportunities.

---

## 🔧 Technologies Used

### Frontend
- 🖥️ Angular
- 🎨 Bootstrap

### Backend
- ⚙️ Spring Boot

### Mobile
- 📱 React Native

### Architecture
- 🔗 Microservices

### Methodology
- 📋 Scrum

---

## 🎯 Objective
The project aims to streamline HR management and attendance tracking while providing a seamless and user-friendly platform for all stakeholders.

---

## 🛠️ Installation and Setup

### 1️⃣ Install Dependencies

#### Frontend (Web)
Navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```

#### Backend
Navigate to the backend folder and install dependencies:
```bash
cd backend
./mvnw install
```

#### Mobile
Navigate to the mobile folder and install dependencies:
```bash
cd mobile
npm install
```

---

### 2️⃣ Configure Environments

#### Backend
Copy the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
Configure database settings in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hr_manager
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

#### Frontend
Configure the `environment.ts` file with the backend API settings:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

### 3️⃣ Prepare the Database
Run migrations:
```bash
./mvnw spring-boot:run
```
Populate data using seeders (if available).

---

### 4️⃣ Start the Project

#### Backend
Run the Spring Boot server:
```bash
./mvnw spring-boot:run
```

#### Frontend
Run the Angular development server:
```bash
cd frontend
ng serve
```

#### Mobile
Start the React Native application:
```bash
cd mobile
npx react-native run-android
```

---

## 6️⃣ Access the Application

### Frontend
Open your browser and go to:
```
http://localhost:4200
```

### Backend
The backend API is available at:
```
http://localhost:8080
```

### Mobile
Use an emulator or connected Android device to test the application.

---

## 🚀 Features to Test

- 🕐 Online attendance tracking and history.
- 📅 Submit and review leave requests.
- 🗂️ Manage user profiles and work schedules.
- 💼 Apply for job openings as a candidate.
- 🔔 Notifications for employees and administrators.

---

## 🖼️ Screenshots

### 📱 Mobile Interface - Authentication

![image](https://github.com/user-attachments/assets/40d3c715-e290-4532-9a54-ae15a76152b8)

### 🖥️ Web Interface - User Management

![image](https://github.com/user-attachments/assets/871f2e84-d215-4ea5-ad6c-ddaadcb9b776)


### 🖥️ Web Interface - Profile View

![image](https://github.com/user-attachments/assets/1f34ae99-b2d9-48c4-b3f6-8e916530f791)


### 🖥️ Web Interface - Work Schedules

![image](https://github.com/user-attachments/assets/37cdbffc-0de7-4b02-9653-5e950fcc3dd6)


### 📱 Mobile Interface - Manage Work Schedules

![image](https://github.com/user-attachments/assets/86150130-6848-405e-beb6-ffc3da638f75)
![image](https://github.com/user-attachments/assets/de04e9b7-3248-47ac-ae03-4f0c76ff04fe)


### 🖥️ Web Interface - Attendance Records

![image](https://github.com/user-attachments/assets/e5b09f40-3b92-4583-92d9-0d4a27587b2e)


### 📱 Mobile Interface - Record Attendance & Consult History

<div style="display: flex; gap: 20px;">
  <img src="https://github.com/user-attachments/assets/b6b1bedf-ab64-448c-a952-a9e8000722e8" alt="Image 1" width="300">
  <img src="https://github.com/user-attachments/assets/442c5a56-84e2-42cb-acb3-6c7f37fcbb40" alt="Image 2" width="300">
</div>


### 🖥️ Web Interface - Leave Requests
![image](https://github.com/user-attachments/assets/672a2a2e-3b45-4de5-80a3-3d73be59a2df)


### 🖥️ Web Interface - Job Applications
![image](https://github.com/user-attachments/assets/cb18ee67-8de7-4995-ad77-5c06283ebccb)


---
