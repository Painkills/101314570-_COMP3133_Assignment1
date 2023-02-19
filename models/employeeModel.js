const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please enter the employee\'s first name'],
    trim: true
  },
  lastname: {
    type: String,
    required:  [true, 'Please enter the employee\'s last name'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, "That email has already been assigned to another employee"],
    trim: true,
    lowercase: true,
    validate: function(value) {
      var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailRegex.test(value);
    }
  },
  gender: {
    type: String,
    required: [true, "Please select from: 'Male', 'Female', or 'Other'"],
    enum: ['male', 'female', 'other'],
    trim: true,
    lowercase: true
  },
  salary: {
    type: Number,
    default: 0.0,
    validate(value) {
      if (value < 0.0){
         throw new Error("Please actually pay this employee. Hopefully a decent wage.");
      }
    }
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);