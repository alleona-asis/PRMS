import React, { useEffect } from "react";

export default function Notification({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
    warning: "#ff9800",
  }[type];

  const style = {
    position: "fixed",
    top: "16%", // Center vertically
    left: "50%", // Center horizontally
    transform: "translate(-50%, -50%)", // Correct position to truly center
    backgroundColor: bgColor,
    color: "#fff",
    padding: "16px 24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 1000,
    fontSize: "16px",
    transition: "all 0.3s ease-in-out",
  };
  

  return (
    <div style={style}>
      {message}
    </div>
  );
}
