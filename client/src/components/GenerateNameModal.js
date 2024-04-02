import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Input, Spinner, Label, FormGroup } from 'reactstrap'

import '../Styles/GenerateNameModal.css';

import AIService from '../services/AIService';

Modal.setAppElement('#root');

function GenerateNameModal({ isOpen, onRequestClose, petType, token, onData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Niciun fisier selectat");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedName, setGeneratedName] = useState(null);
  const [usePetType, setUsePetType] = useState(false);


 useEffect(() => {
    setFileName("Niciun fisier selectat");
    setSelectedFile(null);
    setGeneratedName(null);
    setIsLoading(false);
    setUsePetType(false);
 }, []);

 useEffect(() => {
  if (generatedName) {
      onData(generatedName);
      // Reset after calling to prevent duplicate calls if generatedName doesn't change
      setGeneratedName(null);
  }
}, [generatedName, onData]);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "Niciun fisier selectat");
  };

  const handleGenerateName = () => {
    if (!selectedFile) {
      alert('Alegeti o imagine mai intai!');
      return;
    }
    let selectedPetType = petType;
    if(!usePetType){
      selectedPetType = "pet";
    }
    try {
      setIsLoading(true);
      AIService.generatePetName(selectedFile, selectedPetType, token).then((response) => {
        console.log(response.data);
        setGeneratedName(response.data.petName);
      }).catch((error) => {
          alert('A aparut o eroare la generarea numelui');
          setIsLoading(false);
      }).finally(() => {
          setSelectedFile(null);
          setFileName("Niciun fisier selectat");
          setIsLoading(false);
          onRequestClose();
      });
    
    } catch (error) {
      alert('A aparut o eroare la generarea numelui');
      setIsLoading(false);
    }
    return;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Generate Pet Name"
      className="react-modal-content"
      overlayClassName="react-modal-overlay"
    >
      {isLoading ? 
      (
        <div className="file-upload-container" id='spinner-container'>
          <Spinner className="large-spinner" style={{ width: '20px', height: '20px' }}/> 
          {/* <p>Loading...</p> */}
        </div>) : 
        (
          <div>
            <h2>Genereaza un nume</h2>
            <div className='file-upload-container'>
              <label htmlFor='file-upload' className='react-modal-btn' id='file-upload-label'>
                Incarca fisier
              </label>
              <Input
                id="file-upload"
                name="pet-image"
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <span className='file-name'>{fileName}</span>
              <FormGroup switch>
                <Input className='input-color' type='switch' role='switch' onChange={() => setUsePetType(!usePetType)}></Input>
                <Label>Foloseste tipul animalului</Label>
              </FormGroup>
              
              <button className='react-modal-btn' onClick={handleGenerateName}>Genereaza</button>
              <button className='react-modal-btn' onClick={onRequestClose}>Inchide</button>
            </div>
            
          </div>
        )}
      
    </Modal>
  );
}

export default GenerateNameModal;
