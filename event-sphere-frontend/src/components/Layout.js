import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt,faLock, faGlobe, faSearch, faSignInAlt, faUserGroup} from '@fortawesome/free-solid-svg-icons';
import { useNavigate }  from 'react-router-dom';
import useAuth from "../hooks/useAuth"
import SignIn from '../features/auth/SignIn';
import SignUp from '../features/auth/SignUp';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useGetUsersQuery } from '../features/users/UserApiSlice';
import UserSearchResults from '../features/users/UserSearchResults';
const Layout = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('top');
    const navigate = useNavigate();
    const { usernamem, status, id} = useAuth()
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const openSignInModal = () => setIsSignInModalOpen(true);
    const closeSignInModal = () => setIsSignInModalOpen(false);

    const openSignUpModal = () => setIsSignUpModalOpen(true);
    const closeSignUpModal = () => setIsSignUpModalOpen(false);
    
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })
    const handleFilterClick = newFilterValue => {
        dispatch({ type: "SET_FILTER", payload: newFilterValue }); // Dispatch action to update filter
      };

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

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
    if (filteredUsers.length > 5){
        filteredUsers = filteredUsers.slice(0,5)
    }
    const handleUserClick = (id) => {
        setSearchQuery('')
        navigate(`/users/${id}`);
    }
    const handleNewEventPress = () => {
        if(id){
            navigate(`create-event/${id}`)
        }
        else{
            openSignInModal()
        }
    }
    return (
        <div className="home-page">
            <div className="columns-container">
                <div className="left-column">
                    <div className="component__layout__navbar">
                        <div className="component__layout__logo" >
                            <img src="/img/logo.jpg" alt="Logo" />
                        </div>
                        <div className="component__layout__nav-buttons">
                            <button onClick={()=>navigate('/')}>
                                <FontAwesomeIcon icon={faHome} />
                                Home
                            </button>
                            <button onClick={()=>{
                                if(status==='guest'){
                                    openSignInModal()
                                }
                                else{
                                    navigate(`friends/${id}`)
                                }
                            }}>
                                <FontAwesomeIcon icon={faUserGroup} />
                                Friends
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faUser} />
                                Profile
                            </button>
                            <button onClick={()=>{
                                    if(status==='guest'){
                                        openSignInModal()
                                    }
                                    else{
                                        sendLogout()
                                    }
                                    
                                 }}>
                                <FontAwesomeIcon icon={status==='guest'? faSignInAlt : faSignOutAlt} />
                                {status==='guest'? " Sign Up / Log In" : "Logout"}
                            </button>
                        </div>
                        {
                        id?
                        <button className="Mini-user-login" onClick={()=>navigate(`users/${id}`)}>
                            <div>
                                <img src={user?.img} className="invited-img-container"/>
                                <p>{user?.username}</p>
                            </div>
                        </button>
                        :null
                        }
                        

                    </div>
                    
                </div>
                <Outlet />
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
                        <div className="user-search-results-container">
                            {
                                searchQuery.length > 0 && !usersLoading && !usersError && filteredUsers.length > 0 ?
                                <UserSearchResults users={filteredUsers} handleUserClick={handleUserClick}/>
                                : null
                            }
                            
                        </div>
                        <div>
                        
                        </div>
                        <div className="filter-container">
                            <button
                                className={`filter-button ${filter === 'top' ? 'active' : ''}`}
                                onClick={() => {setFilter('top');handleFilterClick('top')}}
                            >
                                Filter by: Top Posts
                            </button>
                            <button
                                className={`filter-button ${filter === 'old' ? 'active' : ''}`}
                                onClick={() => {setFilter('old');handleFilterClick('old')}}
                            >
                                Filter by: Oldest Posts
                            </button>
                            <button
                                className={`filter-button ${filter === 'new' ? 'active' : ''}`}
                                onClick={() => {setFilter('new');handleFilterClick('new')}}
                            >
                                Filter by: Newest Posts
                            </button>
                            <button
                                className={`filter-button ${filter === 'friends' ? 'active' : ''}`}
                                onClick={() => {setFilter('friends');handleFilterClick('friends')}}
                            >
                                Filter by: Your friends Posts
                            </button>
                        </div>
                        <div className="create-new-event">
                            <button className="plus-button" onClick={() => handleNewEventPress()}>
                                <span className="plus-icon">+</span>
                                <span className="button-text">Create New Post</span>
                            </button>
                        </div>
                    </div>
                </div>
                {
                    isSignInModalOpen?<SignIn onClose={closeSignInModal} onOpen={openSignUpModal}/>:null
                }
                {
                    isSignUpModalOpen?<SignUp onClose={closeSignUpModal} onOpen={openSignInModal}/>:null
                }
                
            </div>
        </div>
    );
}

export default Layout;
