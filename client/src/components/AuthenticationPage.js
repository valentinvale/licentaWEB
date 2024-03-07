import React, { useEffect } from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";

function AuthenticationPage(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

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
               window.location.href = "/"; // to fix
            })
            .catch((error) => {
                alert("Login failed");
            });
    };

    return (
        <div className="rl-container">
            <h1 className="rl-title">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="rl-form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="rl-form-control"
                        id="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="rl-form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="rl-form-control"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="rl-center-container">
                    <button type="submit" className="rl-btn rl-btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
export default AuthenticationPage;
