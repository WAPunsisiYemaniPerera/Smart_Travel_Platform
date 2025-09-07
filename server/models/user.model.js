const mongoose = require('mongoose');

//blueprint of user
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            // Password is required only if the user does not have a googleId.
            return !this.googleId;
        }
    },
    googleId: {
        type: String
    }
});

//exporting the model
module.exports = mongoose.model('User', UserSchema);