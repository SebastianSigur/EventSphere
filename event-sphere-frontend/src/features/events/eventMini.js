import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CommentsMini from "../comments/commentsMini"
import { useState } from "react"
import { useGetEventsQuery } from "./EventApiSlice"
import CountdownBar from "../../components/CountdownBar"
import { useGetCommentsQuery } from "../comments/CommentApiSlice"
import { useGetUsersQuery } from "../users/UserApiSlice"

const EventMini = ({event, key}) => {
    
    

    const [imgHeight, setImgHeight] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
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
    let user = users?.entities[event?.owner]
    let invitedList
    
    if (usersSuccess){
        invitedList = event?.invited.map(invitedId => {
            return users?.entities[invitedId]
        })
        invitedList = invitedList.filter(invited => invited !== undefined)

    }

    const {
        data:allComments, 
        isLoading: commentsLoading,
        isSuccess: commentsSuccess,
        isError: commentsError,
        error: commentsErrorData
    } = useGetCommentsQuery('commentsList', {
        pollingInterval: 60*1000 ,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })
    //TODO: add error handling
    let comments
    if(commentsSuccess){
        const eventComments = allComments?.ids.filter(commentId => {
            return allComments.entities[commentId].event === event.id
        })
        comments = eventComments.map(commentId => {
            return allComments.entities[commentId]
        })
    }
    
    const navigate = useNavigate()

    return (
        
        <div className="event">
         <div className= "eventmini-user">
            <a className ="owner-event-mini-container"  href="" onClick={() => navigate(`/users/${user.id}`)}>
                <img src={user?.img} alt="owner" />
            </a>
            <p>{user?.username}</p>
            <a><FontAwesomeIcon icon={faRightFromBracket} /> {event.likes}</a>
         </div>
         <div className="event-mini-img-container">
            
            <h3>{event.title}</h3>
            <div className="event-image-comment-container">
                <div className="event-image-comments-wrapper">
                    <img className="event-image-mini" src={event.img} alt='Event' 
                        onLoad={(e) => {
                            setImgHeight(e.target.clientHeight);
                        }}/>
                    <CommentsMini comments = {comments} imageHeight={imgHeight} eventId={event.id}/>
                </div>
            </div>
         
        </div>
        <CountdownBar date={event.date} time={event.time} timezone={event.timezone}/>
        <p className="event-about">
            {showFullDescription
            ? event.content
            : event.content.substring(0, 200)}{event.content.length <= 200?"":"..."}
            {/* Display truncated description */}
            {event.content.length > 200 && !showFullDescription && (
            <a
                className="show-more-link"
                onClick={() => setShowFullDescription(true)}
            >
                Show More
            </a>
            )}
        </p>
        
        <p>Invited:</p>
        <div className="invited-list">
            {
                invitedList?.length === 0 ?
                <p>No one invited yet</p> :

            invitedList?.map((invited) => (
                <a className="invited-img-container"  onClick={() => {}}>
                    <img src={invited?.img} alt="Invited" />
                </a>
                
            ))}
        </div>
    </div>
    )
}

export default EventMini