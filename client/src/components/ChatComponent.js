import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import WebsocketService from '../services/WebsocketService';
import { Nav, NavItem, NavLink, TabContent, TabPane, Card, CardText, Button, Input, InputGroup } from 'reactstrap';
import '../Styles/ChatComponent.css';
import UserService from '../services/UserService';

function ChatComponent(props) {
    const [activeTab, setActiveTab] = useState('');
    const activeTabRef = React.useRef(activeTab);
    const [corespondents, setCorespondents] = useState([]);
    const [corespondentUsernames, setCorespondentUsernames] = useState({});
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const auth = useAuth();

    useEffect(() => {
        if (props.openedRecipient) {
            setActiveTab(props.openedRecipient);
        }
    }, [props.openedRecipient]);

    useEffect(() => {
        activeTabRef.current = activeTab;
    }, [activeTab]);

    useEffect(() => {
        if (auth.user) {
            WebsocketService.getConversations(auth.user.id, auth.token)
                .then(response => {
                    if (response.data.length > 0) {
                        setCorespondents(response.data);
                        response.data.forEach(corespondent => {
                            UserService.getUsernameById(corespondent, auth.token)
                                .then(res => {
                                    setCorespondentUsernames(prev => ({ ...prev, [corespondent]: res.data }));
                                });
                        });
                        const initialTab = props.openedRecipient || response.data[0];
                        setActiveTab(initialTab);
                        fetchMessages(initialTab);
                    }
                })
                .catch(err => console.error("Failed to fetch conversations:", err));

            WebsocketService.connect(auth.user.id, onMessageReceived, onConnected, onError);
        }
        return () => WebsocketService.disconnect();
    }, [auth.user]);

    useEffect(() => {
        if (corespondents.length > 0) {
            const initialTab = props.openedRecipient || corespondents[0];
            setActiveTab(initialTab);
            fetchMessages(initialTab);
        }
    }, [corespondents]);

    const onMessageReceived = (message) => {
        const formattedMessage = formatMessageTimestamp(message);
        console.log("Received message:", formattedMessage);
        if (formattedMessage.senderId === activeTabRef.current || formattedMessage.receiverId === activeTabRef.current) {
            setMessages(prevMessages => [...prevMessages, formattedMessage]);
        } else {
            updateConversations();
        }
    };

    const formatMessageTimestamp = (message) => {
        return {
            ...message,
            timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
        };
    };

    const onConnected = (frame) => {
        console.log("WebSocket Connected:", frame);
    };

    const onError = (error) => {
        console.error("WebSocket Error:", error);
    };

    const updateConversations = () => {
        WebsocketService.getConversations(auth.user.id, auth.token)
            .then(response => {
                if (response.data.length > 0) {
                    setCorespondents(response.data);
                    response.data.forEach(corespondent => {
                        UserService.getUsernameById(corespondent, auth.token)
                            .then(res => {
                                setCorespondentUsernames(prev => ({ ...prev, [corespondent]: res.data }));
                            });
                    });
                }
            })
            .catch(err => console.error("Failed to fetch conversations:", err));
    };

    const fetchMessages = (corespondentId) => {
        WebsocketService.getMessages(auth.user.id, corespondentId, auth.token)
            .then(response => {
                const formattedMessages = response.data.map(formatMessageTimestamp);
                setMessages(formattedMessages);
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
            const message = {
                senderId: auth.user.id,
                receiverId: activeTab,
                content: messageInput,
                timestamp: new Date().toISOString()
            };
            WebsocketService.sendMessage(auth.user.id, activeTab, messageInput)
                .then(() => {
                    const formattedMessage = formatMessageTimestamp(message);
                    // setMessages(prevMessages => [...prevMessages, formattedMessage]);
                    setMessageInput('');
                });
        }
    };

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
                                        <CardText className='message-hour'>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</CardText>
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
