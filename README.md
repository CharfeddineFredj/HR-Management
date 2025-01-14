# 🌟 **HRM & Online Attendance Management**

---

## 🚀 **Project Description**
This project is a **web and mobile application** for **human resource management (HRM)** and **online attendance tracking**. Developed as part of my **final engineering project** at **Digital Identity**, the application integrates **Angular** and **Spring Boot** for the web frontend and backend, and **React Native** for mobile development.  
The project employs a **microservices architecture** and follows the **Scrum methodology** to ensure efficient and collaborative development.

---

## 🎯 **Main Features**

### 🧑‍💻 **Administrator**
- 🔧 Manage and supervise the system's operations.
- 🛠️ Respond to user needs and ensure smooth system functionality.

### 👤 **HR Manager**
- 🗂️ Manage users, work schedules, leave requests, payroll, and events.

### 👨‍💼 **Employee**
- 🕐 Track attendance online.
- 📅 Submit leave requests and view personal history.
- 🔔 Receive notifications and updates on events.

### 🧑‍💼 **Recruiter**
- 📄 Manage job applications and schedule interviews.

### 🧑‍🎓 **Candidate**
- 💼 Apply for jobs or internships.

---

## 🔧 **Technologies Used**
- **Frontend**: 🖥️ Angular, 🎨 Bootstrap  
- **Backend**: ⚙️ Spring Boot  
- **Mobile**: 📱 React Native  
- **Architecture**: 🔗 Microservices  
- **Methodology**: 📋 Scrum  

---

## 🎯 **Objective**
The project aims to **streamline HR management** and **attendance tracking** while providing a seamless and user-friendly platform for all stakeholders.

---

## 📂 **How to Set Up the Project**

### 1️⃣ **Install Dependencies**

#### **Frontend (Web)**  
Navigate to the `frontend` folder and install dependencies:
```bash
cd frontend
npm install
```

#### **Backend**  
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
./mvnw install
```

#### **Mobile**  
Navigate to the `mobile` folder and install dependencies:
```bash
cd mobile
npm install
```

---

### 2️⃣ **Configure Environments**

#### **Backend**
- Copy the `.env.example` file and rename it to `.env`:  
  ```bash
  cp .env.example .env
  ```
- Configure database settings in the `.env` file:
  ```env
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=hr_manager
  DB_USERNAME=root
  DB_PASSWORD=yourpassword
  ```

#### **Frontend**
- Update `environment.ts` with backend API settings:
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api'
  };
  ```

---

### 3️⃣ **Prepare the Database**
- Run migrations:
  ```bash
  ./mvnw spring-boot:run
  ```
- (Optional) Populate data using seeders if available.

---

### 4️⃣ **Start the Project**

#### **Backend**
Run the Spring Boot server:
```bash
./mvnw spring-boot:run
```

#### **Frontend**
Run the Angular development server:
```bash
cd frontend
ng serve
```

#### **Mobile**
Start the React Native application:
```bash
cd mobile
npx react-native run-android
```

---

### 5️⃣ **Access the Application**
- **Frontend**: [http://localhost:4200](http://localhost:4200)  
- **Backend API**: [http://localhost:8080](http://localhost:8080)  
- **Mobile**: Use an emulator or connected Android device.

---

## 🚀 **Features to Test**
- 🕐 Online attendance tracking and history.  
- 📅 Submit and review leave requests.  
- 🗂️ Manage user profiles and work schedules.  
- 💼 Apply for job openings as a candidate.  
- 🔔 Notifications for employees and administrators.

---

## 🖼️ **Screenshots**

### 📱 Mobile Interface
- **Authentication**  
  ![Mobile Authentication](https://github.com/user-attachments/assets/placeholder-mobile-authentication)  

### 🖥️ Web Interface
- **User Management**  
  ![User Management](https://github.com/user-attachments/assets/placeholder-user-management)  
- **Profile View**  
  ![Profile View](https://github.com/user-attachments/assets/placeholder-profile-view)  
- **Work Schedules**  
  ![Work Schedules](https://github.com/user-attachments/assets/placeholder-work-schedules)  
- **Attendance Records**  
  ![Attendance Records](https://github.com/user-attachments/assets/placeholder-attendance-records)  
- **Leave Requests**  
  ![Leave Requests](https://github.com/user-attachments/assets/placeholder-leave-requests)  
- **Job Applications**  
  ![Job Applications](https://github.com/user-attachments/assets/placeholder-job-applications)  

---

## 🤝 **Contributors**
- **[Charfeddine FREDJ](https://github.com/CharfeddineFredj)**  

---

## 📄 **License**
This project is licensed under the **MIT License**.
