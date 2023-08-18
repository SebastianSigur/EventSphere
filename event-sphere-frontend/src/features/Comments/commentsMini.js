import React, { useState } from "react";
import CommentMini from "./commentMini";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SignInPopup from "../auth/signinPopup";
import { useAddNewCommentMutation } from "./CommentApiSlice";
const CommentsMini = ({ comments, imageHeight, eventId }) => {

    const { status, id } = useAuth()
    const [showPopup, setShowPopup] = useState(false);
    const [userComment, setUserComment] = useState("");
    const [eventComments, setEventComments] = useState(comments);
    const navigate = useNavigate();

    const [addNewComment, {
        isLoading: isLoadingComment,
        isSuccess: isSuccessComment,
        isError: isErrorComment,
        error: errorComment
    }] = useAddNewCommentMutation()

    
    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if(status != 'guest'){
            if (userComment.trim() !== "") {
                const newComment = { owner: id, content: userComment, event: eventId};
                
                const res = await addNewComment(newComment)
                if (!res.error) {
                    setUserComment("");
                }
                else{
                    console.log("Error: ", res.error)
                }
                

            }
        }
        else{
            setShowPopup(true)

        }
    };

    const handleCommentChange = (e) => {
        setUserComment(e.target.value);
    };
    let postComments = (<p>No comments on this post</p>)
    if (comments?.length > 0 && comments !== undefined){
        postComments = (
            comments?.map((comment, index) => (
                <CommentMini key={index} comment={comment} />
            ))
        )
    }

    return (
        <div className="commentsMiniContainer-main" style={{height:imageHeight}}>

        
            <div className="commentsMiniContainer">
                <div className="commentsList">
                    {postComments}
                </div>
                
            </div>
            <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={userComment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                    />
                    <button type="submit">Submit</button>
                </form>
                {showPopup ? <SignInPopup setShowPopup={setShowPopup} /> : null}    

        </div>
    );
};

export default CommentsMini;
