const express = require('express'); // Express framework
const router = express.Router();  // Router instance
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/user.model'); // User model

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

module.exports = router;