import React, { useState } from "react";
import CommentMini from "./commentMini";

const dummyComments = [
    { owner: "Sebastian", content: "This is my dummy comment 1" },
    { owner: "user2", content: "This is my dummy comment 2" },
    { owner: "user3", content: "This is my dummy comment 3" },
    { owner: "user3", content: "This is my dummy comment 4" },
    { owner: "user3", content: "This is my dummy comment 5" },

    { owner: "user3", content: "This is my dummy comment 6" },
    { owner: "user3", content: "This is my dummy comment 7" },
    { owner: "user3", content: "This is my dummy comment 8" },
    { owner: "user3", content: "This is my dummy comment 9" },
    { owner: "user3", content: "This is my dummy comment 1" },
    { owner: "user3", content: "This is my dummy comment 2" },
    { owner: "user3", content: "This is my dummy comment 3" },
    { owner: "user3", content: "This is my dummy comment 4" },
    { owner: "user3", content: "This is my dummy comment 5" },
    { owner: "user3", content: "This is my dummy comment 6" },



];

const CommentsMini = ({ imageHeight }) => {
    const [userComment, setUserComment] = useState("");
    const [comments, setComments] = useState(dummyComments);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userComment.trim() !== "") {
            const newComment = { owner: "currentUser", content: userComment };
            setComments([...comments, newComment]);
            setUserComment("");
        }
    };

    const handleCommentChange = (e) => {
        setUserComment(e.target.value);
    };

    return (
        <div className="commentsMiniContainer-main" style={{height:imageHeight}}>
            <p>Comments</p>
        
            <div className="commentsMiniContainer">
                <div className="commentsList">
                    {comments.map((comment, index) => (
                        <CommentMini key={index} comment={comment} />
                    ))}
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
        </div>
    );
};

export default CommentsMini;
