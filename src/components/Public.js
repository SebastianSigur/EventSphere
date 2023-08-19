import EventMini from '../features/events/eventMini';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt,faLock, faGlobe, faSearch } from '@fortawesome/free-solid-svg-icons';
import EventsList from '../features/events/EventsList';


const Public = () => {
    const [isPublic, setIsPublic] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('top');
    return (
        <div className="home-page">
            <div className="columns-container">
                
                <div className="main-column">
                    <div className="public-events">
                        <div className="toggle-container">
                            <button
                                className={`toggle-button ${isPublic ? 'active' : ''}`}
                                onClick={() => setIsPublic(true)}>
                                <FontAwesomeIcon icon={faGlobe} /> Public
                            </button>
                            <button
                                className={`toggle-button ${!isPublic ? 'active' : ''}`}
                                onClick={() => setIsPublic(false)}>
                                <FontAwesomeIcon icon={faLock} /> Private
                            </button>
                        </div>
                        {!isPublic? <div style={{color:"red"}}>Showing all posts you are invited to</div>: null}
                    </div>
                    
                    <EventsList isPublic={isPublic} />
                </div>

            </div>
        </div>
    );
};

export default Public;