import React from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const navigate = useNavigate();

    const renderRegisterPage = () => {
        return (
            <div className="rl-container">
                <h1 className="rl-title">Register</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="rl-form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="rl-form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                        <small id="emailHelp" className="rl-form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="username">Username</label>
                        <input type="username" className="rl-form-control" id="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="firstName" className="rl-form-control" id="firstName" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="lastName" className="rl-form-control" id="lastName" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="rl-form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" className="rl-form-control" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <div className="rl-center-container">
                        <button type="submit" className="rl-btn rl-btn-primary">Submit</button>
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

        // to do: check if email is already in use and if username is already in use

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



