import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import '../Styles/GenerateNameModal.css';

Modal.setAppElement('#root');

function GenerateNameModal({ isOpen, onRequestClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("No file uploaded");


 useEffect(() => {
    setFileName("No file uploaded");
    setSelectedFile(null);
 }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "Niciun fisier selectat");
  };

  const handleGenerateName = () => {
    if (!selectedFile) {
      alert('Please select an image file first.');
      return;
    }
    // Call the function to send the image to your Python service
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
      <h2>Genereaza un nume</h2>
      <div className='file-upload-container'>
        <label htmlFor='file-upload' className='react-modal-btn'>
          Incarca fisier
        </label>
        <input id='file-upload' type="file" onChange={handleImageChange} style={{ display: 'none' }} />
        <span className='file-name'>{fileName}</span>
        <button className='react-modal-btn' onClick={handleGenerateName}>Genereaza</button>
        <button className='react-modal-btn' onClick={onRequestClose}>Inchide</button>
      </div>
      
    </Modal>
  );
}

export default GenerateNameModal;
