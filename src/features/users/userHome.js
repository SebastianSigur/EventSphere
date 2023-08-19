import React, { useState } from 'react';
import { useGetUsersQuery } from './UserApiSlice';
import { useParams } from 'react-router-dom';
import EventsList from '../events/EventsList';
import useAuth from "../../hooks/useAuth";
import { useUpdateUserMutation } from './UserApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ImageModal from './ImageModal';
import axios from 'axios';
import Dropzone from 'react-dropzone';



const UserHome = () => {
    const { id: loggedInUserId } = useAuth();

    const { id } = useParams();
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    });
    const isCurrentUser = id === loggedInUserId;
    const isFriend = user?.friends.includes(loggedInUserId);


    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()


    const [isEditing, setIsEditing] = useState(false);
    const [editedAbout, setEditedAbout] = useState(user?.about);
    const [showImageModal, setShowImageModal] = useState(false); // State for showing image modal
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleImageClick = () => {
        // Open the image modal
        setShowImageModal(true);
    };
    const handleImageUpload = async (base64Image) => {
        // Logic to handle image upload
        setShowImageModal(false); // Close the modal after selecting an image
        
        // Read the selected image file as a base64 encoded data URL
    
        

        await updateUser({
            id: user.id,
            username: user.username, 
            password: user.password, 
            roles:user.roles, 
            active: user.active, 
            img: base64Image, 
            about: user.about,
            friends: user.friends,
            requests: user.requests,
            likedEvents: user.likedEvents,
        })
    };


    const handleSaveClick = async  () => {
        // Perform the saving logic here with editedAbout
        setIsEditing(false);
        const req  = await updateUser({
            id: user.id,
            username: user.username, 
            password: user.password, 
            roles:user.roles, 
            active: user.active, 
            img: user.img, 
            about: editedAbout,
            friends: user.friends,
            requests: user.requests,
            likedEvents: user.likedEvents,
            })
        if(req.error){
            console.log(req.error)
        }

    };
    
    // Check if id matches loggedInUserId
    
    return (
        <div className="user-container">
            <div className="user-info-container">
                <div className="user-profile">
                    <div
                        className={`profile-image ${isCurrentUser && "editable"}`}
                        onClick={isCurrentUser ? handleImageClick : undefined}
                    >
                        <img src={selectedImage || user?.img} alt="User Profile" />
                        {isCurrentUser && <FontAwesomeIcon icon={faEdit} className="edit-icon" />}
                    </div>
                </div>
                <div className="user-about">
                    <h3>About Me</h3>
                    {isEditing ? (
                        <div>
                            <textarea
                                value={editedAbout}
                                onChange={(e) => setEditedAbout(e.target.value)}
                            />
                            <button onClick={handleSaveClick}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <p>
                                {user?.about.length > 100
                                    ? user?.about.substring(0, 100) + '...'
                                    : user?.about}
                            </p>
                            {isCurrentUser && (
                                <button onClick={handleEditClick}>Edit</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ImageModal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                onImageUpload={handleImageUpload}
            />
            <div className="user-events">
                <h3>
                    {
                        isCurrentUser ? "My Events" : isFriend ? "Friend's Events" : "Public Events"
                    }
                    
                </h3>
                <EventsList userId={id} isPublic={true} showAll={isFriend}/>
            </div>
        </div>
    );
};

export default UserHome;
