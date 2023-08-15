import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CommentsMini from "../Comments/commentsMini"
import { useState } from "react"
const EventMini = ({event}) => {
    
    
    const [imgHeight, setImgHeight] = useState(0);
    return (
        
        <div className="event">
         <div className= "eventmini-user">
            <a className ="owner-event-mini-container" href="#" onClick={() => {}}>
                <img src="https://i.imgur.com/ouXvRND.png" alt="owner" />
            </a>
            <p>Sebastian Sigurdar</p>
            <a><FontAwesomeIcon icon={faRightFromBracket} /> 42</a>
         </div>
         <div className="event-mini-img-container">
            
         <h3>{event.title}</h3>
         <div className="event-image-comment-container">
            <div className="event-image-comments-wrapper">
                <img className="event-image-mini" src={event.image} alt='Event' 
                    onLoad={(e) => {
                        setImgHeight(e.target.clientHeight);
                    }}/>
                <CommentsMini imageHeight={imgHeight}/>
            </div>
         </div>
         
         </div>
        
        <p>{event.about}</p>
        <p>Invited:</p>
        <div className="invited-list">
            {event.invited.map((invitedImg) => (
                console.log(invitedImg),
                <a className="invited-img-container" href="#" onClick={() => {}}>
                    <img src={invitedImg} alt="Invited" />
                </a>
                
            ))}
        </div>
    </div>
    )
}

export default EventMini