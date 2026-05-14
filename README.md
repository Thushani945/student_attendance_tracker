# Student Attendance Tracker API

## Problem
Managing student attendance manually is slow and error-prone.

## Solution
A REST API that allows staff to record, view, update
and delete student attendance digitally.

## Technologies
- Node.js + Express.js
- MongoDB + Mongoose
- Postman for testing

## API Endpoints
POST   /api/students       - Add a student
GET    /api/students       - Get all students
GET    /api/students/:id   - Get one student
PUT    /api/students/:id   - Update student
DELETE /api/students/:id   - Delete student

POST   /api/attendance     - Record attendance
GET    /api/attendance     - Get all records
PUT    /api/attendance/:id - Update record
DELETE /api/attendance/:id - Delete record

## How to Run
1. npm install
2. Create .env with your MONGO_URI
3. npm run dev