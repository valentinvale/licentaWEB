import React, { useState, useEffect } from 'react';
import PetService from '../services/PetService';
import UserService from '../services/UserService';

import { Card, Button, CardGroup } from 'reactstrap';
import PetCardFrame from './PetCardFrame';

import '../Styles/PetCards.css';

const PetListComponent = () => {
    const [pets, setPets] = useState([]);
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

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

    useEffect(() => {
        PetService.getPets().then((response) => {
            setPets(response.data);
        });
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
    }, []);


    const oldRender = () => {
        return (
            <div>
                <h1>Pet List</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Pet ID</th>
                            <th>Pet Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map((pet) => (
                            <tr key={pet.id}>
                                <td>{pet.id}</td>
                                <td>{pet.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderCardGrid = () => {
        return (
            <div>
                <PetCardFrame pets={pets} />
            </div>
        );
    };

    return (
       renderCardGrid()
    );
};

export default PetListComponent;
