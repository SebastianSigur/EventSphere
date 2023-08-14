const mongoose = require('mongoose')

const event = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        content:{
            type: String,
            default: 'description...'
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        invited:{
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },
        public:{
            type: Boolean,
            default: false,
        },
        commentsAllowed:{
            type: Boolean,
            default: true,
        },
        img:{
            type: String,
            required: true,
        },
        likes:{
            type: Number,
            default: 0,
        },
        categories:{
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Event', event)