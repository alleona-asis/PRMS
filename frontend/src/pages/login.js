import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";


const clientId =
  "494783153713-1933fqacbn1btnacongjkmkj2gfm1uu8.apps.googleusercontent.com";


const Login = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);


  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId: clientId,
          scope: "https://www.googleapis.com/auth/classroom.courses.readonly",
        });
      });
    };
    initClient();


    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";


    setTimeout(() => setFadeIn(true), 100);


    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);


  const handleGoogleLogin = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then((googleUser) => {
      const token = googleUser.getAuthResponse().access_token;


      fetch(`${process.env.REACT_APP_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("token", token);
          navigate("/patientRecord");
        })
        .catch((error) => console.error("Error:", error));
    });
  };



  const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #ffffff, #e0f7fa)",
        fontFamily: "Segoe UI, sans-serif",
    },
    card: {
        backgroundColor: "#fff",
        padding: "40px 30px",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%",
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? "translateY(0px)" : "translateY(20px)",
        transition: "all 0.8s ease-in-out",
    },
    logo: {
        width: "180px",
        height: "auto",
        marginBottom: "10px",
    },
    title: {
        color: "#0077cc",
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "30px",
    },
    button: {
        backgroundColor: "#0077cc",
        color: "#ffffff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Patient Record Management System</h2>


        {/* Google sign-in button */}
        <button
          onClick={handleGoogleLogin}
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#005fa3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0077cc")}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};


export default Login;
