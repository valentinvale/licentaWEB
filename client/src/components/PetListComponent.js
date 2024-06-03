import React, { useState, useEffect } from 'react';
import PetService from '../services/PetService';
import UserService from '../services/UserService';
import { useLocation } from 'react-router-dom';
import PetCardFrame from './PetCardFrame';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import '../Styles/PetCards.css';
import '../Styles/Pagination.css';

const PetListComponent = ({ onlyDogs, onlyCats }) => {
    const [pets, setPets] = useState([]);
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userLatitude, setUserLatitude] = useState('');
    const [userLongitude, setUserLongitude] = useState('');
    const [userAllowsLocation, setUserAllowsLocation] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [petsPerPage] = useState(8);

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
        if(searchParams?.sort){
            if(searchParams.sort === "compatibility" && user.id && token){
                PetService.getPetsSortedByCompatibility(user.id, token).then((response) => {
                    filterPets(response.data);
                });
            }
        }
    }, [location.state, onlyDogs, onlyCats, user.id, token]);

    const indexOfLastPet = currentPage * petsPerPage;
    const indexOfFirstPet = indexOfLastPet - petsPerPage;
    const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <PetCardFrame pets={currentPets} sm="12" md="6" lg="4" xl="3" />
            <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink first onClick={() => paginate(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                </PaginationItem>
                {[...Array(Math.ceil(pets.length / petsPerPage)).keys()].map(number => (
                    <PaginationItem key={number + 1} active={number + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(number + 1)}>
                            {number + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage === Math.ceil(pets.length / petsPerPage)}>
                    <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === Math.ceil(pets.length / petsPerPage)}>
                    <PaginationLink last onClick={() => paginate(Math.ceil(pets.length / petsPerPage))} />
                </PaginationItem>
            </Pagination>
        </div>
    );
};

export default PetListComponent;
