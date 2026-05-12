const Student = require('../models/Student');


const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.status(201).json({ message: 'Student created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllStudents =  (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ message: 'Students fetched successfully', count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student fetched successfully', data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};