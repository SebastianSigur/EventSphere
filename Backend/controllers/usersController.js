const User = require('../models/User')
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');



// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()
    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    const usersWithUpdatedImages = users.map(user => {
        let base64Img = 'https://i.imgur.com/L4OnEnK.png';
        if (user.img && user.img.includes('Backend/images')) {
            const imagePath = user.img // Assuming the path is relative to server file
            try {
                const imageBuffer = fs.readFileSync(imagePath);
                const base64Image = imageBuffer.toString('base64');
                base64Img = `data:image/jpeg;base64,${base64Image}`;
            } catch (error) {
                // Handle error reading the image
                
                user.img = 'https://i.imgur.com/L4OnEnK.png'
            }
            return {...user, img: base64Img};
        }
        return user;
        
    });

    res.json(usersWithUpdatedImages);

}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, roles, img, about, active } = req.body

    // Confirm data
    if (!username ) {
        return res.status(400).json({ message: '"username" is required"'})
    }
    if (!password ) {
        return res.status(400).json({ message: '"password" is required"'})
    }
    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = {
        username,
        password: hashedPwd
    };
    
    if (Array.isArray(roles) && roles.length > 0) {
        const availableRoles = process.env.ROLES.split(',');
        const validRoles = roles.filter(role => availableRoles.includes(role))
        if (validRoles.length === roles.length) {
            userObject.roles = validRoles;
        }
        else{
            return res.status(400).json({ message: 'Invalid roles in list' })
        }
        
    }

    if (img) {
        userObject.img = img;
    }
    
    if (about) {
        userObject.about = about;
    }
    
    if (typeof active === 'boolean') {
        userObject.active = active;
    }

    
    
    
    

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, username,  password, roles, img, about, active, friends, requests, likedEvents } = req.body
    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' || !about || !img || !friends || !requests || !likedEvents) { 
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    //remove img key
    delete user.img
    user.username = username
    user.about = about
    user.roles = roles
    user.active = active
    user.friends = friends
    user.requests = requests
    user.likedEvents = likedEvents

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    let imagePath = null;


    if (img && img.startsWith('data:image/')) {
        const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        const imgExtension = img.split(';')[0].split('/')[1];
        const imgFileName = `${username}_${Date.now()}.${imgExtension}`;
        const imgPath = path.join(__dirname, '../images', imgFileName);

        try {
            fs.writeFileSync(imgPath, imgBuffer);
            imagePath = imgPath;
            user.img = imgPath
            if(user.img.length > 63*1024){
                console.log('Image too large')
                console.log(img.slice(0, 10))
                return res.status(400).json({ message: 'Image failed to save' })
            }
            const updatedUser = await user.save()
            res.json({ message: `${updatedUser.username} updated` })
            return
        } catch (error) {
            return res.status(500).json({ message: 'Image upload failed' });
        }
    }
    else{
        if(img.length > 63*1024){
            console.log('Image too large')
            console.log(img.slice(0, 10))
            return res.status(400).json({ message: 'Image failed to save' })
        }
        user.img = img
        const updatedUser = await user.save()
        
        res.json({ message: `${updatedUser.username} updated` })
    }
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }


    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Change to active
    user.active = false

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} deleted (set to false)`})
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}