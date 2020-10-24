const mongoose = require('mongoose');

let sunExposureSchema = new mongoose.Schema({
    gardenId: {
        type: String,
        required: true
    },
    timeTaken: {
        type: Date, 
        default: Date.now()
    },
    luxValue: {
        type: Number,
        required: true
    }
});

let SunExposure = mongoose.model('SunExposure', sunExposureSchema);
module.exports = SunExposure;