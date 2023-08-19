const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["user"]
    },
    active: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: "https://i.imgur.com/L4OnEnK.png"
    },
    about:{
        type: String,
        default: "About me ..."
    },
    friends:{
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    requests:{
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    likedEvents:{
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
})

module.exports = mongoose.model('User', userSchema)