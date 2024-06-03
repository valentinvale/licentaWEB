import React, { useRef } from "react";
import PetService from "../services/PetService";
import AIService from "../services/AIService";
import WebsocketService from "../services/WebsocketService";
import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Button
  } from 'reactstrap';

import '../Styles/PetPage.css';

import { formatDate } from "../services/StringUtils";
import SendConfirmationModal from "./SendConfirmationModal";
import UserService from "../services/UserService";



function PetPage(args) {
    const { id } = useParams();
    const [pet, setPet] = useState({});
    const [petUsername, setPetUsername] = useState('');
    const [petUserId, setPetUserId] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const conversationExists = useRef(false);

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const [petCompatibility, setPetCompatibility] = useState('');

    const [sendAdoptConfirmationModalIsOpen, setSendAdoptConfirmationModalIsOpen] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();

    const openConfirmationModal = () => {
        setSendAdoptConfirmationModalIsOpen(true);
    };

    const closeConfirmationModal = () => {
        setSendAdoptConfirmationModalIsOpen(false);
    };

    const items = pet.imageUrls ? pet.imageUrls.map((url, index) => {
        return {
            src: url,
            altText: pet.name,
            caption: pet.name,
            key: index
        };
    }) : [];

    const checkIfFavorite = (petId) => {
        UserService.checkIfFavorite(auth.user.id, petId, auth.token).then(response => {
            console.log("Is favorite response:", response.data);
            setIsFavorite(response.data);
        });
    };

    useEffect(() => {
        PetService.getPetById(id).then(response => {
            console.log("Pet response:", response.data);
            setPet(response.data);
            setPetUsername(response.data.user.realUsername);
            setPetUserId(response.data.user.id);
            if (auth.user && auth.user.id !== response.data.user.id) {
                checkIfFavorite(response.data.id);
            }
        });

        if (auth.user) {
            WebsocketService.connect(auth.user.id, onMessageReceived, onConnected, onError);
        }

        return () => {
            WebsocketService.disconnect();
        };
    }, [auth.user, id]);


    useEffect(() => {
        if(auth.user && id && auth.user.activityLevel){

            AIService.predictPetCompatibility(auth.user.id, id, auth.token).then(response => {
                console.log("Compatibility response:", response.data);
                setPetCompatibility(response.data.compatibility_percentage);
            });
        }
    }, [auth.user, id]);


    useEffect(() => {
        if (auth.user && petUserId) {
            WebsocketService.getMessages(auth.user.id, petUserId, auth.token).then(response => {
                if(response.data.length > 0) {
                    conversationExists.current = true;
                }
            }).catch(err => console.error("Failed to fetch messages:", err));
        }
    }, [auth.user, petUserId]);

    // useEffect(() => {
    //     console.log("Is favorite:", isFavorite);
    // }, [isFavorite]);

    const onMessageReceived = (message) => {
        console.log("Received message:", message);
    };

    const onConnected = (frame) => {
        console.log("WebSocket Connected:", frame);
    };

    const onError = (error) => {
        console.error("WebSocket Error:", error);
    };

    const handleSendMessage = () => {
        if (petUserId) {
            console.log(conversationExists);
            if(conversationExists.current === false) {
                WebsocketService.sendMessage(auth.user.id, petUserId, "Buna! As dori sa discutam despre animalutul tau.").then(() => {
                    navigate("/user", { state: { openedTab: '2', recipientId: petUserId } });
                }).catch(err => console.error("Failed to send message:", err));
            }
            else {
                // console.error("Conversation already exists.");
                navigate("/user", { state: { openedTab: '2', recipientId: petUserId } });
            }
        } else {
            console.error("Pet user ID is not available.");
        }
    };

    const handleSendAdoptRequest = () => {
    };


    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            UserService.removeFavoritePet(auth.user.id, pet.id, auth.token).then(() => {
                setIsFavorite(false);
            });
        } else {
            UserService.addFavoritePet(auth.user.id, pet.id, auth.token).then(() => {
                setIsFavorite(true);
            });
        }
    };

    const slides = items.map((item) => {
        return (
        <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.src}
        >
            <img src={item.src} alt={item.altText} className="custom-carousel-img"/>
            {/* <CarouselCaption
            captionText={item.caption}
            captionHeader={item.caption}
            /> */}
        </CarouselItem>
        );
    });

    const getCharacteristics = (pet) => {
        const characteristics = [
            `Nivel de activitate: ${pet.activityLevel}`,
            `Nevoi de îngrijire: ${pet.careNeeds}`,
            `Nivel de zgomot: ${pet.noiseLevel}`,
            `Bun cu copiii: ${pet.goodWithKids}`,
            `Bun cu alte animale: ${pet.goodWithPets}`,
            `Temperament: ${pet.temperament}`
        ];

        return characteristics.join(', ');
    };

    return (
        <div className="pet-page">
            <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            className="custom-carousel"
            {...args}
            >
            <CarouselIndicators
                items={items}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
            />
            {slides}
            <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={previous}
            />
            <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={next}
            />
            </Carousel>
            <div className="pet-info">
                {
                    auth.user && auth.user.id !== petUserId ? (
                        <>
                            <Button color="link" onClick={toggleFavorite}>
                                <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} style={{ fontSize: '2rem', color: isFavorite ? 'red' : 'black' }}></i>
                        
                            </Button>
                            Adaugă la favorite
                        </>
                    ) : (null)
                }
                
                
                <h1>Nume: {pet.name}</h1>
                <h3>Rasa: {pet.breed}</h3>
                <h3>Sex: {pet.sex}</h3>
                <h3>{pet.age ? "Varsta: " + pet.age + " ani" : "Varsta necunoscuta"}</h3>
                <h3>{pet.birthDate ? "Data nasterii: " + formatDate(pet.birthDate) : "Data nasterii necunoscuta"}</h3>
                <h3>Postat de: 
                    <Link to={`/profile?userId=${petUserId}`} style={{ textDecoration: 'none'}}>
                        {petUsername}
                    </Link>
                </h3>
                <h3>
                    Compatibilitate: {petCompatibility ? ((parseFloat(petCompatibility) * 100) < 0.01 ? "<0.01%" : (parseFloat(petCompatibility)).toFixed(2) + "%") : "Calculand..."}
                </h3>
                <h3>Postat la data de: {formatDate(pet.dateAdded)}</h3>
                <h3><i class="bi bi-geo-alt"></i>{" " + pet.oras + ", " + pet.judet}</h3>
                <div className="pet-description">
                    <h3>Descriere:</h3>
                    <p>{pet.description}</p>
                </div>
                <div className="pet-description">
                    <h3>Caracteristici</h3>
                    <p>
                        {getCharacteristics(pet)}
                    </p>
                </div>
            </div>
            {
                auth.user && auth.user.id !== petUserId ? (
                    <div className="contact-user">
                        <Button
                            size="lg"
                            className="message-user-button"
                            onClick={handleSendMessage}
                        >
                            <i class="bi bi-chat"></i> Trimite mesaj
                        </Button>
                    </div>
                ) : (null)
            }

            {
                auth.user && auth.user.id === petUserId ? (
                    <div className="send-adopt-request">
                        <Button
                            size="lg"
                            className="adopt-request-button"
                            onClick={openConfirmationModal}
                        >
                            <i class="bi bi-arrow-left-right"> </i> Trimite confirmare adoptie
                        </Button>
                        <SendConfirmationModal isOpen={sendAdoptConfirmationModalIsOpen} petId={id} onRequestClose={closeConfirmationModal}/>
                    </div>
                ) : (null)
            }
            
        </div>
    );

}
export default PetPage;