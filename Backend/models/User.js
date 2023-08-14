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
        default: ["Employee"]
    },
    active: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: "https://imgur.com/L4OnEnK"
    },
    about:{
        type: String,
        default: "About me ..."
    }
})

module.exports = mongoose.model('User', userSchema)