const { StatusCodes } = require("http-status-codes");

// Models
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const DataEntryOperator = require("../models/dataEntryOperatorModel");

const { CustomAPIError } = require("../errors/allErr");

/* -------------------------------------------------------------------------------------------------------- */

//                                   Function to Register new Student

const registerStudent = async (req, res) => {
  // Retrieve the data
  const {
    name,
    email,
    role,
    age,
    classYr,
    subjects,
    parentContact,
    studentContact,
    address,
    room,
  } = req.body;

  // Student object
  const studentData = {
    name,
    email,
    role,
    age,
    classYr,
    subjects,
    parentContact,
    studentContact,
    address,
    room,
  };

  // Create new Student
  const student = await Student.create(studentData);

  // Check if student created successfully
  if (!student) {
    throw new CustomAPIError("Server error try after sometime");
  }

  // Get the new student data
  const { __v, createdAt, updatedAt, password, ...newStudent } = student._doc;

  // Send the new student data
  res.status(StatusCodes.OK).json({
    acknowledged: true,
    msg: "Student created successfully",
    student: newStudent,
  });
};

//                                   Function to Register new Teacher

const registerTeacher = async (req, res) => {
  // Retrieve Data
  const {
    name,
    email,
    rooms,
    role,
    age,
    address,
    contact,
    qualification,
    subjects,
  } = req.body;

  // Teacher Object
  const teacherData = {
    name,
    email,
    rooms,
    role,
    age,
    address,
    contact,
    qualification,
    subjects,
  };

  // Create new Teacher
  const teacher = await Teacher.create(teacherData);

  // Check if teacher created successfully
  if (!teacher) {
    throw new CustomAPIError("Server error try after sometime");
  }

  // Get the new teacher data
  const { __v, createdAt, updatedAt, password, newTeacher } = teacher._doc;

  // Send the new teacher data
  res.status(StatusCodes.OK).json({
    acknowledged: true,
    msg: "Teacher created successfully",
    teacher: newTeacher,
  });
};

//                                   Function to Register new Data Entry Operator

const registerDataEntryOperator = async (req, res) => {
  // Retrieve Data
  const { name, email, role, age, contact, address } = req.body;

  // Data Entry Operator Object
  const dataEntryOperatorData = {
    name,
    email,
    role,
    age,
    contact,
    address,
  };

  // Create new Data Entry Operator
  const dataEntryOperator = await DataEntryOperator.create(
    dataEntryOperatorData
  );

  // Check if Data Entry Operator created successfully
  if (!dataEntryOperator) {
    throw new CustomAPIError("Server error try after sometime");
  }

  // Get the new Data Entry Operator data
  const { __v, createdAt, updatedAt, password, ...newDataEntryOperator } =
    dataEntryOperator._doc;

  // Send the new Data Entry Operator data
  res.status(StatusCodes.OK).json({
    acknowledged: true,
    msg: "Data Entry Operator created successfully",
    dataEntryOperator: newDataEntryOperator,
  });
};

// Export the Functionality

module.exports = {
  registerStudent,
  registerTeacher,
  registerDataEntryOperator,
};
