const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0, 
        },
        hasChanged: {
            type: Boolean,
            default: false,
            
        }
    },
    {
        timestamps: true
    }
)



module.exports = mongoose.model('Comment', commentSchema)