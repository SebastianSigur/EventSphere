import React from 'react';
import Modal from 'react-modal';

// Styles for the modal (you can customize these)
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    padding: '20px',
    textAlign: 'center',
    background: 'white',
    borderRadius: '8px',
  },
};

const SignInPopup = ({ isOpen, onClose, Text }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      <h2>{Text}</h2>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default SignInPopup;
