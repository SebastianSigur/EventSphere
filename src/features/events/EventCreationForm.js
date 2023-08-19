import React, { useState, useRef } from 'react';
import { useAddNewEventMutation } from './EventApiSlice';
import EventMini from './eventMini';
import { useGetUsersQuery } from '../users/UserApiSlice';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const EventCreationForm = ({ userId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([]); // Array of invited users
  const [searchQuery, setSearchQuery] = useState(''); // Search query for user filtering
  // ... other state variables for form fields
 
  const [createEvent, { isLoading, isSuccess, isError, error }] = useAddNewEventMutation(); // Initialize the mutation
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const contentTextAreaRef = useRef(null);
  const [isPublic, setIsPublic] = useState(false); // Public toggle state

  const id = useParams().id;
  const handleTextAreaChange = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setContent(event.target.value);
  };

  const handlePublicToggle = () => {
    setIsPublic((prevIsPublic) => !prevIsPublic);
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUserInvite = (user) => {
    setInvitedUsers((prevUsers) => [...prevUsers, user]);
  };
  const openUserModal = () => {
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };
  const handleRemoveInvitedUser = (userToRemove) => {
    setInvitedUsers((prevInvitedUsers) =>
      prevInvitedUsers.filter((user) => user.id !== userToRemove.id)
    );
  };
  const handleCreateNewEvent = async (e) => {
    e.preventDefault();
    
    const dateParts = date.split('-');
    const [year, month, day] = dateParts;
    const formattedDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
    // Call the mutation to create a new event
    const eventData = {
      title,
      content,
      img:image,
      date: formattedDate,
      owner: id,
      invited: invitedUsers.map((user) => user.id),
      time,
      public: isPublic,
    };

    try {
      const res = await createEvent(eventData);
      // Handle success
      if (res.error) {
        console.error('Error creating event - Reason', res.error);
      }
      else{
        alert('Event created successfully!');

        navigate(`/users/${id}`)
      }
    } catch (error) {
      // Handle error
      console.error('Error creating event - Reason', error);
    }
  };
  const {
    data: users,
    isLoading: usersLoading,
    isSuccess: usersSuccess,
    isError: usersError,
    error: usersErrorData
  } = useGetUsersQuery('usersList', {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
  })
  const {ids} = usersSuccess ? users: {ids:[]}

 
  let filteredUsers = ids
  if (searchQuery.length > 0){
      filteredUsers = ids?.filter(userId => users.entities[userId].username.toLowerCase().includes(searchQuery.toLowerCase()))
  }
  filteredUsers = filteredUsers.map(userId => ({
      id: userId,
      username: users.entities[userId].username,
      img: users.entities[userId].img

  }))
  
  const allFilled = title && content && image && date && time
  return (
    <div className="event-creation-form">
      <h2>Create New Event</h2>
      <form onSubmit={handleCreateNewEvent}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            ref={contentTextAreaRef}
            value={content}
            onChange={handleTextAreaChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>
        <div className="form-group">
        <label>Public</label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={handlePublicToggle}

        />
      </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Time (MM:HH)</label>
          <input
            type="text"
            value={time}
            pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
            onChange={(e) => setTime(e.target.value)}
            placeholder="Format: mm:hh (military time)"
            required
            
          />
        </div>
        <label>Invite Users</label>
        <input
          type="text"
          placeholder="Search users to invite..."
          value={searchQuery}xq

          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={openUserModal}>
          Select Users
        </button>
        {isUserModalOpen && (
        <div className="user-selection-modal">
          <div className="user-selection-content">
            <h3>Select Users to Invite</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="user-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="user-list-item">
                  <img src={user.img} alt={user.username} />
                  <p>{user.username}</p>
                  <button onClick={() => handleUserInvite(user)}>Invite</button>
                </div>
              ))}
            </div>
            <button onClick={closeUserModal}>Close</button>
          </div>
        </div>
        
      )}
       
       
       <div className="invited-users">
        {invitedUsers.map((user) => (
          <div key={user.id} className="invited-user">
            <img src={user.img} alt={user.username} />
            <p>{user.username}</p>
            <button onClick={() => handleRemoveInvitedUser(user)}>Remove</button>
          </div>
        ))}
      </div>
        <button type="submit" disabled={isLoading}>
          Create Event
        </button>
        {isSuccess && <p>Event created successfully!</p>}
        {isError && <p>Error creating event </p>}

      </form>
    </div>
  );
};

export default EventCreationForm;
