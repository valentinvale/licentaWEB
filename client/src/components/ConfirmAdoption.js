import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PetService from "../services/PetService";
import { Button } from "reactstrap";

import "../Styles/my-button.css";
import '../Styles/ConfirmAdoption.css';

const ConfirmAdoption = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('userId');
        const petId = queryParams.get('petId');

        if (auth.user) {
            const currentUserId = auth.user.id;

            if (!currentUserId || currentUserId !== userId) {
                navigate('/login');
            } else {
                PetService.adoptPet(petId, userId, auth.token).then((response) => {
                    console.log(response.data);
                    setLoading(false);
                }).catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            }
        } else {
            const interval = setInterval(() => {
                if (auth.user) {
                    clearInterval(interval);
                    const currentUserId = auth.user.id;

                    if (!currentUserId || currentUserId !== userId) {
                        navigate('/login');
                    } else {
                        PetService.adoptPet(petId, userId, auth.token).then((response) => {
                            console.log(response.data);
                            setLoading(false);
                        }).catch((error) => {
                            console.log(error);
                            setLoading(false);
                        });
                    }
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [location.search, auth.user, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="confirm-adoption-div">
            <h1 className="confirm-adoption-text">Adoptie confirmata!</h1>
            <Button className="my-button confirm-button" onClick={() => navigate('/')}>Inapoi acasa</Button>
        </div>
    );
};

export default ConfirmAdoption;
