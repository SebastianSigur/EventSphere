import React, { useState } from 'react';

const ImageModal = ({ isOpen, onClose, onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    if (selectedImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          onImageUpload(base64Image); // Pass the base64-encoded image data
          setSelectedImage(null);
          onClose();
        };
        reader.readAsDataURL(selectedImage);
      }
  };

  return (
    <div className={`user-modal ${isOpen ? 'open' : ''}`}>
      <div className="user-modal-content">
        <h2>Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ImageModal;
