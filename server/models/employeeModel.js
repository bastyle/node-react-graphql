const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Employee', employeeSchema)
