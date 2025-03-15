# Automated Event Management System

## 📌 Overview
The **Automated Event Management System** is a web application that simplifies event organization, registration, and check-in processes. Built using **React.js, Tailwind CSS, and MongoDB**, the system allows users to register for events, receive QR-coded tickets, and check in seamlessly.

## 🚀 Features
### 🎟️ User Features
- **User Registration & Login**: Secure authentication system.
- **Event Browsing**: View and explore upcoming events.
- **Event Registration**: Users can register for events and receive a unique **QR code ticket**.
- **Ticket Management**: View, download, and print event tickets.

### 🎤 Organizer Features
- **Organizer Login**: Event organizers can manage their events.
- **Create & Manage Events**: Add, update, or delete events.
- **Participant List Management**: View and manage registered participants.
- **QR Code Check-in**: Scan participant QR codes for seamless event entry.

### 🛠️ Admin Features
- **Admin Dashboard**: View and manage all events and registrations.
- **Event Moderation**: Approve, update, or remove events.
- **User Management**: Monitor and manage users.

## 🏗️ Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **QR Code Generation**: qrcode.react

## 💻 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/event-management-system.git
cd event-management-system
```

### 2️⃣ Install Dependencies
#### Backend (Express.js)
```sh
cd backend
npm install
```
#### Frontend (React.js)
```sh
cd frontend
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the backend directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Application
#### Run Backend Server
```sh
cd backend
npm start
```
#### Run Frontend
```sh
cd frontend
npm run dev
```

## 🔍 Folder Structure
```
/event-management-system
 ├── backend/          # Node.js & Express backend
 │   ├── models/       # Mongoose models
 │   ├── routes/       # API routes
 │   ├── controllers/  # Route handlers
 │   ├── middleware/   # Authentication & validation middleware
 │   ├── server.js     # Main server file
 │   └── config/       # Database connection & environment variables
 │
 ├── frontend/         # React.js frontend
 │   ├── src/          # Main source folder
 │   │   ├── components/  # Reusable UI components
 │   │   ├── pages/       # Page components (Dashboard, Events, etc.)
 │   │   ├── context/     # Global state management
 │   │   ├── assets/      # Static images, icons, etc.
 │   │   ├── App.js       # Main App component
 │   │   ├── index.js     # React entry point
 │   ├── public/         # Public assets
 │
 ├── README.md         # Project documentation
 ├── package.json      # Project dependencies
 ├── .gitignore        # Ignored files for Git
```


## 🤝 Contributing
Contributions are welcome! Please submit a pull request or open an issue.


