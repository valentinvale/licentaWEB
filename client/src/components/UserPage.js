import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import AuthenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button } from 'reactstrap';

import '../Styles/UserPage.css';

function UserPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');  // Initialize the state to '1' for Tab1

    useEffect(() => {
        if (AuthenticationService.isUserLoggedIn() === false || AuthenticationService.isTokenExpired(localStorage.getItem("jwtToken")) === true) {
            navigate("/login");
        }
    }, [navigate]);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    return (
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
                    <Row>
                        <Col sm="12">
                            <h4>Tab 1 Contents</h4>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                            <h4>Tab 2 Contents</h4>
                        </Col>
                        
                    </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col sm="12">
                            <h4>Tab 3 Contents</h4>
                        </Col>
                    </Row>
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
    );
}
export default UserPage;
