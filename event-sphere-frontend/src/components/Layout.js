import React from 'react';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Layout = () => {
    const content = (
        <div className="component__layout__container">
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
                <Outlet />
            </div>
        </div>
    );

    return content;
}

export default Layout;
