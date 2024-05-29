import React, { useState, useEffect } from 'react';
import PetService from '../services/PetService';
import UserService from '../services/UserService';
import { useLocation } from 'react-router-dom';
import PetCardFrame from './PetCardFrame';
import '../Styles/PetCards.css';

const PetListComponent = ({ onlyDogs, onlyCats }) => {
    const [pets, setPets] = useState([]);
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userLatitude, setUserLatitude] = useState('');
    const [userLongitude, setUserLongitude] = useState('');
    const [userAllowsLocation, setUserAllowsLocation] = useState(false);

    const location = useLocation();
    const searchParams = location.state;

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

    const executeSearch = (lat, long) => {
        const keyWords = searchParams?.keyWords || '';
        const county = searchParams?.county || '';
        const city = searchParams?.city || '';

        PetService.getPetsFiltered(keyWords, county, city, lat, long).then((response) => {
            filterPets(response.data);
        });
    };

    const filterPets = (petsData) => {
        let filteredPets = petsData;
        if (onlyDogs) {
            filteredPets = filteredPets.filter(pet => pet.petType === 'Caine');
        } else if (onlyCats) {
            filteredPets = filteredPets.filter(pet => pet.petType === 'Pisica');
        }
        setPets(filteredPets);
    };

    useEffect(() => {
        console.log("Location state: ", location.state);
        if (isUserLoggedIn()) {
            const token = localStorage.getItem("jwtToken");
            setToken(token);
            const mail = getEmailFromToken(token);
            setUserEmail(mail);
            UserService.getUserByEmail(mail, token).then((response) => {
                setUser(response.data);
                setUsername(response.data.username);
            });
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                setUserLatitude(position.coords.latitude);
                setUserLongitude(position.coords.longitude);
                setUserAllowsLocation(true);

                if (searchParams?.keyWords || searchParams?.county || searchParams?.city) {
                    executeSearch(position.coords.latitude, position.coords.longitude);
                } else {
                    PetService.getPetsSortedByDistance(position.coords.latitude, position.coords.longitude).then((response) => {
                        filterPets(response.data);
                    });
                }
            }, function (error) {
                console.error("Error Code = " + error.code + " - " + error.message);
                setUserAllowsLocation(false);

                if (searchParams?.keyWords || searchParams?.county || searchParams?.city) {
                    executeSearch();
                } else {
                    PetService.getPets().then((response) => {
                        filterPets(response.data);
                    });
                }
            });
        } else {
            if (searchParams?.keyWords || searchParams?.county || searchParams?.city) {
                executeSearch();
            } else {
                PetService.getPets().then((response) => {
                    filterPets(response.data);
                });
            }
        }
    }, [location.state, onlyDogs, onlyCats]);

    return (
        <div>
            <PetCardFrame pets={pets} sm="12" md="6" lg="4" xl="3" />
        </div>
    );
};

export default PetListComponent;
