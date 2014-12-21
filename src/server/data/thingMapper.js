var util       = require('util')
  , Q          = require('q')
  , mongodb    = require('mongodb')
  , conn       = require('../common/mongoManager')
  , BaseMapper = require('../common/baseMapper')
  , Thing      = require('../models/thing')  
  , ObjectID   = mongodb.ObjectID;



function Mapper() {
  BaseMapper.call(this);
}

util.inherits(Mapper, BaseMapper);




Mapper.prototype.list = function list(args, next) {
  var parser = this.createParser(Thing)
    , paging = args.paging
    , $query = { };    

  if(paging && paging.start && ObjectID.isValid(paging.start)) {
    $query._id = { $gt: new ObjectID(paging.start) };  
  }

  conn
    .getDb()
    .collection('things')
    .find($query)
    .skip(paging.skip)
    .limit(paging.pagesize)
    .toArray(parser);

  return parser
    .promise
    .nodeify(next);
}



Mapper.prototype.get = function get(thingId, next) {
  
  var parser = this.createParser(Thing)
    , $query;

  // return empty set for invalidate ID
  if(!ObjectID.isValid(thingId)) 
    return Q
    .resolve(null)
    .nodeify(next);

  // construct the query
  $query = this.createQueryById(thingId);

  // execute the query
  conn
    .getDb()
    .collection('things')
    .findOne($query, parser);

  return parser
    .promise
    .nodeify(next);
}



Mapper.prototype.create = function create(thing, next) {

  var parser = this.createParser(Thing);

  conn.getDb()
  .collection('things')
  .insert(thing, parser);

  return parser
    .promise
    .nodeify(next);
}



Mapper.prototype.update = function create(thing, next) {

  var parser = this.createParser(Thing)
    , $query 
    , $update
    , $options = { returnOriginal: false }

  // return empty set for invalid ID
  if(!ObjectID.isValid(thing._id)) 
    return Q
    .resolve(null)
    .nodeify(next);

  $query = this.createQueryById(thing);
  $update = this.createUpdate(thing);

  conn.getDb()
  .collection('things')
  .findOneAndUpdate($query, $update, $options, parser);

  return parser
    .promise
    .nodeify(next);
}



Mapper.prototype.remove = function remove(thingId, next) {
  var parser = this.parse(Thing)
    , $query;

  // return empty set for invalid ID
  if(!ObjectID.isValid(thingId)) 
    return Q
    .resolve(null)
    .nodeify(next);

  $query = this.createQueryById(thingId);

  conn.getDb()
  .collection('things')
  .findOneAndDelete($query, parser);

  return parser
    .promise
    .nodeify(next);
}


// Export instance
module.exports = new Mapper();
