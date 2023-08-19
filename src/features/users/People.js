import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useGetUsersQuery } from './UserApiSlice';
import { useUpdateUserMutation } from './UserApiSlice';
import { useParams } from 'react-router-dom';
import { current } from '@reduxjs/toolkit';

const People = () => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const {
        data: users,
        isLoading: usersLoading,
        isSuccess: usersSuccess,
        isError: usersError,
        error: usersErrorData
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60*1000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [hasSentRequest, setHasSentRequest] = useState([]);
    // Function to accept a friend request
    const acceptRequest = async (user, requestId) => {
        const requestUser = users.entities[requestId]
        if(!user || !requestId || !requestUser) return;
        const updatedUser = {
            ...user,
            requests: user.requests.filter(request => request !== requestId && request !== ''),
            friends: [...user.friends, requestId].filter(item => item !== '')
        }
        console.log(updatedUser)
        const req1 = await updateUser(updatedUser)
        console.log(req1)
        const updatedRequestUser = {
            ...requestUser,
            friends: [...requestUser.friends, user.id]
        }
        const req2 = await updateUser(updatedRequestUser)
        if(req1.error || req2.error || true) {
            console.log(req1.error, req2.error)
        }
    };
  
    // Function to reject a friend request
    const rejectRequest = (user, requestId) => {
        if(!user || !requestId) return;
        const updatedUser = {
            ...user,
            requests: user.requests.filter(request => request !== requestId)
        }
        updateUser(updatedUser)
    };
    const addFriend = (user, friendId) => {
        setHasSentRequest([...hasSentRequest, friendId]);
        if(!user || !friendId) return;
        const friendRequestUser = users.entities[friendId]
        if(friendRequestUser.requests.includes(user.id)) return;
        const updatedUser = {
            ...friendRequestUser,
            requests: [...friendRequestUser.requests, user.id]
        }
        updateUser(updatedUser)
    };
    // Function to search for users
    const removeFriend = (user, friendId) => {
        if(!friendId) return;
        const friend = users.entities[friendId]
        const updatedUser = {
            ...friend,
            friends: friend.friends.filter(item => item !== current.id)
        }
        updateUser(updatedUser)
        const updatedCurrentUser = {
            ...user,
            friends: user.friends.filter(item => item !== friendId)
        }
        updateUser(updatedCurrentUser)
    };
    const { ids } = usersSuccess ? users : { ids: [] };
    const { id } = useParams();

    const searchUsers = query => {
        setSearchQuery(query);
        setSelectedUser(null); // Clear selected user
    };

    const allUsers = usersSuccess ? ids.map(id => users.entities[id]) : [];
    const filteredUsers = usersSuccess
        ? allUsers.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort(((a, b) => a.username.localeCompare(b.username)))
        .filter(user => (!user?.friends?.includes(id))&&(user?.id!==id)): [];
        
    
    const top5Users = filteredUsers.slice(0, 5); // Get the top 5 users
    

    
    let currentUser = users?.entities[id]
    //sort be username
    const requestedUsers = currentUser?.requests.filter(item => item !== '').map(item => users?.entities[item])
    const friends = currentUser?.friends.filter(item => item !== '').map(item => users?.entities[item])
    return (
      <div className="friends-container">
        <h2>Friend Requests</h2>
        {requestedUsers?.map(friend => (
          <div className="friends-container-main" key={friend.id}>
        
             
            <img src={friend.img} alt={friend.username} />
            <h3>{friend.username}</h3>
            <div className="friends-container-buttons">
                <button onClick={() => acceptRequest(currentUser, friend.id)}>Accept</button>
                <button onClick={() => rejectRequest(currentUser, friend.id)}>Reject</button>
            </div>
          </div>
        ))}
  
        <h2>Your Friends</h2>
        {friends?.map(friend => (
          <div className="friends-container-main" key={friend.id}>
        
             
            <img src={friend.img} alt={friend.username} />
            <h3>{friend.username}</h3>
            <div className="friends-container-buttons">
                <button onClick={() => removeFriend(currentUser, friend.id)}>Remove Friend</button>
            </div>
            
          </div>
        ))}
  
        <h1>Search People</h1>
            <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={e => searchUsers(e.target.value)}
            />
            <div className="friends-container" >
                <h1>Top 5 Results</h1>
                {top5Users.map(friend => (
                    <div className="friends-container-main" key={friend.id}>

                    <img src={friend.img} alt={friend.username} />
                    <h3>{friend.username}</h3>
                    <div className="friends-container-buttons">
                        <button disabled={hasSentRequest.includes(friend.id)} style = {{opacity: hasSentRequest.includes(friend.id) ? 0.5: 1}} onClick={() => addFriend(currentUser, friend.id)}>Send Friend Request</button>
                    </div>
                  </div>
                 
                ))}
                
            </div>
            
        </div>
    );
  };
  
  export default People;