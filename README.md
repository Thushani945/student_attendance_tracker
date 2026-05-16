# Attendance Tracker System

## Project Overview

The Attendance Tracker System is a full-stack web application developed using Node.js, Express.js, and MongoDB.  

The system allows users to manage student records and attendance records through RESTful APIs.  

This project demonstrates CRUD operations, MongoDB integration, API development, and API testing using Postman.

---

# Technologies Used

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## API Testing
- Postman

## Frontend (Optional Bonus)
- React.js
- Axios
- CSS

---

# Features

## Student Management
- Add new students
- View all students
- Update student details
- Delete students

## Attendance Management
- Mark attendance
- View attendance records
- Update attendance
- Delete attendance records

---

# Project Structure

attendance-tracker/
│
├── models/
├── routes/
├── controllers/
├── public/ or frontend/
├── screenshots/
├── server.js
├── package.json
├── .env
└── README.md

---

# Installation Guide

## Step 1: Clone or Download the Project

Download the ZIP file and extract it.

OR

git clone <repository-link>

---

# Step 2: Open Project Folder

Open terminal inside the project folder.

Example:

cd attendance-tracker

---

# Step 3: Install Dependencies

Run:

npm install

This installs all required packages.

---

# Step 4: Configure Environment Variables

Create a .env file in the root folder.

Add:

PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_tracker

---

# Step 5: Start MongoDB

Make sure MongoDB is running on your system.

---

# Step 6: Run the Server

Run:

npm start

OR

npm run dev

If successful:

MongoDB Connected
Server running on port 5000

---

# API Endpoints

## Student APIs

### Create Student
POST /api/students

### Get All Students
GET /api/students

### Get Single Student
GET /api/students/:id

### Update Student
PUT /api/students/:id

### Delete Student
DELETE /api/students/:id

---

## Attendance APIs

### Create Attendance
POST /api/attendance

### Get All Attendance
GET /api/attendance

### Get Attendance by Student
GET /api/attendance/student/:studentId

### Update Attendance
PUT /api/attendance/:id

### Delete Attendance
DELETE /api/attendance/:id

---

# Example JSON Data

## Student Example

{
  "name": "John Doe",
  "studentId": "ST001",
  "email": "john@example.com",
  "course": "IT",
  "year": 2
}

---

## Attendance Example

{
  "student": "STUDENT_OBJECT_ID",
  "date": "2026-05-16",
  "status": "present",
  "subject": "Maths",
  "remarks": "On time"
}

---

# API Testing using Postman

All API endpoints were tested using Postman.

CRUD operations tested:
- Create
- Read
- Update
- Delete

Postman Collection:
- Included in project submission

Screenshots:
- Included in screenshots folder

---

# Frontend Development (Bonus)

A frontend interface was developed using React.js.

Features:
- Connect frontend with backend APIs
- Perform CRUD operations
- User-friendly interface
- Axios used for API requests

AI-assisted development was used following the Vibe Coding approach.

---

# Future Improvements

- User authentication
- Admin dashboard
- Attendance analytics
- Search and filtering
- Responsive mobile design

---

# Author

Name: Your Name  
Course: Your Course  
Module: Web Services and Server Technologies

---

# Conclusion

This project successfully demonstrates:
- RESTful API development
- MongoDB database integration
- CRUD functionality
- API testing with Postman
- Optional frontend integration using React.js
