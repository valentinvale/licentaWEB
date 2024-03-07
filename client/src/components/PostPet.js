import React, {useEffect, useState} from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import { FormGroup } from "reactstrap";
import { Form, Label, Input,  } from "reactstrap";

import counties_with_cities from "../Resources/counties_with_cities.json";

function PostPet(props) {

    const navigate = useNavigate();

    const [countiesWithCities, setCountiesWithCities] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState("");
    const [cityList, setCityList] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        setCountiesWithCities(counties_with_cities);
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

    return (
        <div>
            <h1>Post Pet</h1>
            <Form>
                <FormGroup>
                    <Label for="petName">Nume</Label>
                    <Input type="text" name="petName" id="petName" placeholder="Numele animalului" />
                </FormGroup>
                {' '}
                <FormGroup check>
                <Input
                    name="radio1"
                    type="radio"
                    defaultChecked={true}
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
                />
                {' '}
                <Label check>
                    Pisica
                </Label>
                </FormGroup>
                {' '}
                <FormGroup>
                    <Label for="petBreed">Rasa</Label>
                    <Input type="text" name="petBreed" id="petBreed" placeholder="Rasa animalului" />
                </FormGroup>
                {' '}
                <FormGroup>
                    <Label for="petDateOfBirth">Data Nasterii</Label>
                    <Input type="date" name="petDateOfBirth" id="petDateOfBirth" placeholder="Data Nasterii animalului" />
                </FormGroup>
                {' '}
                <FormGroup>
                    <Label for="petAge">Varsta</Label>
                    <Input type="number" name="petAge" id="petAge" placeholder="Varsta animalului" />
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
            <FormGroup>
                <Label for="petDescription">
                    Descriere
                </Label>
                <Input
                id="petDescription"
                name="petDescription"
                type="textarea"
                />
            </FormGroup>
            {' '}
        </Form>
        </div>
        
    );
}
export default PostPet;