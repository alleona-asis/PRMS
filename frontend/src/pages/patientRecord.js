import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import trash from "../assets/delete.png";
import edit from "../assets/edit.png";
import addPatient from "../assets/add-patient.png";
import { useToast } from "../component/ToastContext";

export default function PatientRecord() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingPatientId, setEditingPatientId] = useState(null);
    const { showToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [sortField, setSortField] = useState("lastName");
    const [sortDirection, setSortDirection] = useState("asc");    

    const filteredPatients = [...patients]
    .filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aVal = a[sortField]?.toString().toLowerCase() || "";
      const bVal = b[sortField]?.toString().toLowerCase() || "";
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    });


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetchUserDetails(token);
        fetchData();
    }, [navigate]);

    const fetchUserDetails = async (token) => {
        try {
            const res = await fetch("https://prms-test.onrender.com/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
            } else {
                console.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchData = async () => {
        try {
            const patientsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/patients`);
            const patientsData = await patientsRes.json();
            setPatients(patientsData);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Add Patient
    const [showAddForm, setShowAddForm] = useState(false);
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [condition, setCondition] = useState("");
    const [dateAdmitted, setDateAdmitted] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("Regular");
    const [email, setEmail] = useState("");

    const handleAddPatient = async () => {
        if (!firstName.trim() || !lastName.trim() || !dob.trim() || !gender.trim() || !condition.trim() || !address.trim()) {
            showToast("All fields are required!", "error");
            return;
        }
        const patientData = {
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
        };
    
        try {
            const url = editingPatientId 
                ? `${process.env.REACT_APP_API_URL}/api/patients/${editingPatientId}` 
                : `${process.env.REACT_APP_API_URL}/api/patients`;
    
            const method = editingPatientId ? "PUT" : "POST"; 
    
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patientData),
            });
    
            if (response.ok) {
                setFirstName("");
                setLastName("");
                setDob("");
                setGender("");
                setAge("");
                setCondition("");
                setDateAdmitted(new Date().toISOString().split('T')[0]);
                setAddress("");
                setEmail("");
                setEditingPatientId(null);
                setShowAddForm(false);
                fetchData();
            } else {
                showToast("Failed to save patient!", "success");
            }
        } catch (error) {
            console.error("Error saving patient:", error);
        }
    };

    const handleDeleteClick = (patient) => {
        setPatientToDelete(patient);
        setShowDeleteModal(true);
    };
    
    const handleDeletePatient = async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/${id}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                const error = await response.json();
                alert("Error deleting patient: " + (error.message || "Unknown error"));
                return;
            }
            setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== id));
            setShowDeleteModal(false);
            setPatientToDelete(null);
            showToast("Patient deleted successfully.", "success");

        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };
    
    const handleEditPatient = (patient) => {
        setFirstName(patient.firstName);
        setLastName(patient.lastName);
        setDob(patient.dob);
        setGender(patient.gender);
        setAge(patient.age);
        setCondition(patient.condition);
        setDateAdmitted(patient.dateAdmitted);
        setAddress(patient.address);
        setEditingPatientId(patient._id);
        setShowAddForm(true);
        setStatus(patient.status || "Regular");
        setEmail(patient.email);
    };
    
    return (
        <div style={styles.pageWrapper}>
        <style>
            {`
                html, body {
                overflow: hidden;
                }

                .mainContent::-webkit-scrollbar {
                width: 8px;
                }

                .mainContent::-webkit-scrollbar-thumb {
                background-color: #999;
                border-radius: 4px;
                }

                @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
                }

                @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
                }
                button:hover {
                    transform: scale(1.05);
                    transition: transform 0.2s ease-in-out;
                }                   
            `}
            </style>

            {/* Top Nav */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <img src={logo} alt="Logo" style={styles.logoImage} />
                </div>
                <div style={styles.navRight}>
                    <div style={styles.userInfo}>
                    <div style={styles.profilePic}></div>
                    <span style={styles.username}>Username</span>
                    <button style={styles.logout} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                </div>
            </nav>
    
            <div style={styles.appContainer}>

                {/* Main Content */}
                <main style={styles.mainContent}>
                    <div style={styles.headerRow}>
                        <h2 style={styles.title}>Patient Records</h2>
                        {user ? <p>{/* Welcome! */}</p> : <p></p>}
                        <div style={styles.headerActions}>
                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                            <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
                                <img src={addPatient} alt="Logo" style={styles.icon} />
                                Add Patient
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', marginRight: "10px", fontSize: "17px", marginLeft: "10px" }}>
                            Total Patients: {patients.length}
                        </p>
                        <label htmlFor="sortField" style={{ fontWeight: 'bold' }}>Sort By:</label>
                        <select
                            id="sortField"
                            value={sortField}
                            onChange={e => setSortField(e.target.value)}
                            style={{ padding: '5px 10px', borderRadius: '5px' }}
                        >
                            <option value="lastName">Last Name</option>
                            <option value="firstName">First Name</option>
                            <option value="dob">Date of Birth</option>
                            <option value="gender">Gender</option>
                            <option value="condition">Condition</option>
                        </select>
                        <select
                            id="sortDirection"
                            value={sortDirection}
                            onChange={e => setSortDirection(e.target.value)}
                            style={{ padding: '5px 10px', borderRadius: '5px' }}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        </div>

                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableCellHeader}>Patient ID</th>
                                <th style={styles.tableCellHeader}>Last Name</th>
                                <th style={styles.tableCellHeader}>First Name</th>
                                <th style={styles.tableCellHeader}>Date Of Birth</th>
                                <th style={styles.tableCellHeader}>Gender</th>
                                <th style={styles.tableCellHeader}>Age</th>
                                <th style={styles.tableCellHeader}>Condition</th>
                                <th style={styles.tableCellHeader}>Date Admitted</th>
                                <th style={styles.tableCellHeader}>Address</th>
                                <th style={styles.tableCellHeader}>Status</th>
                                <th style={styles.tableCellHeader}>Email</th>
                                <th style={styles.tableCellHeader}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient, index) => (
                                <tr key={index}>
                                    <td style={styles.tableCell}>{patient.patientId.padStart(5, '0')}</td>
                                    <td style={styles.tableCell}>{patient.lastName}</td>
                                    <td style={styles.tableCell}>{patient.firstName}</td>
                                    <td style={styles.tableCell}>{new Date(patient.dob).toLocaleDateString("en-US")}</td>
                                    <td style={styles.tableCell}>{patient.gender}</td>
                                    <td style={styles.tableCell}>{patient.age}</td>
                                    <td style={styles.tableCell}>{patient.condition}</td>
                                    <td style={styles.tableCell}>{new Date(patient.dateAdmitted).toLocaleDateString("en-US")}</td>
                                    <td style={styles.tableCell}>{patient.address}</td>
                                    <td style={styles.tableCell}>{patient.status}</td>
                                    <td style={styles.tableCell}>{patient.email}</td>
                                    <td style={styles.tableCell}>
                                        <button
                                        onClick={() => handleEditPatient(patient)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "6px",
                                            outline: "none", 
                                        }}
                                        onMouseEnter={e => e.currentTarget.firstChild.style.transform = "scale(1.2)"}
                                        onMouseLeave={e => e.currentTarget.firstChild.style.transform = "scale(1)"}
                                        >
                                        <img
                                            src={edit}
                                            alt="Edit"
                                            style={{
                                            width: "24px",
                                            height: "24px",
                                            transition: "transform 0.2s ease-in-out",
                                            display: "block" 
                                            }}
                                        />
                                        </button>
                                        <button
                                        onClick={() => handleDeleteClick(patient)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "6px",
                                            outline: "none",
                                        }}
                                        onMouseEnter={e => e.currentTarget.firstChild.style.transform = "scale(1.2)"}
                                        onMouseLeave={e => e.currentTarget.firstChild.style.transform = "scale(1)"}
                                        >
                                        <img
                                            src={trash}
                                            alt="Delete"
                                            style={{
                                            width: "24px",
                                            height: "24px",
                                            transition: "transform 0.2s ease-in-out",
                                            display: "block"
                                            }}
                                        />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
    
                    {showAddForm && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalCard}>
                        <h2 style={styles.modalTitle}>{editingPatientId ? "Edit Patient" : "Add New Patient"}</h2>
                        <div style={styles.formSection}>
                            <h4 style={styles.sectionTitle}>Personal Information</h4>
                            <div style={styles.grid2col}>
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    style={styles.input} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    style={styles.input} 
                                />
                            </div>
                            <div style={{ display: "flex", gap: "20px", width: "93%" }}>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ ...styles.input, flex: "0 0 20%", color: status ? "#000" : "#757575" }}
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="PWD">PWD</option>
                                    <option value="Senior">Senior</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    style={{ ...styles.input, width: "45px" }}
                                />
                                <div style={{ flex: 1, display: "flex", gap: "20px" }}>
                                    <input
                                    type="date"
                                    placeholder="Date of Birth"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    style={{ ...styles.input, flex: 1, color: dob ? "#000" : "#757575" }}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                                        <label style={{ fontSize: "16px" }}>
                                            <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={gender === "Male"}
                                            onChange={(e) => setGender(e.target.value)}
                                            />
                                            Male
                                        </label>
                                        <label style={{ fontSize: "16px" }}>
                                            <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={gender === "Female"}
                                            onChange={(e) => setGender(e.target.value)}
                                            />
                                            Female
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                            type="text" 
                            placeholder="Address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            style={styles.input} 
                            />
                            <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={styles.input} 
                            />
                        </div>
                        <div style={styles.formSection}>
                            <h4 style={styles.sectionTitle}>Medical Information</h4>
                            <input 
                            type="text" 
                            placeholder="Condition" 
                            value={condition} 
                            onChange={(e) => setCondition(e.target.value)} 
                            style={styles.input} 
                            />
                            <input 
                            type="date" 
                            placeholder="Date Admitted" 
                            value={dateAdmitted} 
                            onChange={(e) => setDateAdmitted(e.target.value)} 
                            readOnly
                            style={{ ...styles.input, color: dateAdmitted ? "#000" : "#757575" }}  
                            />
                        </div>
                        <div style={styles.formActions}>
                        <button style={styles.saveBtn} onClick={handleAddPatient}>
                            {editingPatientId ? "Update" : "Save"}
                        </button>
                        <button style={styles.cancelBtn} onClick={() => {
                            setShowAddForm(false);
                            setEditingPatientId(null);
                            setFirstName("");
                            setLastName("");
                            setDob("");
                            setGender("");
                            setAge("");
                            setCondition("");
                            setDateAdmitted("");
                            setAddress("");
                            setStatus("");
                            setEmail("");
                            }}>
                            Cancel
                        </button>
                        </div>
                        </div>
                    </div>
                    )}
                
                {showDeleteModal && (
                    <div style={styles.deleteModalOverlay}>
                        <div style={styles.deleteModalCard}>
                            <h2 style={styles.deleteModalTitle}>Are you sure you want to delete this patient?</h2>
                            <p style={styles.deleteModalMessage}>{patientToDelete?.firstName} {patientToDelete?.lastName}</p>
                            <button 
                                style={styles.deleteConfirmBtn} 
                                onClick={() => handleDeletePatient(patientToDelete._id)}>
                                Yes, Delete
                            </button>
                            <button 
                                style={styles.deleteCancelBtn} 
                                onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                </main>
            </div>
        </div>
    );    
}

const styles = {
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      },
      profilePic: {
        width: '70px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
      },
      username: {
        fontWeight: 'bold',
        width: '150px',
      },
        deleteModalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out',
        },
        deleteModalCard: {
            backgroundColor: '#fff',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '400px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            animation: 'slideUp 0.4s ease-out',
            textAlign: 'center',
        },
        deleteModalTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px',
        },
        deleteModalMessage: {
            fontSize: '16px',
            color: '#555',
            marginBottom: '20px',
        },
        deleteConfirmBtn: {
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#dc3545',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '10px',
            marginRight: '10px',
        },
        deleteConfirmBtnHover: {
            backgroundColor: '#c82333',
        },
        deleteCancelBtn: {
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#6c757d',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '10px',
            marginLeft: '10px',
        },
        deleteCancelBtnHover: {
            backgroundColor: '#5a6268',
        },
        closeDeleteModalBtn: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#555',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
    modalTitle: {
        fontSize: "24px",
        fontWeight: "600",
        marginBottom: "20px",
        textAlign: "center",
      },
      formSection: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },
      sectionTitle: {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#007bff",
      },
      grid2col: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "25px",
      },
      grid3col: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "25px",
      },
      input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        fontSize: "16px",
        transition: "all 0.3s ease-in-out",  
      },      
      inputFocus: {
        borderColor: "#007bff",
        boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
      },
      formActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "20px",
      },
      cancelBtn: {
        padding: "10px 20px",
        backgroundColor: "#ccc",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      },
      saveBtn: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      },
      cancelBtnHover: {
        backgroundColor: "#555",
      },
      
      saveBtnHover: {
        backgroundColor: "#0056b3",
      },
    pageWrapper: {
        display: "flex",
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
    icon: {
        width: "30px",
        height: "25px",
        objectFit: "contain",
    },

    appContainer: {
        marginTop: "50px",
        right: 0,
        bottom: 0,
        display: "flex",
        overflow: "hidden",
        backgroundColor: "white",
        width: "100%",
      },
    mainContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        margin: 40,
        width: "100%",
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
        padding: "14px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "300px",
    },
    addButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background-color 0.3s ease",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableCellHeader: {
        textAlign: "left",
        padding: "10px",
        borderBottom: "1px solid #ddd",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#0077B6",
    },
    tableCell: {
        padding: "10px",
        borderBottom: "1px solid #eee",
        fontSize: "15px",
    }, 
    logout: {
        width: "50%",
        backgroundColor: "#ff4d4f",
        color: "white",
        border: "none",
        padding: "10px 0",
        borderRadius: "5px",
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "18px",
        marginBottom: 0,
        marginRight: "7px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease",
      },
      modalCard: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        minWidth: "600px",
        animation: "slideUp 0.3s ease",
      },
};

