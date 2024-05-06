import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import WebsocketService from '../services/WebsocketService';

import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button, Input, InputGroup } from 'reactstrap';

import '../Styles/ChatComponent.css';

function ChatComponent() {
    const [activeTab, setActiveTab] = useState('');
    const [corespondents, setCorespondents] = useState([]);
    const [messages, setMessages] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        if(auth.user){
            WebsocketService.getConversations(auth.user.id, auth.token).then(response => {
                console.log(response.data);
                setCorespondents(response.data);
                if (response.data.length > 0) {
                    setActiveTab(response.data[0].id);
                    fetchMessages(response.data[0].id);
                }
            });
        }
        
    }, [auth.user]);

    const fetchMessages = (corespondentId) => {
        WebsocketService.getMessages(auth.user.id, corespondentId, auth.token).then(response => {
            setMessages(response.data);
            console.log(response.data);
        });
    };

    const toggle = tabId => {
        if (activeTab !== tabId) {
            setActiveTab(tabId);
            fetchMessages(tabId);
        }
    };

    return (
        <div className='chatcomp-container'>
            <div className="vertical-nav">
                <Nav tabs>
                    {corespondents.map((corespondent) => (
                        <NavItem key={corespondent.id}>
                            <NavLink
                                className={activeTab === corespondent.id ? 'active' : ''}
                                onClick={() => toggle(corespondent.id)}
                            >
                                {corespondent.firstName + ' ' + corespondent.lastName}
                            </NavLink>
                        </NavItem>
                    ))}
                </Nav>
                <TabContent activeTab={activeTab} className='chat-tab-content'>
                    <TabPane tabId={activeTab}>
                        <Row>
                            <Col sm="12">
                                {messages.map((message, index) => (
                                    <Card body key={index}>
                                        <CardTitle tag="h5">{message.senderName}</CardTitle>
                                        <CardText>{message.content}</CardText>
                                    </Card>
                                ))}
                            </Col>
                        </Row>
                        <InputGroup className='message-input-group'>
                            <Input placeholder="Scrie un mesaj..." />
                            <Button><i className="bi bi-send send-button-text"></i></Button>
                        </InputGroup>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
}

export default ChatComponent;
