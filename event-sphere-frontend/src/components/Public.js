import EventMini from '../features/events/eventMini';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt,faLock, faGlobe, faSearch } from '@fortawesome/free-solid-svg-icons';


const dummyEvents = [
    {
        title: "Event 1",
        image: "https://i.imgur.com/YHX1D29.jpg",
        about: "Description of Event 1",
        invited: ["https://i.imgur.com/ouXvRND.png", "https://i.imgur.com/ouXvRND.png"]
    },
    {
        title: "Event 2",
        image: "https://i.imgur.com/YHX1D29.jpg",
        about: "Description of Event 2",
        invited: ["https://i.imgur.com/ouXvRND.png", "https://i.imgur.com/ouXvRND.png"]
    },
    {
        title: "Event 2",
        image: "https://i.imgur.com/YHX1D29.jpg",
        about: "Description of Event 2",
        invited: ["https://i.imgur.com/ouXvRND.png", "https://i.imgur.com/ouXvRND.png"]
    },
    {
        title: "Event 2",
        image: "https://i.imgur.com/YHX1D29.jpg",
        about: "Description of Event 2",
        invited: ["https://i.imgur.com/ouXvRND.png", "https://i.imgur.com/ouXvRND.png"]
    },
    {
        title: "Event 2",
        image: "https://i.imgur.com/YHX1D29.jpg",
        about: "Description of Event 2",
        invited: ["https://i.imgur.com/ouXvRND.png", "https://i.imgur.com/ouXvRND.png"]
    },
    {
        title: "Event 2",
        image: "https://i.imgur.com/YHX1D29.jpg",
        about: "Description of Event 2",
        invited: ["https://i.imgur.com/ouXvRND.png", "https://i.imgur.com/ouXvRND.png"]
    },

    
    // Add more dummy events
];

const Public = () => {
    const [isPublic, setIsPublic] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('top');
    const events_list = dummyEvents.map(eventItem => <EventMini event={eventItem}/>);

    return (
        <div className="home-page">
            <div className="columns-container">
                <div className="left-column">
                    <div className="component__layout__navbar">
                        <div className="component__layout__logo">
                            <img src="/img/logo.jpg" alt="Logo" />
                        </div>
                        <div className="component__layout__nav-buttons">
                            <button>
                                <FontAwesomeIcon icon={faHome} />
                                Home
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faUser} />
                                Profile
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="component__layout__content">
                        {/* Outlet */}
                    </div>
                </div>
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
                    </div>
                    <div className="event-list">
                        {events_list}
                    </div>
                </div>
                <div className="right-column">
                    <div className="search-filters">
                        <div className="search-container">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-container">
                            <button
                                className={`filter-button ${filter === 'top' ? 'active' : ''}`}
                                onClick={() => setFilter('top')}
                            >
                                Top X
                            </button>
                            <button
                                className={`filter-button ${filter === 'new' ? 'active' : ''}`}
                                onClick={() => setFilter('new')}
                            >
                                New X
                            </button>
                            <button
                                className={`filter-button ${filter === 'friends' ? 'active' : ''}`}
                                onClick={() => setFilter('friends')}
                            >
                                Friends
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Public;