const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware')
const TravelRecord = require('../models/travelRecord.model'); // Import TravelRecord model

//save a new travel record
router.post('/', [apiKeyMiddleware, authMiddleware], async (req, res) => {
    try {
        //get the details from the frontend
        const {
            country,
            weather,
            advisory,
            countryDetails
        } = req.body;

        //create a new travel record
        const newRecord = new TravelRecord({
            country,
            weather,
            advisory,
            countryDetails,
            user: req.user.id //get user id from auth middleware
        });

        //save the record to database
        const record = await newRecord.save();

        //send the saved record as response
        res.status(201).json(record);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//get route to see the saved records
router.get('/', [apiKeyMiddleware, authMiddleware], async (req,res)=>{
    try{
        const records = await TravelRecord.find({
            user: req.user.id
        }).sort({
            date: -1
        });
        res.json(records);
    }catch (err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router;