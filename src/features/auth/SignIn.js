import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'

const SignIn = ({onClose, onOpen}) => {
    useTitle('techNotes: Sign In');

    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation()

    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // New state for error message
    const onUsernameChanged = e => {
        setError(null); // Clear any previous error
        setUsername(e.target.value);
    }
    const onPasswordChanged = e => {
        setError(null); // Clear any previous error
        setPassword(e.target.value);
    }

    const onSignInClicked = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            navigate('/')
            if (accessToken) {

                navigate('/');
                onClose()
                setError(null); // Clear any previous error
                console.log("Success: ", accessToken);
                
            }
            else {
                setError("Invalid username or password"); // Set error message
                console.log("Failure: Invalid username or password");
            }
        } catch (error) {
            // Handle API error
            setError("Invalid username or password"); // Set error message
            console.log("Failure: Invalid username or password");
            console.log("Error: ", error)
        }
    };
    const handleBackdropClick = (event) => {
        if (event.target.classList.contains('my-modal')) {
            onClose();
        }
    };
    const content = (
        <div className="my-modal" onClick={handleBackdropClick}>
            <div className="modal-content">
            <form className="form" onSubmit={(onSignInClicked)}>
                <div className="form__title-row">
                    <h2>Sign In</h2>
                    <div className="form__action-buttons" onC>
                        <button
                            className="icon-button"
                            title="Sign In"
                        >
                            <FontAwesomeIcon icon={faSignInAlt} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username:</label>
                <input
                    className="form__input"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password:</label>
                <input
                    className="form__input"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
            </form>
            <div className="error-message">
                    {error && <p className="error-text">{error}</p>}
            </div>
            <div className="signup-section">
                <p className="signup-text">Don't have an account?</p>
                <Link onClick={()=>{onClose(); onOpen()}} className="signup-link">
                    Sign Up
                </Link>
            </div>
            </div>
        </div>
    );

    return content;
};

export default SignIn;
