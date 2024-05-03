import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import AuthenticationService from '../services/AuthenticationService';
import PetService from '../services/PetService';
import { useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button } from 'reactstrap';

import '../Styles/UserPage.css';
import PetListComponent from './PetListComponent';
import PetCardFrame from './PetCardFrame';
import ChatComponent from './ChatComponent';

function UserPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');  

    const [postedPets, setPostedPets] = useState([]);

    useEffect(() => {
        if (AuthenticationService.isUserLoggedIn() === false || AuthenticationService.isTokenExpired(localStorage.getItem("jwtToken")) === true) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (auth.user) {
            console.log("utilizator:", auth.userEmail);
            PetService.getPetsByUserId(auth.user.id, auth.token).then((response) => {
                console.log(response.data);
                setPostedPets(response.data);
            });
        }
    }, [auth.user]);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    return (
        <div className='container-flex'>
            <div className="vertical-nav">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === '1' ? 'active' : ''}
                            onClick={() => toggle('1')}
                        >
                            Informatii cont
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === '2' ? 'active' : ''}
                            onClick={() => toggle('2')}
                        >
                            Chat-uri
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === '3' ? 'active' : ''}
                            onClick={() => toggle('3')}
                        >
                            Anunturile tale
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === '4' ? 'active' : ''}
                            onClick={() => toggle('4')}
                        >
                            Animalutele tale
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className='tab-content'>
                    <TabPane tabId="1">
                        <div className='user-info'>
                            <p className='user-info-text'>Username: <i>{auth.user.username}</i></p>
                            <p className='user-info-text'>Email: <i>{auth.user.email}</i></p>
                            <p className='user-info-text'>Nume: <i>{auth.user.lastName}</i></p>
                            <p className='user-info-text'>Prenume: <i>{auth.user.firstName}</i></p>
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <ChatComponent />
                    </TabPane>
                    <TabPane tabId="3">
                        <div className='user-posted-pets'>
                            <PetCardFrame pets={postedPets} sm="12" md="8" lg="6" xl="4" />
                        </div>
                    </TabPane>
                    <TabPane tabId="4">
                        <Row>
                            <Col sm="12">
                                <h4>Tab 4 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
}
export default UserPage;
