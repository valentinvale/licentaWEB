import React, { useEffect } from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";

import "../Styles/AuthenticationPage.css";
import { useAuth } from "../Context/AuthContext";

function AuthenticationPage(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem("jwtToken") !== null;
        if (isUserLoggedIn && AuthenticationService.isTokenExpired(localStorage.getItem("jwtToken")) == false){
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.length === 0 || password.length === 0) {
            alert("Please fill out all fields");
            return;
        }
        loginUser(email, password);
    };

    const loginUser = (email, password) => {
        AuthenticationService.authenticate({ email, password })
            .then((response) => {
                localStorage.setItem("jwtToken", response.data.token);
                // navigate("/", {token: response.data.token});
                auth.handleLogin(response.data.token);
                window.location.href = "/"; // to fix
            })
            .catch((error) => {
                alert("Login failed");
            });
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="auth-form">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="auth-form-control"
                        id="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="auth-form">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="auth-form-control"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="auth-links">
                    <a className="forgot-pass-link" href="/forgotpassword">Ai uitat parola?</a>
                    <a className="register-link" href="/signup">Nu ai cont? Inregistreaza-te.</a>
                </div>
                <div className="auth-center-container">
                    <button type="submit" className="auth-btn">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
export default AuthenticationPage;
