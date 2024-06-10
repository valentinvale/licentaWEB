import React, {useEffect} from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";

import "../Styles/AuthenticationPage.css";

function RegisterPage(props) {
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem("jwtToken") !== null;
        if (isUserLoggedIn && AuthenticationService.isTokenExpired(localStorage.getItem("jwtToken")) == false){
            navigate("/");
        }
    }, [navigate]);

    const renderRegisterPage = () => {
        return (
            <div className="auth-container">
                <h1 className="auth-title">Register</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="auth-form">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="auth-form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="auth-form">
                        <label htmlFor="username">Username</label>
                        <input type="username" className="auth-form-control" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="auth-form">
                        <label htmlFor="firstName">First Name</label>
                        <input type="firstName" className="auth-form-control" id="firstName" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="auth-form">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="lastName" className="auth-form-control" id="lastName" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="auth-form">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="auth-form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="auth-form">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" className="auth-form-control" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="auth-links">
                        <a className="login-link" href="/login">Ai deja cont? Autentifica-te.</a>
                    </div>
                    <div className="auth-center-container">
                        <button type="submit" className="auth-btn">Submit</button>
                    </div>
                </form>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email.length === 0 || username.length === 0 || firstName.length === 0 || lastName.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            alert("Please fill out all fields");
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email");
            return;
        }
    
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Please enter a valid password");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        
        registerUser(email, username, firstName, lastName, password);
    }

    const registerUser = (email, username, firstName, lastName, password) => {
        AuthenticationService.register({email, username, firstName, lastName, password}).then((response) => {
            if (response.status === 200) {
                alert("Registration successful");
                navigate("/login");
            } else {
                alert("Registration failed");
            }
        });
    }

    return renderRegisterPage();

}
export default RegisterPage;



