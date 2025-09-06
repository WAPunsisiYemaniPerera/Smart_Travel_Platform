const mongoose = require('mongoose'); // Import mongoose for MongoDB interaction
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
    weather: {
        type: Object, // Storing weather data as an object
    },
    advisory:{
        type: Object, // Storing travel advisory data as an object
    },
    countryDetails: {
        type: Object, // Storing country details as an object
    },
    date: {
        type: Date,
        default: Date.now // Default to current date
    }
});

module.exports = mongoose.model('TravelRecord', TravelRecordSchema); // Exporting the model