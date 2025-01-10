import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/SignupForm.css";
import SignupImage from "../assets/signupimage.webp";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        year: "",
        branch: "",
        college: "",  // New field for college
        socialMedia: "", // New field for social media link
        skills: [],
    });

    const [errors, setErrors] = useState({});
    const [skillInput, setSkillInput] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillChange = (e) => {
        setSkillInput(e.target.value);
    };

    const addSkill = (e) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData({
                    ...formData,
                    skills: [...formData.skills, skillInput.trim()],
                });
                setSkillInput("");
            }
        }
    };

    const removeSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (!formData.year) newErrors.year = "Please select your year.";
        if (!formData.branch) newErrors.branch = "Please select your branch.";
        if (!formData.college.trim()) newErrors.college = "College is required."; // New validation for college
        if (!formData.skills.length) newErrors.skills = "Add at least one skill.";
        if (!formData.socialMedia.trim()) newErrors.socialMedia = "Social Media link is required."; // New validation

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            year: formData.year,
            branch: formData.branch,
            college: formData.college,  // Send college to backend
            socialMedia: formData.socialMedia,
            skills: formData.skills,
        };

        try {
            const response = await axios.post("http://localhost:5000/skillswap/register", formDataToSend);
            console.log("Account created successfully:", response.data);
            alert("Account created successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Error creating account:", error);
            alert(error.response?.data?.message || "Error creating account. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <div className="form-section">
                <h1>Create an Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                        {errors.year && <span className="error-text">{errors.year}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="branch">Branch</label>
                        <select
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                        >
                            <option value="">Select Branch</option>
                            <option value="CSE">Computer Science Engineering</option>
                            <option value="ISE">Information Science Engineering</option>
                            <option value="ECE">Electronics and Communication Engineering</option>
                            <option value="ME">Mechanical Engineering</option>
                            <option value="CV">Civil Engineering</option>
                            <option value="CH">Chemical Engineering</option>
                            <option value="AE">Aeronautical Engineering</option>
                            <option value="IEM">Industrial Management</option>
                        </select>
                        {errors.branch && <span className="error-text">{errors.branch}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="college">College</label>
                        <input
                            type="text"
                            id="college"
                            name="college"
                            placeholder="Enter your college name"
                            value={formData.college}
                            onChange={handleChange}
                        />
                        {errors.college && <span className="error-text">{errors.college}</span>}  {/* New error message */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="socialMedia">Social Media Link</label>
                        <input
                            type="text"
                            id="socialMedia"
                            name="socialMedia"
                            placeholder="Enter your social media profile link"
                            value={formData.socialMedia}
                            onChange={handleChange}
                        />
                        {errors.socialMedia && <span className="error-text">{errors.socialMedia}</span>}
                    </div>
                    <div className="form-group">
                        <label>Skills</label>
                        <input
                            type="text"
                            placeholder="Enter a skill and press Enter"
                            value={skillInput}
                            onChange={handleSkillChange}
                            onKeyDown={addSkill}
                        />
                        <ul className="skills-list">
                            {formData.skills.map((skill, index) => (
                                <li key={index}>
                                    {skill}{" "}
                                    <button type="button" onClick={() => removeSkill(skill)}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {errors.skills && <span className="error-text">{errors.skills}</span>}
                    </div>
                    <button type="submit" className="primary-btn">
                        Create Account
                    </button>
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </button>
                </form>
            </div>
            <div className="image-section">
                <img src={SignupImage} alt="Illustration" />
            </div>
        </div>
    );
}

export default Signup;
