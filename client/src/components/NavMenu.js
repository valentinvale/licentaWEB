import React, { useEffect, useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
import AuthenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

function NavMenu(args) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(args.token);

  const navigate = useNavigate();

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
}


  useEffect(() => {
    setToken(localStorage.getItem("jwtToken"));
    setIsUserLoggedIn(localStorage.getItem("jwtToken") !== null);
    if (isUserLoggedIn) {
        const token = localStorage.getItem("jwtToken");
        const mail = getEmailFromToken(token);
        setEmail(mail);
        UserService.getUserByEmail(mail, token).then((response) => {
            setUsername(response.data.username);
        });
    }
  }, [isUserLoggedIn]);

  // useEffect(() => {
  //   if (token) {
  //     const mail = getEmailFromToken(token);
  //     setEmail(mail);
  //     UserService.getUserByEmail(mail, token).then((response) => {
  //       setUsername(response.data.username);
  //       setIsUserLoggedIn(true);
  //     }).catch((error) => {
  //       console.error("Error fetching user details:", error);
  //     });
  //   } else {
  //     setUsername("");
  //     setEmail("");
  //     setIsUserLoggedIn(false);
  //   }
  // }, [token]);
  

  const logOut = () => {
    AuthenticationService.logOut();
    setToken("");
    setIsUserLoggedIn(false);
    window.location.href = '/';
  }

  return (
    <div>
      <Navbar {...args}>
        <NavbarBrand href="/">FurEverHome</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              { isUserLoggedIn ? 
              (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {username}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Contul Tău</DropdownItem>
                  <DropdownItem onClick={logOut}>Ieși din cont</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>) : 
              (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Contul Tău
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => navigate("/login")}>Autentificare</DropdownItem>
                  <DropdownItem onClick={() => navigate("/signup")}>Înscriere</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              )}
            </NavItem>
          </Nav>
          <NavbarText>Simple Text</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavMenu;