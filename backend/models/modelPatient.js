const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        default: () => {
            const id = Math.floor(10000 + Math.random() * 90000);
            return `PID-${id.toString().padStart(5, '0')}`;
        },
        unique: true,
    },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  dateAdmitted: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
