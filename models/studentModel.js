require("dotenv").config();

const mongoose = require("mongoose");
const generatePass = require("generate-password");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/mailService/email");

// Student Schema

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid Email",
      ],
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "Student",
    },
    age:{
      type: Number,
    },
    class: {
      type: String,
      required: [true, "Class is required"],
    },
    subjects: {
      type: Array,
    },
    parentContact: {
      type: Number,
      required: [true, "Parent contact number is required"],
    },
    studentContact: {
      type: Number,
      required: [true, "Student contact number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    room: {
      type: String,
    },
  },
  { timestamps: true }
);

// To auto-generate and save password

studentSchema.pre("save", async function () {
  // Generate a random password
  const pass = generatePass.generate({
    length: 8,
    numbers: true,
  });

  // Create a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(pass, salt);

  const user = {
    email: this.email,
    context: {
      userName: this.name,
      userEmail: this.email,
      role: this.role,
      userPassword: pass,
    },
  };

  // Send mail with Login Credentials
  await sendEmail(user);
});

/*                                        Callable Methods                 */

//                            Function to create Access Token

studentSchema.methods.createAccessToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

//                            Function to create Refresh Token

studentSchema.methods.createRefreshToken = async function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

//                            Function to compare password

studentSchema.methods.comparePassword = async function (pass) {
  const isMatch = await bcrypt.compare(pass, this.password);

  return isMatch;
};

// Student Model

module.exports = mongoose.model("Student", studentSchema);
