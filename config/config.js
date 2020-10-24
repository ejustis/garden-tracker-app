var config = {};

config.app = {};
config.database = {};

config.app.name = "Garden Tracker";
config.app.description = "Tracks the sun exposure on a garden plot throughout the day";

config.database.url = "mongodb://localhost:27017";
config.database.name = "gardentracker";
config.database.collection = "sunexposure";

config.gardenId = "sunny_plot";

module.exports = config;