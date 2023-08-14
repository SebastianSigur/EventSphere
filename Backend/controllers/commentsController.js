// owner, event, content, likes, hasChanged

const Event = require('../models/Event')
const User = require('../models/User')
const Comment = require('../models/Comment')

// @desc Get all comments
// @route GET /comments
// @access Private
const getAllComments = async (req, res) => {
    // Get all comments from MongoDB
    const comments = await Comment.find().lean().exec()

    // If no comments 
    if (!comments?.length) {
        return res.status(400).json({ message: 'No comments found' })
    }

    res.json(comments)
}

// @desc Create new comment
// @route POST /comments
// @access Private
const createNewComment = async (req, res) => {
    const { owner, event, content, likes, hasChanged } = req.body

    // Confirm data
    if (!owner ) {
            return res.status(400).json({ message: '"owner" is required"'})
    }
    if(!event){
        return res.sttus(400).json({message: "event is required"})
    }
    if (!content){
        return res.status(400).json({message: "content is required"})
    }

    // Additional checks
    if (!Number.isInteger(likes) || likes < 0) {
        return res.status(400).json({ message: '"likes" must be a non-negative integer' });
    }
    if (typeof hasChanged !== 'boolean' && hasChanged !== undefined) {
        return res.status(400).json({ message: '"hasChanged" must be a boolean' });
    }


    const commentObject = {
        owner, event, content
    };
    if (likes) {
        commentObject.likes = likes;
    }
    if (hasChanged) {
        commentObject.hasChanged = hasChanged;
    }

    // Create new comment
    const newComment = await Comment.create(commentObject)

    // If no comment created    
    if (!newComment) {
        return res.status(400).json({ message: 'Could not create comment' })
    }
    else{
        return res.status(201).json({ message: 'Comment created' })
    }
}

// @desc update comment
// @route PATCH /comments
// @access Private

const updateComment = async (req, res) => {
    const { id, owner, event, content, likes, hasChanged } = req.body

    // Confirm data
    if (!id || !owner || !event || !content || !likes || !hasChanged) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the comment exist to update?
    const comment = await Comment.findById(id).exec()

    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    // Update comment
    comment.owner = owner;
    comment.event = event;
    comment.content = content;
    comment.likes = likes;
    comment.hasChanged = hasChanged;

    // Save updated comment
    const updatedComment = await comment.save()

    // If no comment updated
    if (!updatedComment) {
        return res.status(400).json({ message: 'Could not update comment' })
    }

    res.json({ message: 'Comment updated' })
}

// @desc Delete comment
// @route DELETE /comments/:id
// @access Private
const deleteComment = async (req, res) => {
    const { id } = req.params

    if(!id){
        return res.status(400).json({message: "id is required"})
    }
    
    const comment = await Comment.findById(id).exec()

    // Does the comment exist to delete?
    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    // Delete comment
    const results = await comment.deleteOne()

    res.json({ message: 'Comment deleted' })

}

module.exports = {
    getAllComments,
    createNewComment,
    updateComment,
    deleteComment
}