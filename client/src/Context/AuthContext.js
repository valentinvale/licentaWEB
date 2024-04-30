import React, { createContext, useState, useEffect } from 'react';

import UserService from '../services/UserService';

export const AuthContext = createContext({
    isAuthenticated: false,
    userEmail: '',
    token: '',
    user: '',
    username: '',
    handleLogin: () => {}
});

export const AuthContextProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    // const login = async () => {}
    // const register = async () => {}


    
    const getEmailFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
    
            return JSON.parse(jsonPayload).sub;
        } catch (e) {
            return null;
        }
    };

    const isUserLoggedIn = () => {
        return localStorage.getItem("jwtToken") !== null;
    };

    const handleLogin = (token) => {
        setToken(token);
        const mail = getEmailFromToken(token);
        setUserEmail(mail);
        UserService.getUserByEmail(mail, token).then((response) => {
            setUser(response.data);
            setUsername(response.data.username);
        });
    };

    useEffect(() => {

        if (isUserLoggedIn()) {
            console.log("User is logged in");
            const token = localStorage.getItem("jwtToken");
            setToken(token);
            const mail = getEmailFromToken(token);
            setUserEmail(mail);
            UserService.getUserByEmail(mail, token).then((response) => {
                setUser(response.data);
                setUsername(response.data.username);
            });
        }

    }, []);
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userEmail, setUserEmail, token, setToken, user, setUser, username, setUsername, handleLogin }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => React.useContext(AuthContext);