// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
// import "../styles/Login.css"; 
// import axios from "axios";

// function Login() {
//     const [credentials, setCredentials] = useState({ email: "", password: "" });
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCredentials({ ...credentials, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!credentials.email || !credentials.password) {
//             setError("Please fill out all fields.");
//         } else {
//             setError("");

//             try {
//                 const response = await axios.post('http://localhost:5000/skillswap/login', credentials, { withCredentials: true });
//                 localStorage.setItem('user', JSON.stringify(response.data.user));
//                 console.log("Login successful:", response.data);
//                 navigate("/home");
//             } catch (error) {
//                 console.error('Login failed:', error);
//                 setError(error.response?.data?.message || "Login failed. Please try again.");
//             }

//             console.log("Logging in with:", credentials);
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-card">
//                 <h1>Login</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="input-group">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={credentials.email}
//                             onChange={handleChange}
//                             placeholder="Enter your email"
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={credentials.password}
//                             onChange={handleChange}
//                             placeholder="Enter your password"
//                         />
//                     </div>
//                     {error && <p className="error-message">{error}</p>}
//                     <button type="submit" className="login-button">Login</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Login;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
// import "../styles/Login.css"; 
// import axios from "axios";

// function Login() {
//     const [credentials, setCredentials] = useState({ email: "", password: "" });
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCredentials({ ...credentials, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!credentials.email || !credentials.password) {
//             setError("Please fill out all fields.");
//         } else {
//             setError("");

//             try {
//                 const response = await axios.post('http://localhost:5000/skillswap/login', credentials, { withCredentials: true });
//                 localStorage.setItem('user', JSON.stringify(response.data.user));
//                 console.log("Login successful:", response.data);
//                 navigate("/"); 
//             } catch (error) {
//                 console.error('Login failed:', error);
//                 setError(error.response?.data?.message || "Login failed. Please try again.");
//             }

//             console.log("Logging in with:", credentials);
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-card">
//                 <h1>Login</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="input-group">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={credentials.email}
//                             onChange={handleChange}
//                             placeholder="Enter your email"
//                         />
//                     </div>
//                     <div className="input-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={credentials.password}
//                             onChange={handleChange}
//                             placeholder="Enter your password"
//                         />
//                     </div>
//                     {error && <p className="error-message">{error}</p>}
//                     <button type="submit" className="login-button">Login</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "../styles/Login.css"; 

function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            setError("Please fill out all fields.");
        } else {
            setError("");

            try {
                const response = await axios.post('http://localhost:5000/skillswap/login', credentials, { withCredentials: true });
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // console.log("Login successful:", response.data);
                navigate("/profile"); 
            } catch (error) {
                console.error('Login failed:', error);
                setError(error.response?.data?.message || "Login failed. Please try again.");
            }

            // console.log("Logging in with:", credentials);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
