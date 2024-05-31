import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Input, Spinner, Label, FormGroup,  Col, Button } from 'reactstrap'
import { useAuth } from '../Context/AuthContext';
import WebsocketService from '../services/WebsocketService';
import UserService from '../services/UserService';
import EmailService from '../services/EmailService';

import '../Styles/GenerateNameModal.css';


Modal.setAppElement('#root');

function SendConfirmationModal({ isOpen, onRequestClose, petId, onData }) {

    const auth = useAuth();
    const [corespondentsIds, setCorespondentsIds] = useState([]);
    const [corespondentsUsernames, setCorespondentsUsernames] = useState([]);
    const [selectedCorespondentId, setSelectedCorespondentId] = useState('');
    const [selectedCorespondentUsername, setSelectedCorespondentUsername] = useState('');

    useEffect(() => {
        if (auth.user) {
            console.log("Fetching conversations for user:", auth.user.id);
            WebsocketService.getConversations(auth.user.id, auth.token).then(response => {
                console.log("Conversations:", response.data);
                if (response.data.length > 0) {
                    setCorespondentsIds(response.data);
                    response.data.forEach(corespondent => {
                        UserService.getUsernameById(corespondent, auth.token).then(res => {
                            setCorespondentsUsernames(prev => ({ ...prev, [corespondent]: res.data }));
                        });
                    });
                   
                } else {
                    console.log("No conversations found.");
                }
            }).catch(err => console.error("Failed to fetch conversations:", err));

        }
    }, [auth.user]);


    const handleSendConfirmation = () => {
        if (!selectedCorespondentId) {
            alert('Selectati un utilizator mai intai!');
            return;
        }
        
        EmailService.sendAdoptConfirmationEmail(selectedCorespondentId, petId, auth.token).then((response) => {
            console.log(response.data);
            // onData();
            onRequestClose();
        }).catch((error) => {
            alert('A aparut o eroare la trimiterea emailului');
            console.log(error);
        });

    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="react-modal-content"
            overlayClassName="react-modal-overlay"
        >
            <FormGroup row>
                <Label
                for="user-select"
                sm={2}
                >
                Utilizator
                </Label>
                <Col sm={10}>
                <Input
                    id="user-select"
                    name="select"
                    type="select"
                    value={selectedCorespondentId}
                    onChange={(e) => {
                    setSelectedCorespondentId(e.target.value);
                    setSelectedCorespondentUsername(corespondentsUsernames[e.target.value]);
                    }}
                >
                    {
                    corespondentsIds.map((id, index) => {
                        return (
                        <option key={index} value={id}>
                            {corespondentsUsernames[id]}
                        </option>
                        );
                    })
                    
                    }
                </Input>
                </Col>
            </FormGroup>
            <div className='confirm-button-div'>
                <Button className='confirm-button' onClick={handleSendConfirmation}>Trimite</Button>
            </div>
        </Modal>
    );
}
export default SendConfirmationModal;
