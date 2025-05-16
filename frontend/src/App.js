import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import PatientRecord from "./pages/patientRecord";
import Appointment from "./pages/appointment";
import { ToastProvider } from "./component/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/patientRecord" element={<PatientRecord />} />
          <Route path="/appointment" element={<Appointment />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
