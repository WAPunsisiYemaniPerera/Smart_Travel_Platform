const express = require('express'); // Express framework
const router = express.Router();  // Router instance
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const passport = require('passport');
const User = require('../models/user.model'); // User model
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware

router.post('/signup', async (req,res) =>{
    // getting user data from frontend
    const {username, email, password} = req.body;

    try {
        //check if user already exists
        let user = await User.findOne({ email });

        if(user){
            //send error if user already exists
            return res.status(400).json({
                msg: 'User with this email already exists'
            })
        }

        //if user does not exist, create a new user
        user = new User({
            username,
            email,
            password
        });

        //hash the password before saving to database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // save the new user to database
        await user.save();

        //send success response
        res.status(201).json({
            msg: 'User registered successfully'
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

router.post('/login', async (req,res)=>{
    //get user data from frontend
    const {email, password} = req.body;

    try {
        //check if user exists
        let user = await User.findOne({ email});

        if(!user){
            //send error if user does not exist
            return res.status(400).json({
                msg: 'Invalid Credentials'
            });
        }

        //compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            //send error if password does not match
            return res.status(400).json({
                msg: 'Invalid Credentials'
            });
        }

        //if password matches, create a JWT token
        const payload = {
            user: {
                id: user.id //adding user id to token payload
            }
        };

        jwt.sign(
            payload, //payload
            process.env.JWT_SECRET, //secret key
            {expiresIn: '1h'}, //token expiry time
            (err, token)=> {
                if(err) throw err; //throw error if any
                res.json({ token }); //send token to frontend
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

// when GET request is sent to /api/auth/user
router.get('/user', authMiddleware, async (req,res)=>{
    try {
        // we can use req.user.id because authMiddleware adds user info to req object
        const user = await User.findById(req.user.id).select('-password'); //exclude password
        res.json(user); //send user data to frontend
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// The route that initiates the Google Login process
// GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// The callback route coming back from Google
// GET /api/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    // If the Google login is successful, the user's details are in req.user.
    // Now we will create our own JWT token for that user.
    const payload = { user: { id: req.user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect the user to the travel.html page on the frontend and provide the token in the URL.
    res.redirect(`http://localhost:5500/client/travel.html?token=${token}`);
});

//password changing route
router.post('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
        // find user from the database
        const user = await User.findById(req.user.id);

        // check whether the existing password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        // update the password after hashing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password changed successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route for deleting account
const TravelRecord = require('../models/travelRecord.model'); 

router.delete('/delete-account', authMiddleware, async (req, res) => {
    try {
        // deleting the all records of the user
        await TravelRecord.deleteMany({ user: req.user.id });
        
        // Deleting user account
        await User.findByIdAndDelete(req.user.id);

        res.json({ msg: 'Account deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;