import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from 'react-redux'
import useTitle from "../../hooks/useTitle";
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import { useAddNewUserMutation } from "../users/UserApiSlice";

//Space for regex
const USER_REGEX = /^[A-Za-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/

const SignUp = ({onClose, onOpen}) => {

    
    const [addNewUser, {
        isLoading: isLoadingUser,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const userRef = useRef()
    const errRef = useRef()
    const [errMsg, setErrMsg] = useState('')
    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch()

    
    useEffect(() => {
        const noSpace = username.replace(/\s/g, '')
        setValidUsername(USER_REGEX.test(noSpace))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])


    useEffect(() => {
        if (isSuccess) {
            setPassword('')
            navigate('/')
        }
    }, [isSuccess, navigate])
    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const canSave = [validUsername, validPassword].every(Boolean) && !isLoadingUser
    
    const errClass = errMsg ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : 'form__input'
    const validPwdClass = !validPassword ? 'form__input--incomplete' : 'form__input'

    const onSaveUserClicked = async (e) => {
        if (canSave) {
            await addNewUser({ username, password })
            
            try {
                const { accessToken } = await login({ username, password }).unwrap()
                dispatch(setCredentials({ accessToken }))
                onClose()
                navigate('/')

            } catch (err) {
                if (!err.status) {
                    setErrMsg('No Server Response');
                } else if (err.status === 400) {
                    setErrMsg('Missing Username or Password');
                } else if (err.status === 401) {
                    setErrMsg('Unauthorized');
                } else {
                    setErrMsg(err.data?.message);
                }
                errRef.current.focus();
            }


        }
        else{
            setErrMsg('Invalid Username or Password');

        }
    }
    


    const handleBackdropClick = (event) => {
        if (event.target.classList.contains('my-modal')) {
            onClose();
        }
    };
    const content = (
        <div className="my-modal" onClick={handleBackdropClick}>
            <div className="modal-content">
            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>Create an account</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Sign In"
                        >
                            <FontAwesomeIcon icon={faSignInAlt} />
                        </button>
                    </div>
                </div>
                <div className={errClass} >{errMsg}</div>
                <label className="form__label" htmlFor="username">
                    Username:<span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={validUserClass}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password:<span className="nowrap">[4-20 chars incl. !@#$%]</span></label>
                <input
                    className={validPwdClass}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
            </form>
            <div className="signup-section">
                <p className="signup-text">Already have an account?</p>
                <Link onClick={()=>{onOpen(); onClose()}} className="signup-link">
                    Sign In
                </Link>
            </div>
            </div>
        </div>
    );

    return content;
};

export default SignUp;
