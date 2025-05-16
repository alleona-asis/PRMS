import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import maintenance from "../assets/maintenance.png";

export default function Appointment() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const location = useLocation();
    const currentPath = location.pathname;
    
    const isActive = (path) => currentPath === path;
    
    const getNavItemStyle = (path) => ({
      backgroundColor: isActive(path) ? "#E6F2FF" : "transparent",
      color: isActive(path) ? "#007bff" : "#333",
      borderRadius: "5px",
      fontWeight: isActive(path) ? "600" : "normal",
      display: "flex",
      alignItems: "center",
      padding: "20px 25px",
      gap: "10px",
      cursor: "pointer",
      marginBottom: "15px",
      fontSize: "20px"
    });
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetchData();
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(interval); // clean up
    }, []);

    const fetchData = async () => {
        try {

            const msgRes = await fetch("https://prms-test.onrender.com/api/hello");
            const msgData = await msgRes.json();
            setMsg(msgData.message);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={styles.pageWrapper}>
        <style>
            {`
            html, body {
                overflow: hidden;
            }

            /* Optional: make sure mainContent keeps scrollbars */
            .mainContent::-webkit-scrollbar {
                width: 8px;
            }
            .mainContent::-webkit-scrollbar-thumb {
                background-color: #999;
                border-radius: 4px;
            }
            `}
        </style>

            {/* Top Nav */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <img src={logo} alt="Logo" style={styles.logoImage} />
                </div>
                <div style={styles.navRight}>
                    <span>Day <strong>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong></span>
                    <span>Time <strong>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                </div>
            </nav>
    
            <div style={styles.appContainer}>

                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <div>
                        <div style={styles.profileCard}>
                        <div style={styles.profilePic}></div>
                        <h3 style={{ margin: 0, fontSize: "30px", color: "#333" }}>John Doe</h3>
                        <p style={{ fontSize: "20px", color: "#666", marginTop: "1px" }}>Nurse</p>
                        </div>

                        <ul style={styles.navList}>
                            <li style={getNavItemStyle("/patientRecord")} onClick={() => navigate("/patientRecord")}>
                                <span></span> Patient Records
                            </li>
                            <li style={getNavItemStyle("/appointment")} onClick={() => navigate("/appointment")}>
                                <span></span> Appointments
                            </li>
                        </ul>
                    </div>

                    <div style={styles.logout} onClick={handleLogout}>
                        <span></span> Logout
                    </div>
                </aside>

                {/* Main Content */}
                <main style={styles.mainContent}>
                    <div style={styles.headerRow}>
                        <h2 style={styles.title}>Appointments</h2>
                    </div>
                    <div style={styles.maintenancediv}>
                        <img src={maintenance} alt="maintenance" style={styles.maintenance} />
                    </div>

                    <div style={{ padding: "20px" }}>
                            <h2>Frontend Connected to Backend</h2>
                            <p>Message from API: {msg || "No message received."}</p>
                    </div>
                </main>
            </div>
        </div>
    );    
}

const styles = {
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        width: "100%",
        overflow: "hidden",
        position: "relative",
    },
    navbar: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "100px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "50px",
        paddingRight: "30px",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
    },
    navLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    navRight: {
        fontSize: "18px",
        display: "flex",
        gap: "30px",
        color: "#333",
        padding: "0 12px",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoImage: {
        width: "180px",
        height: "80px",
        objectFit: "contain",
    },
    maintenance: {
        width: "900px",
        height: "300px",
        objectFit: "contain",
    },
    maintenancediv: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
    },
    
    
    icon: {
        width: "18px",
        height: "18px",
        objectFit: "contain",
    },

    appContainer: {
        position: "fixed",
        top: "50px",
        left: "350px",
        right: 0,
        bottom: 0,
        display: "flex",
        overflow: "hidden",
        backgroundColor: "white",
      },
      
      sidebar: {
        position: "fixed",
        top: "100px",
        bottom: 0,
        left: 0,
        width: "300px",
        backgroundColor: "white",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid rgb(218, 218, 218)",
        padding: "20px",
    },
    sidebarTitle: {
        fontSize: "20px",
        marginBottom: "20px",
        color: "#333",
    },
    navList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
    },
    mainContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        margin: 40,
    },

    container: {
        padding: "20px",
    },
    title: {
        fontSize: 40,
        color: "#0077B6",
    },
    hospitalName: {
        fontWeight: "bold",
        fontSize: "14px",
        color: "#007bff",
    },
    profileCard: {
        flexDirection: "column",
        alignItems: "left",
        paddingLeft: "35px",
        paddingTop: "25px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fefefe",
        textAlign: "left",
        marginBottom: "25px",
    },
    profilePic: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#ccc",
        marginBottom: "10px",
    },    
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 1,
        padding: "15px 0",
        borderBottom: "1px solid #ccc",
    },
    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    searchInput: {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "180px",
    },
    addButton: {
        padding: "5px 12px",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "10px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fefefe",
    },
    tableHeader: {
        backgroundColor: "#f1f1f1",
    },
    tableCellHeader: {
        textAlign: "left",
        padding: "10px",
        borderBottom: "1px solid #ddd",
        fontWeight: "bold",
        fontSize: "12px",
    },
    tableCell: {
        padding: "10px",
        borderBottom: "1px solid #eee",
        fontSize: "12px",
    }, 
    logout: {
        width: "100%",
        backgroundColor: "#ff4d4f",
        color: "white",
        border: "none",
        padding: "10px 0",
        borderRadius: "5px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "18px",
        marginBottom: 0,
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    inputField: {
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        marginTop: "10px",
    },
    submitBtn: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer",
    },
    cancelBtn: {
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer",
    },
};
