import React from "react";
import { useGetUsersQuery } from "../users/UserApiSlice";

const CommentMini = ({ comment }) => {
    
    const {user} = useGetUsersQuery('usersList', {
        selectFromResult: ({data}) => {
            return({
                user: data?.entities[comment.owner]
            })
        }
    })


    return (
        <div className="commentMini">
            <div className="commentOwner">
                <img src={user?.img} alt="User Comment"/>
                <p>{user?.username}</p>
            </div>
            <div className="commentContent">{comment.content}</div>
        </div>
    );
};

export default CommentMini;
