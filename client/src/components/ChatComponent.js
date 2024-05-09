import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import WebsocketService from '../services/WebsocketService';

import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button, Input, InputGroup } from 'reactstrap';

import '../Styles/ChatComponent.css';
import UserService from '../services/UserService';

function ChatComponent(props) {
    const [activeTab, setActiveTab] = useState(props.openedRecipient || '');
    const activeTabRef = React.useRef(activeTab);
    const [corespondents, setCorespondents] = useState([]);
    const [corespondentUsernames, setCorespondentUsernames] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const auth = useAuth();

    useEffect(() => {
        if(props.openedRecipient) {
            console.log("Opened recipient:", props.openedRecipient);
            setActiveTab(props.openedRecipient);
        }
    }, []);

    useEffect(() => {
        activeTabRef.current = activeTab;
    }, [activeTab]);

    useEffect(() => {
        if (auth.user) {
        
            console.log("Fetching conversations for user:", auth.user.id);
            WebsocketService.getConversations(auth.user.id, auth.token).then(response => {
                console.log("Conversations:", response.data);
                if (response.data.length > 0) {
                    setCorespondents(response.data);
                    response.data.forEach(corespondent => {
                        UserService.getUsernameById(corespondent, auth.token).then(res => {
                            setCorespondentUsernames(prev => ({ ...prev, [corespondent]: res.data }));
                        });
                    });
                    if(props.openedRecipient) {
                        console.log("Opened recipient:", props.openedRecipient);
                        setActiveTab(props.openedRecipient);
                    } else {
                        setActiveTab(response.data[0]);
                    }
                    fetchMessages(response.data[0]);
                } else {
                    console.log("No conversations found.");
                }
            }).catch(err => console.error("Failed to fetch conversations:", err));

            WebsocketService.connect(auth.user.id, onMessageReceived, onConnected, onError);
        }
        return () => WebsocketService.disconnect();
    }, [auth.user]);

    
    useEffect(() => {
        if (corespondents.length > 0) {
            if(props.openedRecipient) {
                console.log("Opened recipient:", props.openedRecipient);
                setActiveTab(props.openedRecipient);
                fetchMessages(props.openedRecipient);
            }
            else{
                setActiveTab(corespondents[0]);
                fetchMessages(corespondents[0]);
            }
            
        }
    }, [corespondents]);
    

    const onMessageReceived = (message) => {
        console.log("Received message:", message);
        if (message.senderId === activeTabRef.current || message.receiverId === activeTabRef.current) {
            setMessages(prevMessages => [...prevMessages, message]);
        }
    };
    
    

    const onConnected = (frame) => {
        console.log("WebSocket Connected:", frame);
    };

    const onError = (error) => {
        console.error("WebSocket Error:", error);
    };

    const fetchMessages = (corespondentId) => {
        console.log("fetching messages", corespondentId);
        WebsocketService.getMessages(auth.user.id, corespondentId, auth.token).then(response => {
            setMessages(response.data);
            console.log("mesaje:", response.data);
        });
    };

    const isCurrentUser = (messageSenderId) => {
        return messageSenderId === auth.user.id;
    };


    const toggle = tabId => {
        if (activeTab !== tabId) {
            setActiveTab(tabId);
            setMessageInput('');
            fetchMessages(tabId);
        }
    };

    const handleSendMessage = () => {
        if (messageInput && activeTab) {
            console.log("aici", auth.user.id, activeTab, messageInput);
            WebsocketService.sendMessage(auth.user.id, activeTab, messageInput).then(() => {
                fetchMessages(activeTab);
                setMessageInput('');
            });
            
        }
    }

    if (activeTab === '') {
        return <div>Loading...</div>;
    }

    return (
        <div className='chatcomp-container'>
            <div className="vertical-nav">
                <Nav tabs>
                    {corespondents.map((corespondent) => (
                        <NavItem key={corespondent}>
                            <NavLink
                                className={activeTab === corespondent ? 'active' : ''}
                                onClick={() => toggle(corespondent)}
                            >
                                {corespondentUsernames[corespondent]}
                            </NavLink>
                        </NavItem>
                    ))}
                </Nav>
                <TabContent activeTab={activeTab} className='chat-tab-content'>
                    <TabPane tabId={activeTab}>
                        
                        <div className='chat-main-content'>     
                            <div className="chat-messages-container">
                                {messages.map((message, index) => (
                                    <Card 
                                        body 
                                        key={index}
                                        className={`message-card ${isCurrentUser(message.senderId) ? 'current-user' : ''}`}
                                    >
                                        <CardText>{message.content}</CardText>
                                        
                                        <CardText className='message-hour'>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</CardText>

                                    </Card>
                                ))}
                            </div>
                            

                            <InputGroup className='message-input-group'>
                                <Input placeholder="Scrie un mesaj..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                                <Button onClick={handleSendMessage}><i className="bi bi-send send-button-text"></i></Button>
                            </InputGroup>
                        </div>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
}

export default ChatComponent;
