const express = require("express");
const router = express.Router();
const Patient = require("../../models/modelPatient");

// POST: Add new patient
router.post("/", async (req, res) => {
    const { firstName, lastName, dob, gender, age, condition, dateAdmitted, address, status, email } = req.body;
    const patientId = String(Date.now()).slice(-5);

    try {
      const newPatient = new Patient({
        firstName,
        lastName,
        dob,
        gender,
        age,
        condition,
        dateAdmitted,
        address,
        status,
        email,
      });
  
      await newPatient.save();
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ error: 'Error creating patient' });
    }
});

// GET: Get all patients
router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching patients' });
    }
});

// DELETE: Delete a patient by ID
router.delete("/:id", async (req, res) => {
    try {
        const result = await Patient.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting patient", error });
    }
});

// PUT: Update a patient by ID
router.put("/:id", async (req, res) => {
  const { firstName, lastName, dob, gender, age, condition, dateAdmitted, address, status, email } = req.body;

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        dob,
        gender,
        age,
        condition,
        dateAdmitted,
        address,
        status,
        email,
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error });
  }
});

module.exports = router;
