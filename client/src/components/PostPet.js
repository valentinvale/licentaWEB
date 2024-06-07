import React, { useEffect, useState } from "react";
import AuthenticationService from "../services/AuthenticationService";
import UserService from "../services/UserService";
import PetService from "../services/PetService";
import GenerateNameModal from "./GenerateNameModal";
import PredictBreedModal from "./PredictBreedModal";
import { useNavigate } from "react-router-dom";
import { FormGroup, Form, Label, Input, Button, FormText, Spinner, Tooltip } from "reactstrap";

import counties_with_cities from "../Resources/counties_with_cities.json";
import "../Styles/PostPet.css";

function PostPet(props) {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [knowsDateOfBirth, setKnowsDateOfBirth] = useState(false);
    const [petName, setPetName] = useState("");
    const [petBreed, setPetBreed] = useState("");
    const [isDog, setIsDog] = useState(true);
    const [isCat, setIsCat] = useState(false);
    const [isFemale, setIsFemale] = useState(true);
    const [isMale, setIsMale] = useState(false);
    const [petAge, setPetAge] = useState("");
    const [petDateOfBirth, setPetDateOfBirth] = useState("");
    const [petImages, setPetImages] = useState([]);
    const [petDescription, setPetDescription] = useState("");
    const [countiesWithCities, setCountiesWithCities] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState("");
    const [cityList, setCityList] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalBreedIsOpen, setModalBreedIsOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    const [tooltipBreedOpen, setTooltipBreedOpen] = useState(false);
    const toggleBreed = () => setTooltipBreedOpen(!tooltipBreedOpen);

    const [nameImageURL, setNameImageURL] = useState("");
    const [breedImageURL, setBreedImageURL] = useState("");

    const [temperament, setTemperament] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [careNeeds, setCareNeeds] = useState("");
    const [noiseLevel, setNoiseLevel] = useState("");
    const [goodWithKids, setGoodWithKids] = useState("");
    const [goodWithPets, setGoodWithPets] = useState("");

    useEffect(() => {
        setCountiesWithCities(counties_with_cities);
        setToken(localStorage.getItem("jwtToken"));
        if (localStorage.getItem("jwtToken")) {
            const userResponse = UserService.getUserByToken(localStorage.getItem("jwtToken")).then((response) => {
                if (response.status === 200) {
                    setUser(response.data);
                }
            }).catch((error) => {
                alert("A aparut o eroare la incarcarea datelor utilizatorului.");
            });
        }
    }, []);

    useEffect(() => {
        if (AuthenticationService.isUserLoggedIn() === false || AuthenticationService.isTokenExpired(localStorage.getItem("jwtToken")) === true) {
            navigate("/login");
        }
    }, [navigate]);

    const openModal = (e) => {
        e.preventDefault();
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openBreedModal = (e) => {
        e.preventDefault();
        setModalBreedIsOpen(true);
    };

    const closeBreedModal = () => {
        setModalBreedIsOpen(false);
    };

    const handleNameChange = (name) => {
        setPetName(name);
    };

    const handleGeneratedNameChange = (data) => {
        setPetName(data.name);
        setNameImageURL(data.imageURL);
    }

    const handleBreedChange = (data) => {
        setPetBreed(data.breed);
        setTemperament(data.temperament);
        setActivityLevel(data.activityLevel);
        setCareNeeds(data.careNeeds);
        setNoiseLevel(data.noiseLevel);
        setGoodWithKids(data.goodWithKids);
        setGoodWithPets(data.goodWithPets);
        setBreedImageURL(data.imageURL);
    };

    const handleCountyChange = (e) => {
        if (e.target.value === "Alege Judetul") {
            setSelectedCounty("");
            setCityList([]);
            return;
        }
        setSelectedCounty(e.target.value);
        const cities = countiesWithCities.filter((county) => county.county_name === e.target.value);
        setCityList(cities[0].cities);
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const maxFiles = 10;
        const maxFileSize = 5 * 1024 * 1024;
        if (files.length > maxFiles) {
            alert("Poti incarca maxim 10 poze.");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxFileSize) {
                alert("Fisierul " + files[i].name + " are dimensiunea prea mare. Dimensiunea maxima este de 5MB.");
                return;
            }
        }
        setPetImages(files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (petName.length === 0 || petBreed.length === 0 || (isDog === false && isCat === false) || (isFemale === false && isMale === false) || selectedCounty.length === 0 || selectedCity.length === 0 || petDescription.length === 0 || petImages.length === 0) {
            alert("Toate campurile sunt obligatorii.");
            return;
        }

        setIsLoading(true);

        const petType = isDog ? "Caine" : "Pisica";
        const petSex = isFemale ? "Femela" : "Mascul";

        let petRequest = {};

        if (petAge.length === 0 && petDateOfBirth.length === 0) {
            petRequest = {
                name: petName,
                petType: petType,
                breed: petBreed,
                judet: selectedCounty,
                oras: selectedCity,
                description: petDescription,
                age: null,
                birthDate: null,
                sex: petSex,
                temperament: temperament,
                activityLevel: activityLevel,
                careNeeds: careNeeds,
                noiseLevel: noiseLevel,
                goodWithKids: goodWithKids,
                goodWithPets: goodWithPets
            };
        } else if (petAge.length !== 0) {
            petRequest = {
                name: petName,
                petType: petType,
                breed: petBreed,
                age: petAge,
                judet: selectedCounty,
                oras: selectedCity,
                description: petDescription,
                birthDate: null,
                sex: petSex,
                temperament: temperament,
                activityLevel: activityLevel,
                careNeeds: careNeeds,
                noiseLevel: noiseLevel,
                goodWithKids: goodWithKids,
                goodWithPets: goodWithPets
            };
        } else if (petDateOfBirth.length !== 0) {
            const currentDate = new Date();
            const formattedDate = petDateOfBirth.split("-").join("-");
            const calculatedAge = currentDate.getFullYear() - new Date(formattedDate).getFullYear();

            petRequest = {
                name: petName,
                petType: petType,
                breed: petBreed,
                age: calculatedAge,
                birthDate: formattedDate,
                judet: selectedCounty,
                oras: selectedCity,
                description: petDescription,
                sex: petSex,
                temperament: temperament,
                activityLevel: activityLevel,
                careNeeds: careNeeds,
                noiseLevel: noiseLevel,
                goodWithKids: goodWithKids,
                goodWithPets: goodWithPets
            };
        }
        PetService.postPet(petRequest, token).then((response) => {
            if (response.status === 200) {
                PetService.uploadPetImages(response.data.id, petImages, token).then((response) => {
                    if (response.status === 200) {
                        PetService.setPetUser(response.data.id, user.id, token).then((response) => {
                            if (response.status === 200) {
                                setIsLoading(false);
                                navigate("/");
                            }
                        }).catch((error) => {
                            setIsLoading(false);
                            alert("A aparut o eroare la adaugarea animalului in lista de animale.");
                        });
                    }
                }).catch((error) => {
                    setIsLoading(false);
                    alert("A aparut o eroare la incarcarea pozelor.");
                });
            }
        }).catch((error) => {
            setIsLoading(false);
            alert("A aparut o eroare la postarea animalului.");
        });

    };

    return (
        <div className="post-pet-container">
            {isLoading ? (
                <div className="loading-container">
                    <Spinner className="large-spinner" style={{ width: '3rem', height: '3rem' }} />
                </div>
            ) : (
                <div>
                    <h1 className="post-pet-title">Postează un Animăluț</h1>
                    <Form>
                        <FormGroup className="name-input-group">
                            <Label for="petName">Nume</Label>
                            <div className="name-action-container">
                                <Input
                                    type="text"
                                    value={petName}
                                    name="petName"
                                    id="petName"
                                    placeholder="Numele animalului"
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                                <button id="generate-name-btn" onClick={(e) => openModal(e)} className="generate-name-btn">Genereaza nume</button>
                                <Tooltip placement="bottom" isOpen={tooltipOpen} target="generate-name-btn" toggle={toggle}>
                                    Generează un nume pentru animăluțul tău, folosindu-se de inteligența artificială pentru a detecta culorile sale 
                                    și a căuta nume utilizate pentru animale de culorile respective pe forumuri populare.
                                </Tooltip>
                                <GenerateNameModal token={token} petType={isDog ? "dog" : "cat"} onData={handleGeneratedNameChange} isOpen={modalIsOpen} onRequestClose={closeModal} />
                                
                            </div>
                            {
                                nameImageURL.length > 0 ? (
                                    <img src={nameImageURL} alt="Generated Name Image" className="generated-name-image" />
                                ) : null
                            }
                        </FormGroup>
                        {' '}
                        <FormGroup check>
                            <Input
                                name="radio1"
                                type="radio"
                                defaultChecked={true}
                                onClick={() => { setIsDog(true); setIsCat(false) }}
                                className="input-color"
                            />
                            {' '}
                            <Label check>
                                Caine
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Input
                                name="radio1"
                                type="radio"
                                onClick={() => { setIsCat(true); setIsDog(false) }}
                                className="input-color"
                            />
                            {' '}
                            <Label check>
                                Pisica
                            </Label>
                        </FormGroup>
                        {' '}
                        <FormGroup check>
                            <Input
                                name="radio2"
                                type="radio"
                                defaultChecked={true}
                                onClick={() => { setIsFemale(true); setIsMale(false) }}
                                className="input-color"
                            />
                            {' '}
                            <Label check>
                                Femela
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Input
                                name="radio2"
                                type="radio"
                                onClick={() => { setIsMale(true); setIsFemale(false) }}
                                className="input-color"
                            />
                            {' '}
                            <Label check>
                                Mascul
                            </Label>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="petBreed">Rasa</Label>
                            <div className="breed-action-container">
                                <Input type="text" name="petBreed" id="petBreed" value={petBreed} placeholder="Rasa animalului" onChange={(e) => setPetBreed(e.target.value)} />
                                <button id="predict-breed-btn" onClick={(e) => openBreedModal(e)} className="predict-breed-btn">Detecteaza Rasa</button>
                                <Tooltip placement="bottom" isOpen={tooltipBreedOpen} target="predict-breed-btn" toggle={toggleBreed}>
                                    Detectează rasa animăluțului tău, folosindu-se de inteligența artificială pentru a observa trasaturile sale 
                                    si a căuta rasa care se potrivește cel mai bine. Alegeti tipul animalului corespunzator pentru a obține rezultate mai precise.
                                </Tooltip>
                                <PredictBreedModal token={token} petType={isDog ? "dog" : "cat"} onData={handleBreedChange} isOpen={modalBreedIsOpen} onRequestClose={closeBreedModal} />
                            </div>
                            {
                                breedImageURL.length > 0 ? (
                                    <img src={breedImageURL} alt="Predicted Breed Image" className="predicted-breed-image" />
                                ) : null
                            }
                        </FormGroup>
                        {' '}
                        <FormGroup switch>
                            <Input type="switch" role="switch" onClick={() => { setKnowsDateOfBirth(!knowsDateOfBirth) }} className="input-color" />
                            <Label check>Cunosc data de nastere a animalului.</Label>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="petAge">Varsta</Label>
                            <Input type="number" value={knowsDateOfBirth ? "" : petAge} min={0} name="petAge" id="petAge" placeholder="Varsta animalului" disabled={knowsDateOfBirth} onChange={(e) => { e.target.value >= 0 ? (setPetAge(e.target.value)) : (setPetAge(0)) }} />
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="petDateOfBirth">Data Nasterii</Label>
                            <Input type="date" value={knowsDateOfBirth ? petDateOfBirth : ""} max={new Date().toISOString().split('T')[0]} name="petDateOfBirth" id="petDateOfBirth" placeholder="Data Nasterii animalului" disabled={!knowsDateOfBirth} onChange={(e) => setPetDateOfBirth(e.target.value)} />
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="petCounty">
                                Judet
                            </Label>
                            <Input
                                id="petCounty"
                                name="petCounty"
                                type="select"
                                onChange={handleCountyChange}
                            >
                                <option>Alege Județul</option>
                                {countiesWithCities.map((county, index) => (
                                    <option key={index}>{county.county_name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="petCity">
                                Oraș
                            </Label>
                            <Input
                                id="petCity"
                                name="petCity"
                                type="select"
                                disabled={!selectedCounty}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option>Alege Orașul</option>
                                {cityList.map((city, index) => (
                                    <option key={index}>{city.nume}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="imageFiles">
                                Poze
                            </Label>
                            <Input
                                id="imageFiles"
                                name="imageFiles"
                                type="file"
                                multiple
                                accept=".jpg, .jpeg, .png"
                                onChange={handleImageChange}
                            />
                            <FormText>
                                Alege între 1 si 10 poze cu animalul tău. Pozele pot avea dimensiunea maximă de 5MB.
                            </FormText>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="petDescription">
                                Descriere
                            </Label>
                            <Input
                                id="petDescription"
                                name="petDescription"
                                type="textarea"
                                onChange={(e) => setPetDescription(e.target.value)}
                            />
                        </FormGroup>
                        {' '}
                        {/* New Inputs for Additional Pet Attributes */}
                        <FormGroup>
                        <Label for="temperament">Temperament</Label>
                            <Input type="select" name="temperament" id="temperament" value={temperament} onChange={(e) => setTemperament(e.target.value)}>
                                <option value="">Alege Temperamentul</option>
                                <option value="active">Activ</option>
                                <option value="confident">Încrezător</option>
                                <option value="affectionate">Afectuos</option>
                                <option value="gentle">Blând</option>
                                <option value="curious">Curios</option>
                                <option value="energetic">Energic</option>
                                <option value="calm">Calm</option>
                                <option value="alert">Alert</option>
                                <option value="playful">Jucăuș</option>
                                <option value="friendly">Prietenos</option>
                                <option value="reserved">Reticent</option>
                                <option value="brave">Curajos</option>
                                <option value="happy">Fericit</option>
                                <option value="bold">Îndrăzneț</option>
                                <option value="independent">Independent</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="activityLevel">Nivel de activitate</Label>
                            <Input type="select" name="activityLevel" id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                                <option value="">Selectează nivelul de activitate</option>
                                <option value="low">Scăzut</option>
                                <option value="medium">Mediu</option>
                                <option value="high">Ridicat</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="careNeeds">Nevoi de îngrijire</Label>
                            <Input type="select" name="careNeeds" id="careNeeds" value={careNeeds} onChange={(e) => setCareNeeds(e.target.value)}>
                                <option value="">Selectează nivelul de îngrijire</option>
                                <option value="low">Scăzut</option>
                                <option value="medium">Mediu</option>
                                <option value="high">Ridicat</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="noiseLevel">Nivel de zgomot</Label>
                            <Input type="select" name="noiseLevel" id="noiseLevel" value={noiseLevel} onChange={(e) => setNoiseLevel(e.target.value)}>
                                <option value="">Selectează nivelul de zgomot</option>
                                <option value="low">Scăzut</option>
                                <option value="medium">Mediu</option>
                                <option value="high">Ridicat</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="goodWithKids">Bun cu copiii</Label>
                            <Input type="select" name="goodWithKids" id="goodWithKids" value={goodWithKids} onChange={(e) => setGoodWithKids(e.target.value)}>
                                <option value="">Selectează</option>
                                <option value="yes">Da</option>
                                <option value="no">Nu</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="goodWithPets">Bun cu alte animale</Label>
                            <Input type="select" name="goodWithPets" id="goodWithPets" value={goodWithPets} onChange={(e) => setGoodWithPets(e.target.value)}>
                                <option value="">Selectează</option>
                                <option value="yes">Da</option>
                                <option value="no">Nu</option>
                            </Input>
                        </FormGroup>
                        {' '}
                        <div className="submit-btn-container">
                            <Button onClick={handleSubmit} className="submit-button">
                                Submit
                            </Button>
                        </div>
                        {' '}
                    </Form>
                </div>
            )}
        </div>
    );
}
export default PostPet;
