const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; // Schema constructor

const TravelRecordSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // The above ObjectId refers to the User model
    },
    country : {
        type: String,
        required: true
    },
    countryDetails:{
        type: Object 
    },
    weather: {
        type: Object, // Storing weather data as an object
    },
    exchangeRates:{
        type: Object, 
    },
    date: {
        type: Date,
        default: Date.now // Default to current date
    }
});

module.exports = mongoose.model('TravelRecord', TravelRecordSchema); // Exporting the model