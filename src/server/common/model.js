var util     = require('util')
  , _        = require('underscore')
  , Q        = require('q')  
  , AppError = require('./apperror');



function Model(args) {
  var self = this;

  if(args) {
    this._id = args._id || args.id;
    this.schema().properties.forEach(function(prop) {
      self[prop.name] = args[prop.name];      
    });
  }
}

module.exports = Model;


Model.create = function create(schema) {

  function NewModel(args) {
    Model.call(this, args);
  }

  util.inherits(NewModel, Model);

  NewModel.prototype.schema = function() {
    return schema;
  } 

  return NewModel;
}


Model.prototype.toClient = function toClient() {

  // create new 
  var client = {};

  // attach id at front
  client.id = this._id || this.id;

  // copy remaining properties
  _.extend(client, this);

  // delete internals
  delete client._id;

  return client;
}

Model.prototype.validate = function validate(next) {
  var deferred = Q.defer()
    , self = this
    , errors = [];
  
  nextTick(function() {        

    self.schema().properties.forEach(function(prop) {
      if(prop.required) {
        result = validateRequired(self, prop);
        if(result) errors.push(result);
      }
    });

    if(errors.length > 0) {
      deferred.reject(errors);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise.nodeify(next);
}

function validateRequired(obj, prop) {
  if(!obj[prop.name]) {
    return AppError.createValidation(prop.name + ' is required');
  }
}


function validateType(obj, prop) {
  // TODO implement
}