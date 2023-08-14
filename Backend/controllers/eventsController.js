const User = require('../models/User')
const Event = require('../models/Event')
const bcrypt = require('bcrypt')

// @desc Get all events
// @route GET /events
// @access Private

const getAllEvents = async (req, res) => {
    // Get all events from MongoDB
    const events = await Event.find().lean().exec()

    // If no events 
    if (!events?.length) {
        return res.status(400).json({ message: 'No events found' })
    }

    res.json(events)
}

// @desc Create new event
// @route POST /events
// @access Private
const createNewEvent = async (req, res) => {
    const {title, content, owner, invited, public, commentsAllowed, img, likes, categories} = req.body

    // Confirm data
    if (!title ) {
        return res.status(400).json({ message: '"title" is required"'})
    }
    if (!owner){
        return res.status(400).json({ message: '"owner" is required"'})
    }
    if (!img){
        return res.status(400).json({ message: '"img" is required"'})
    }

    // Additional checks
    if (!Array.isArray(invited) && invited !== undefined) {
        return res.status(400).json({ message: '"invited" must be an array' });
    }

    if (!Array.isArray(categories) && categories !== undefined) {
        return res.status(400).json({ message: '"categories" must be an array' });
    }

    if (typeof public !== 'boolean' && public !== undefined) {
        return res.status(400).json({ message: '"public" must be a boolean' });
    }

    if (typeof commentsAllowed !== 'boolean' && commentsAllowed !== undefined) {
        return res.status(400).json({ message: '"commentsAllowed" must be a boolean' });
    }

    if ((!Number.isInteger(likes) || likes < 0) && likes !== undefined) {
        return res.status(400).json({ message: '"likes" must be a non-negative integer' });
    }

    
    const eventObject = {
        title, owner, img
    }
    //title, content, owner, invited, public, commentsAllowed, img, likes, categories
    if (content) {
        eventObject.content = content;
    }  
    if (Array.isArray(invited) && invited.length > 0) {
        eventObject.invited = invited;
    }
    if (typeof public === 'boolean') {
        eventObject.public = public;
    }
    if (typeof commentsAllowed === 'boolean') {
        eventObject.commentsAllowed = commentsAllowed;
    }
    if(likes){
        eventObject.likes = likes;
    }
    if (Array.isArray(categories) && categories.length > 0) {
        eventObject.categories = categories;
    }

    // Create and store new event
    const event = await Event.create(eventObject)

    if (event) { //created
        res.status(201).json({ message: `New event ${title} from user ${owner}created` })
    } else {
        res.status(400).json({ message: 'Invalid event data received' })
    }
}

// @desc Update a event
// @route PATCH /events/:id
// @access Private
const updateEvent = async (req, res) => {
    const { id, title, content, owner, invited, public, commentsAllowed, img, likes, categories } = req.body;

    // Confirm data 
    if(!id || !title || !content || !owner || !invited || !public || !commentsAllowed || !img || !likes || !categories){
        return res.status(400).json({ message: 'Invalid event data received' })
    }

    // Additional checks
    if (!Array.isArray(invited)) {
        return res.status(400).json({ message: '"invited" must be an array' });
    }
    if (!Array.isArray(categories)) {
        return res.status(400).json({ message: '"categories" must be an array' });
    }
    if (typeof public !== 'boolean') {
        return res.status(400).json({ message: '"public" must be a boolean' });
    }
    if (typeof commentsAllowed !== 'boolean') {
        return res.status(400).json({ message: '"commentsAllowed" must be a boolean' });
    }
    if (!Number.isInteger(likes) || likes < 0) {
        return res.status(400).json({ message: '"likes" must be a non-negative integer' });
    }
    
    const event = await Event.findById(id).exec()
    if (event.owner !== owner){
        return res.status(400).json({ message: 'Cannot change owner' })
    }
    if (!event) {
        return res.status(400).json({ message: 'Event not found' })
    }

    // Update event
    event.title = title; event.content = content; event.owner = owner; event.invited = invited; event.public = public; event.commentsAllowed = commentsAllowed; event.img = img; event.likes = likes; event.categories = categories;
    
    const updatedEvent = await event.save()
    


    res.json({ message: `Event ${updatedEvent.title} from  updated` })
}

module.exports ={
    getAllEvents,
    createNewEvent,
    updateEvent
}