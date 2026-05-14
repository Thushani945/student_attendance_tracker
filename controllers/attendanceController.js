const Attendance = require('../models/Attendance');
const Student = require('../models/Student');


const markAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.body.student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = new Attendance(req.body);
    const saved = await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', data: saved });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate('student', 'name studentId course');
    res.status(200).json({ message: 'Attendance records fetched', count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAttendanceByStudent = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId }).populate('student', 'name studentId course');
    if (records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this student' });
    }
    res.status(200).json({ message: 'Attendance fetched successfully', count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance updated successfully', data: record });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance
};