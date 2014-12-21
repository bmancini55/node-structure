var Q           = require('q')
  , thingMapper = require('../data/thingMapper')
  , Thing       = require('../models/thing')
  , AppError    = require('../common/apperror')



module.exports.list = function list(args, next) {
  return thingMapper
    .list(args)
    .nodeify(next);
}



module.exports.get = function get(thingId, next) {
    
  // validate thingId exists
  if(!thingId) 
    return Q
    .reject(AppError.createInvalid('Invalid request, thingId is required'))
    .nodeify(next);
  
  // perform operation
  return thingMapper
    .get(thingId)
    .nodeify(next);
}



module.exports.create = function create(args, next) {  
  var thing = new Thing(args);

  function dbCreate() {
    return thingMapper.create(thing);
  }

  // update properties
  thing.created = new Date();
  thing.updated = new Date();
  
  // validate and perform operation
  return thing
    .validate()
    .then(dbCreate)
    .nodeify(next);
}



module.exports.update = function update(args, next) {  
  var thing = new Thing(args);

  function dbUpdate() {
    return thingMapper.update(thing);
  }

  // set properties
  thing.updated = new Date();

  // validate and perform operation
  thing
    .validate()
    .then(dbUpdate)
    .nodeify(next);  
}


module.exports.remove = function remove(thingId, next) {
  
  // perform operation
  thingMapper
    .remove(thingId)
    .nodeify(next);
}