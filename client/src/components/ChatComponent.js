import React, { useState } from 'react';

import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button } from 'reactstrap';

import '../Styles/ChatComponent.css';

function ChatComponent() {

    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    return (
        <div className='chatcomp-container'>
            <div className="vertical-nav">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === '1' ? 'active' : ''}
                            onClick={() => toggle('1')}
                        >
                            Placeholder 1
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === '2' ? 'active' : ''}
                            onClick={() => toggle('2')}
                        >
                            Placeholder 2
                        </NavLink>
                    </NavItem>
                    
                </Nav>
                <TabContent activeTab={activeTab} className='tab-content'>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                <Card body>
                                    <CardTitle>Placeholder 1</CardTitle>
                                    <CardText>Placeholder 1</CardText>
                                    <Button>Placeholder 1</Button>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <Card body>
                                    <CardTitle>Placeholder 2</CardTitle>
                                    <CardText>Placeholder 2</CardText>
                                    <Button>Placeholder 2</Button>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    
                </TabContent>
            </div>
        </div>
    );
}
export default ChatComponent;