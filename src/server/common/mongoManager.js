var mongodb = require('mongodb')
  , db
  , initialized = false;

/**
 * Initializes a Mongodb connection from a supplied configuration
 *
 * @param {object} config
 * @config {string} host
 * @return {mongodb.Db} returns the connected instance mongodb
 */
module.exports.initialize = function initialize(config) {
  mongodb.MongoClient.connect(config.url, function(err, database) {
    if(err) throw err;

    db = database;
    initialized = true;
  });
}

/**
 * Method for retrieving the current mongodb instance
 */
module.exports.getDb = function getDb() {
  if(!initialized) throw new Error('MongoDb must be initialized');
  return db;
}