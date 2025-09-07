const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware')
const TravelRecord = require('../models/travelRecord.model'); // Import TravelRecord model

//save a new travel record
router.post('/', [apiKeyMiddleware, authMiddleware], async (req, res) => {
    try {
        // The exchangeRates section is now also retrieved from req.body.
        const { country, weather, countryDetails, exchangeRates } = req.body;

        // When creating a new record, the exchangeRates section is also added.
        const newRecord = new TravelRecord({
            country,
            weather,
            countryDetails,
            exchangeRates, 
            user: req.user.id
        });

        const record = await newRecord.save();
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
});

router.delete('/:id', [apiKeyMiddleware, authMiddleware], async (req, res) => {
    try {
        let record = await TravelRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ msg: 'Record not found' });
        }

        // Checking if this report is the relevant user (very important!)
        if (record.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await TravelRecord.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Record removed successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;