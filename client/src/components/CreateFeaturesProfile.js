import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import AuthenticationService from "../services/AuthenticationService";
import "../Styles/AuthenticationPage.css";
import { useAuth } from "../Context/AuthContext";
import UserService from "../services/UserService";

function CreateFeaturesProfile(props) {
    const [activityLevel, setActivityLevel] = useState(0);
    const [hasChildren, setHasChildren] = useState(0);
    const [hasOtherPets, setHasOtherPets] = useState(0);
    const [hypoallergenic, setHypoallergenic] = useState(0);
    const [livingEnvironment, setLivingEnvironment] = useState(0);
    const [lowMaintenance, setLowMaintenance] = useState(0);
    const [personality, setPersonality] = useState(0);
    const [workSchedule, setWorkSchedule] = useState(0);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if(!auth){
            navigate("/login");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const features = {
            activityLevel,
            hasChildren,
            hasOtherPets,
            hypoallergenic,
            livingEnvironment,
            lowMaintenance,
            personality,
            workSchedule
        };

        UserService.updateUserFeatures(auth.user.id, features, auth.token)
    };

    const updateUserFeatures = (userId, activityLevel, hasChildren, hasOtherPets, hypoallergenic, lowMaintenance, personality, workSchedule) => {
        AuthenticationService.updateFeatures(userId, { activityLevel, hasChildren, hasOtherPets, hypoallergenic, lowMaintenance, personality, workSchedule })
            .then(response => {
                if (response.status === 200) {
                    alert("Features updated successfully");
                    navigate("/");
                } else {
                    alert("Failed to update features");
                }
            });
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Update Features</h1>
            <Form onSubmit={handleSubmit}>
                <FormGroup className="auth-form">
                    <Label for="activityLevel">Activity Level</Label>
                    <Input type="select" id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevel(parseInt(e.target.value))}>
                        <option value="0">Sedentary</option>
                        <option value="1">Moderately Active</option>
                        <option value="2">Very Active</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="hasChildren">Has Children</Label>
                    <Input type="select" id="hasChildren" value={hasChildren} onChange={(e) => setHasChildren(parseInt(e.target.value))}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="hasOtherPets">Has Other Pets</Label>
                    <Input type="select" id="hasOtherPets" value={hasOtherPets} onChange={(e) => setHasOtherPets(parseInt(e.target.value))}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="hypoallergenic">Hypoallergenic</Label>
                    <Input type="select" id="hypoallergenic" value={hypoallergenic} onChange={(e) => setHypoallergenic(parseInt(e.target.value))}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="lowMaintenance">Living Environment</Label>
                    <Input type="select" id="livingEnvironment" value={livingEnvironment} onChange={(e) => setLivingEnvironment(parseInt(e.target.value))}>
                        <option value="0">Apartment</option>
                        <option value="1">House With Yard</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="lowMaintenance">Low Maintenance</Label>
                    <Input type="select" id="lowMaintenance" value={lowMaintenance} onChange={(e) => setLowMaintenance(parseInt(e.target.value))}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="personality">Personality</Label>
                    <Input type="select" id="personality" value={personality} onChange={(e) => setPersonality(parseInt(e.target.value))}>
                        <option value="0">Introverted</option>
                        <option value="1">Extroverted</option>
                    </Input>
                </FormGroup>
                <FormGroup className="auth-form">
                    <Label for="workSchedule">Work Schedule</Label>
                    <Input type="select" id="workSchedule" value={workSchedule} onChange={(e) => setWorkSchedule(parseInt(e.target.value))}>
                        <option value="0">Full-time</option>
                        <option value="1">Part-time</option>
                        <option value="2">Remote</option>
                    </Input>
                </FormGroup>
                <div className="auth-center-container">
                    <Button type="submit" className="auth-btn">Submit</Button>
                </div>
            </Form>
        </div>
    );
}

export default CreateFeaturesProfile;
