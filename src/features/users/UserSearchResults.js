import React from 'react';
import { useNavigate } from 'react-router-dom';
const UserSearchResults = ({ users, handleUserClick }) => {

    const visibleUsers = users.slice(0, 5);
    const hiddenUsers = users.slice(5);
    const navigate = useNavigate();
    return(
    <div className="user-search-results">
        {visibleUsers.map(user => (
        <div key={user.id} className="user-search-result" onClick={() => handleUserClick(user.id)}>
            <img src={user.img} alt={user.username} />
            <p>{user.username}</p>
        </div>
        ))}

        {hiddenUsers.length > 0 && (
        <div className="user-search-result more-users">
            <p>More...</p>
        </div>
        )}
    </div>
    );
};

export default UserSearchResults;
