import React from "react";
import AuthenticationService from "../services/AuthenticationService";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        };
    }

    render() {
        return this.renderRegisterPage();
    }

    renderRegisterPage() {
        return (
            <div className="rl-container">
                <h1 className="rl-title">Register</h1>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="rl-form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="rl-form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => this.setState({ email: e.target.value })} />
                        <small id="emailHelp" className="rl-form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="username">Username</label>
                        <input type="username" className="rl-form-control" id="username" placeholder="Username" onChange={(e) => this.setState({ username: e.target.value })} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="firstName" className="rl-form-control" id="firstName" placeholder="First Name" onChange={(e) => this.setState({ firstName: e.target.value })} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="lastName" className="rl-form-control" id="lastName" placeholder="Last Name" onChange={(e) => this.setState({ lastName: e.target.value })} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="rl-form-control" id="password" placeholder="Password" onChange={(e) => this.setState({ password: e.target.value })} />
                    </div>
                    <div className="rl-form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" className="rl-form-control" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => this.setState({ confirmPassword: e.target.value })} />
                    </div>
                    <div className="rl-center-container">
                        <button type="submit" className="rl-btn rl-btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        const { email, username, firstName, lastName, password, confirmPassword } = this.state;

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
        
        this.registerUser(email, username, firstName, lastName, password);
    }

    registerUser(email, username, firstName, lastName, password) {
        AuthenticationService.register({email, username, firstName, lastName, password}).then((response) => {
            if (response.status === 200) {
                alert("Registration successful");
                //this.props.history.push("/login");
            } else {
                alert("Registration failed");
            }
        });
    }
}
export default RegisterPage;



