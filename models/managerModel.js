require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generatePass = require("generate-password");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailService/email");

// Manager Schema

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Manager Name is required"],
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
      default: "Manager",
    },
    age: {
      type: Number,
    },
    contact: {
        type: Number,
        required: [true, "Contact Number is required"]
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    }
  },
  { timestamps: true }
);

// To auto-generate and save password

managerSchema.pre("save", async function () {
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

managerSchema.methods.createAccessToken = async function () {
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

managerSchema.methods.createRefreshToken = async function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

//                            Function to compare password

managerSchema.methods.comparePassword = async function (pass) {
  const isMatch = await bcrypt.compare(pass, this.password);

  return isMatch;
};

// Export model

module.exports = mongoose.model("Manager", managerSchema);
