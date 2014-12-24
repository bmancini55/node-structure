var util      = require('util')
  , Q         = require('q')
  , _         = require('underscore')
  , AppError  = require('../common/apperror')
  , Model     = require('../common/model')
  , schema    = require('./thing.json')
  ;



var ThingModel = Model.create(schema);
module.exports = ThingModel;


// TODO clean up syntax here
ThingModel.prototype.toClient = function toClient() {

  var client = Model.prototype.toClient.call(this);

  // customize toClient goes here  

  return client;
}


// TODO clean up syntax here
ThingModel.prototype.validate = function validate(next) {
  
  var self = this;

  return Model.prototype.validate.call(this)
  .then(function(err) {

    // custom validations go here.
    // if (something) 
    //   plus.reject(AppError.createValidate('Blah is bad'));

    return null;
  })
  .nodeify(next);
}
