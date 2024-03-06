import React, { useEffect } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";
import UserService from "../services/UserService";

function Layout(props) {

    const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(localStorage.getItem("jwtToken") !== null);
    const [token, setToken] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");


    const getEmailFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
    
            //console.log(JSON.parse(jsonPayload).sub);
            return JSON.parse(jsonPayload).sub;
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {
        if (isUserLoggedIn) {
            const token = localStorage.getItem("jwtToken");
            setToken(token);
            const mail = getEmailFromToken(token);
            setUserEmail(mail);
            UserService.getUserByEmail(mail, token).then((response) => {
                setUsername(response.data.username);
            });
        }
        //console.log(isUserLoggedIn);
    }, [token, isUserLoggedIn, username, userEmail]);

    
    return (
        <div>
            <NavMenu expand="sm"/>
            <Container tag="menu">
                {props.children}
            </Container>
        </div>
    );
    
}
export default Layout;