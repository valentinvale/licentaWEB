import React, { useState, useEffect } from 'react';
import PetListComponent from './PetListComponent';
import PetService from '../services/PetService';
import ImageCarouselCustom from './ImageCarouselCustom';
import { useLocation } from 'react-router-dom';
import { Button } from 'reactstrap';
import dogButtonImage from '../Resources/dog_button.jpg'; 
import catButtonImage from '../Resources/cat_button.jpg'; 

import '../Styles/HomePage.css';

const HomePage = () => {

    const location = useLocation();

    const [recentPets, setRecentPets] = useState([]);
    
    const refreshAll = location.state?.refreshAll || false;

    const [onlyDogs, setOnlyDogs] = useState(false);
    const [onlyCats, setOnlyCats] = useState(false);

    const toggleOnlyCats = () => {
        setOnlyCats(!onlyCats);
        if (!onlyCats) {
            setOnlyDogs(false);
        }
    };

    const toggleOnlyDogs = () => {
        setOnlyDogs(!onlyDogs);
        if (!onlyDogs) {
            setOnlyCats(false);
        }
    };

    useEffect(() => {
        PetService.getRecentThreePets().then((response) => {
            console.log(response.data);
            setRecentPets(response.data);
        });
    }, []);

    const carouselItems = recentPets.map((pet, index) => ({
        altText: pet.name,
        caption: pet.name,
        key: index + 1,
        src: pet.imageUrls[0],
        id: pet.id
    }));

    return (
        <div>
            <h1>Viitorul tau prieten blanos intreaba de tine...</h1>
            <h2>Anunturi recente</h2>
            <ImageCarouselCustom items={carouselItems} />
            <h2 id='close-pets-header'>Adopta un animalut din apropiere si ofera-i o casa!</h2>
            <Button onClick={toggleOnlyDogs} className={`dog-filter-button ${onlyDogs ? 'active' : ''}`}>
                <img src={dogButtonImage} alt='dog' />
            </Button>
            <Button onClick={toggleOnlyCats} className={`cat-filter-button ${onlyCats ? 'active' : ''}`}>
                <img src={catButtonImage} alt='cat' />
            </Button>
            <div>
                <PetListComponent refreshAll={refreshAll} onlyDogs={onlyDogs} onlyCats={onlyCats} />
            </div>
        </div>
    );
};

export default HomePage;
