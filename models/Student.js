const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  course: {
    type: String,
    required: [true, 'Course is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);