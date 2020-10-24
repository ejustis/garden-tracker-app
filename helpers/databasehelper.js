const mongoose = require('mongoose');
const SunExposure = require('../models/sunexposure.model')

function connectToMongo(databaseUrl, newUrlParser=true, unifiedTopology=true){
    console.log("Connecting to mongodb: " + databaseUrl);
    mongoose.connect(databaseUrl, {useNewUrlParser: newUrlParser, useUnifiedTopology: unifiedTopology});

    let mongoConn = mongoose.connection;
    mongoConn.on('error', (error) => {
        console.error('Connection error: ' + error);
    });
    return mongoConn;
}

function addSunExposureData(gardenId_param, luxValue_param){
    let dataSample = new SunExposure({gardenId: gardenId_param, luxValue: luxValue_param, timeTaken: Date.now()});
    dataSample.save(function(err) {
        if(err) return console.error(err);
    });
}

module.exports = {
    connectToMongo: connectToMongo,
    addSunExposureData: addSunExposureData
}