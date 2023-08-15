import React from "react";

const CommentMini = ({ comment }) => {
    return (
        <div className="commentMini">
            <div className="commentOwner">
                <img src="https://i.imgur.com/ouXvRND.png" alt="User Comment"/>
                <p>{comment.owner}</p>
            </div>
            <div className="commentContent">{comment.content}</div>
        </div>
    );
};

export default CommentMini;
