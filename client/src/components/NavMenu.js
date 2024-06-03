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
  InputGroup,
  Input,
  Button,
  ButtonDropdown,
  Label,
  Tooltip
} from 'reactstrap';

import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import counties_with_cities from "../Resources/counties_with_cities.json";
import logoImage from '../Resources/LogoFurEverHome_v3.png';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

import '../Styles/NavMenu.css';


function NavMenu(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const [keyWords, setKeyWords] = useState("");
  const [countiesWithCities, setCountiesWithCities] = useState(counties_with_cities);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

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

const handleCountyChange = (e) => {
  if (e.target.value === "") {
      setSelectedCounty("");
      setCityList([]);
      return;
  }
  setSelectedCounty(e.target.value);
  const cities = countiesWithCities.filter((county) => county.county_name === e.target.value);
  setCityList(cities[0].cities);
  console.log(cities[0].cities);
}

const handleNavigateHome = () => {
  setSelectedCounty("");
  setSelectedCity("");
  setKeyWords("");
  navigate("/home");
}

const handleSearch = () => {
  if (keyWords === "" && selectedCounty === "" && selectedCity === "") {
    return;
  }
  navigate("/petlist", { state: { keyWords: keyWords, county: selectedCounty, city: selectedCity } });
}

const handleCompatibilitySort = () => {
  navigate("/petlist", { state: { sort: "compatibility" } });
}

  useEffect(() => {
    setToken(localStorage.getItem("jwtToken"));
    setCountiesWithCities(counties_with_cities);
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

  useEffect(() => {
    if (selectedCounty === "") {
      setCityList([]);
      return;
    }
    const cities = countiesWithCities.filter((county) => county.county_name === selectedCounty);
    setCityList(cities[0].cities);
  }, [keyWords, selectedCounty, selectedCity]);


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
  
  useEffect(() => {
    if (location.state && location.state.refreshAll) {
      setSelectedCounty("");
      setSelectedCity("");
      setKeyWords("");
    }
  }, [location.state]);

  const logOut = () => {
    AuthenticationService.logOut();
    setToken("");
    setIsUserLoggedIn(false);
    window.location.href = '/';
  }

  return (
    <div>
      <Navbar className='navBar' {...args}>
        <NavbarBrand href="#" onClick={handleNavigateHome}>
          <img
            alt="FurEverHome"
            src={logoImage}
            style={{ width: "208px", height: "80px" }}
          />
        </NavbarBrand>
        <div className='search-div'>
          <InputGroup className='search-input-group'>
            <Input value={keyWords} className='search-box' onChange={(e) => setKeyWords(e.target.value)} />
            <Input
              id="countySelect"
              name="countySelect"
              type="select"
              defaultValue=""
              value={selectedCounty}
              onChange={handleCountyChange}
              className='county-select'
            >
              <option value="" disabled>Judet</option>
              <option value="">Toate</option>
              {countiesWithCities.map((county) => (
                <option value={county.county_name} key={county.county_name}>
                  {county.county_name}
                </option>
              ))}
            </Input>
            <Input
              id="citySelect"
              name="select"
              type="select"
              defaultValue=""
              value={selectedCity}
              disabled={selectedCounty === ""}
              onChange={(e) => setSelectedCity(e.target.value)}
              className='city-select'
            >
              <option value="" disabled>Localitate</option>
              <option value="">Toate</option>
              {cityList.map((city) => (
                <option value={city.nume} key={city.nume}>
                  {city.nume}
                </option>
              ))}
            </Input>
            <Button className='search-button' onClick={handleSearch}>
              <i class="bi bi-search"></i>
            </Button>
            
          </InputGroup>
            {
              auth.user && auth.user.activityLevel ? (
                <>
                  <Button className='my-button' id='compatibilitySortButton' onClick={handleCompatibilitySort}>
                      <i class="bi bi-filter"></i>
                  </Button>
                  <Tooltip placement="bottom" isOpen={tooltipOpen} target="compatibilitySortButton" toggle={toggleTooltip}>
                    Sortează după compatibilitate
                  </Tooltip>
                </>
              ) : null
            }
        </div>
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
                  <DropdownItem onClick={() => navigate("/user")}>Contul Tău</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={logOut}>Iesi din cont</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => navigate("/createfeaturesprofile")}>Creează Profil Personalitate</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>) : 
              (
              <UncontrolledDropdown className='navDropdown' nav inNavbar>
                <DropdownToggle nav>
                <i class="bi bi-person-circle"> </i>Contul Tău
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
              <NavLink href="/postpet">Postează un Animăluț</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavMenu;