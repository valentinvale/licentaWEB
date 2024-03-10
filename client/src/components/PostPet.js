import React, {useEffect, useState} from "react";
import AuthenticationService from "../services/AuthenticationService";
import UserService from "../services/UserService";
import PetService from "../services/PetService";
import { useNavigate } from "react-router-dom";
import { FormGroup } from "reactstrap";
import { Form, Label, Input,  Button, FormText} from "reactstrap";

import counties_with_cities from "../Resources/counties_with_cities.json";

function PostPet(props) {

    const navigate = useNavigate();

    const [token, setToken] = useState("");

    const [user, setUser] = useState({});

    const [knowsDateOfBirth, setKnowsDateOfBirth] = useState(false);

    const [petName, setPetName] = useState("");
    const [petBreed, setPetBreed] = useState("");
    const [isDog, setIsDog] = useState(true);
    const [isCat, setIsCat] = useState(false);
    const [petAge, setPetAge] = useState("");
    const [petDateOfBirth, setPetDateOfBirth] = useState("");
    const [petImages, setPetImages] = useState([]);
    const [petDescription, setPetDescription] = useState("");

    const [countiesWithCities, setCountiesWithCities] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState("");
    const [cityList, setCityList] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        setCountiesWithCities(counties_with_cities);
        setToken(localStorage.getItem("jwtToken"));
        const userResponse = UserService.getUserByToken(localStorage.getItem("jwtToken")).then((response) => {
            if(response.status === 200){
                setUser(response.data);
            }
        }).catch((error) => {
            alert("A aparut o eroare la incarcarea datelor utilizatorului.");
        }
        );
    }, []);

    useEffect(() => {
        if(AuthenticationService.isUserLoggedIn() == false || AuthenticationService.isTokenExpired(localStorage.getItem("jwtToken")) == true){
            navigate("/login");
        }
    }, [navigate]);


    const handleCountyChange = (e) => {
        if (e.target.value === "Alege Judetul") {
            setSelectedCounty("");
            setCityList([]);
            return;
        }
        setSelectedCounty(e.target.value);
        const cities = countiesWithCities.filter((county) => county.county_name === e.target.value);
        setCityList(cities[0].cities);
        console.log(cities[0].cities);
    }

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
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(user);
        if(petName.length === 0 || petBreed.length === 0 || (isDog === false && isCat === false)  || selectedCounty.length === 0 || selectedCity.length === 0 || petDescription.length === 0 || petImages.length === 0){
            alert("Toate campurile sunt obligatorii.");
            return;
        }

        console.log(petImages);
        
        const petType = isDog ? "Caine" : "Pisica";

        let petRequest = {};

        if(petAge.length === 0 && petDateOfBirth.length === 0){
            petRequest = {
                name: petName,
                petType: petType,
                breed: petBreed,
                judet: selectedCounty,
                oras: selectedCity,
                description: petDescription,
                age: null,
                birthDate: null
            }
        }
        else if(petAge.length !== 0){
            petRequest = {
                name: petName,
                petType: petType,
                breed: petBreed,
                age: petAge,
                judet: selectedCounty,
                oras: selectedCity,
                description: petDescription,
                birthDate: null
            }
        }
        else if(petDateOfBirth.length !== 0){

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
                description: petDescription
            }
        }
        PetService.postPet(petRequest, token).then((response) => {
            if(response.status === 200){
                alert("Animalul a fost postat cu succes.");
                console.log(response.data);
                PetService.uploadPetImages(response.data.id, petImages, token).then((response) => {
                    if(response.status === 200){
                        alert("Pozele au fost incarcate cu succes.");
                        PetService.setPetUser(response.data.id, user.id, token).then((response) => {
                            if(response.status === 200){
                                alert("Animalul a fost adaugat in lista ta de animale.");
                                navigate("/");
                            }
                        }).catch((error) => {
                            alert("A aparut o eroare la adaugarea animalului in lista ta de animale.");
                        });
                    }
                }).catch((error) => {
                    alert("A aparut o eroare la incarcarea pozelor.");
                });
            }
        }).catch((error) => {
            alert("A aparut o eroare la postarea animalului.");
        });

    }

    return (
        <div>
            <h1>Posteaza un Animalut</h1>
            <Form>
                <FormGroup>
                    <Label for="petName">Nume</Label>
                    <Input type="text" name="petName" id="petName" placeholder="Numele animalului" onChange={(e) => setPetName(e.target.value)} />
                </FormGroup>
                {' '}
                <FormGroup check>
                <Input
                    name="radio1"
                    type="radio"
                    defaultChecked={true}
                    onClick={() => {setIsDog(true); setIsCat(false)}}
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
                    onClick={() => {setIsCat(true); setIsDog(false)}}
                />
                {' '}
                <Label check>
                    Pisica
                </Label>
                </FormGroup>
                {' '}
                <FormGroup>
                    <Label for="petBreed">Rasa</Label>
                    <Input type="text" name="petBreed" id="petBreed" placeholder="Rasa animalului" onChange={(e) => setPetBreed(e.target.value)} />
                </FormGroup>
                {' '}
                <FormGroup switch>
                <Input type="switch" role="switch"  onClick={() => {setKnowsDateOfBirth(!knowsDateOfBirth)}} />
                <Label check>Cunosc data de nastere a animalului.</Label>
                </FormGroup>
                {' '}
                <FormGroup>
                    <Label for="petAge">Varsta</Label>
                    <Input type="number" value={knowsDateOfBirth ? "" : petAge} min={0} name="petAge" id="petAge" placeholder="Varsta animalului" disabled={knowsDateOfBirth} onChange={(e) => {e.target.value >= 0 ? (setPetAge(e.target.value)) : (setPetAge(0))}} />
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
                <option>Alege Judetul</option>
                {countiesWithCities.map((county, index) => (
                    <option key={index}>{county.county_name}</option>
                ))}
                </Input>
            </FormGroup>
            {' '}
            <FormGroup>
                <Label for="petCity">
                    Oras
                </Label>
                <Input
                id="petCity"
                name="petCity"
                type="select"
                disabled={!selectedCounty}
                onChange={(e) => setSelectedCity(e.target.value)}
                >
                <option>Alege Orasul</option>
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
                Alege intre 1 si 10 poze cu animalul tau. Pozele pot avea dimensioni maxime de 5MB.
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
            <Button onClick={handleSubmit}>
                Submit
            </Button>
            {' '}
        </Form>
        </div>
        
    );
}
export default PostPet;