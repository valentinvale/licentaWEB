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

import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

import logoImage from '../Resources/LogoFurEverHome_v3.png';

import '../Styles/NavMenu.css';


function NavMenu(args) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

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
       // console.log("Token exists");
        const token = localStorage.getItem("jwtToken");
        if(AuthenticationService.isTokenExpired(token) == true){
          //console.log("Token expired");
          AuthenticationService.logOut();
          setIsUserLoggedIn(false);
          setToken("");
          window.location.href = '/';
        }
        else{
          //console.log("Token not expired");
          const mail = getEmailFromToken(token);
            setEmail(mail);
            UserService.getUserByEmail(mail, token).then((response) => {
            setUsername(response.data.username);
          });
        }
        
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
      <Navbar className='navBar' {...args}>
        <NavbarBrand href="/">
          <img
            alt="FurEverHome"
            src={logoImage}
            style={{ width: "208px", height: "80px" }}
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem >
              { isUserLoggedIn ? 
              (
              <UncontrolledDropdown className='navDropdown' nav inNavbar>
                <DropdownToggle nav>
                <i class="bi bi-person-circle"> </i>{username}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => navigate("/user")}>Contul Tau</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={logOut}>Iesi din cont</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>) : 
              (
              <UncontrolledDropdown className='navDropdown' nav inNavbar>
                <DropdownToggle nav>
                <i class="bi bi-person-circle"> </i>Contul Tau
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => navigate("/login")}>Autentificare</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => navigate("/signup")}>Înscriere</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              )}
            </NavItem>
            <NavItem className='navLink'>
              <NavLink href="/postpet">Posteaza un Animalut</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavMenu;