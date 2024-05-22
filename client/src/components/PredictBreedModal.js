import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Input, Spinner, Label, FormGroup } from 'reactstrap'

import '../Styles/GenerateNameModal.css';

import AIService from '../services/AIService';

Modal.setAppElement('#root');

function PredictBreedModal({ isOpen, onRequestClose, petType, token, onData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Niciun fisier selectat");
  const [isLoading, setIsLoading] = useState(false);
  const [predictedBreed, setPredictedBreed] = useState(null);
  const [language, setLanguage] = useState('en');


 useEffect(() => {
    setFileName("Niciun fisier selectat");
    setSelectedFile(null);
    setPredictedBreed(null);
    setIsLoading(false);
    setLanguage('en');
 }, []);

 useEffect(() => {
  if (predictedBreed) {
      onData(predictedBreed);
      setPredictedBreed(null);
      setLanguage('en');
  }
}, [predictedBreed, onData]);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "Niciun fisier selectat");
  };

  const handlePredictBreed = () => {
    if (!selectedFile) {
      alert('Alegeti o imagine mai intai!');
      return;
    }
    let selectedPetType = petType;
    try {
      setIsLoading(true);
      console.log(selectedPetType, token);
      AIService.predictPetBreed(selectedFile, selectedPetType, token).then((response) => {
        if(language === 'ro'){
          setPredictedBreed(response.data.breedRo);
        } else{
            setPredictedBreed(response.data.breed);
        }
      }).catch((error) => {
          alert('A aparut o eroare la detectarea rasei');
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
      contentLabel="Predict Pet Breed"
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
              <FormGroup>
                <Input type="select" name="language" id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">Engleza</option>
                  <option value="ro">Romana</option>
                </Input>
              </FormGroup>
              
              <button className='react-modal-btn' onClick={handlePredictBreed}>Detecteaza</button>
              <button className='react-modal-btn' onClick={onRequestClose}>Inchide</button>
            </div>
            
          </div>
        )}
      
    </Modal>
  );
}

export default PredictBreedModal;
