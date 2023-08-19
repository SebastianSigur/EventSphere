import React, { useState } from 'react';
const LoginModel = () => {
  const [showModal, setShowModal] = useState(true);

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <p>You aren't signed in.</p>
            <button className="logbutton" onClick={() => alert('Log in clicked')}>Log in</button>
            <button className="logbutton" onClick={() => alert('Sign up clicked')}>Sign up</button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModel;
