var util     = require('util')
  , thingSvc = require('../services/thingSvc');



function ThingCtrl() { }
module.exports = new ThingCtrl();



ThingCtrl.prototype.list = function list(req, res, next) {
  var args = {
    paging: req.paging
  };

  thingSvc.list(args, function(err, result) {
    res.err = err;
    res.result = result;
    next();
  });

};


ThingCtrl.prototype.get = function get(req, res, next) {
  var thingId = req.param('thingId');  

  thingSvc.get(thingId, function(err, result) {
    res.err = err;
    res.result = result;
    next();
  });  

};


ThingCtrl.prototype.create = function create(req, res, next) {
  var body = req.body;

  thingSvc.create(body, function(err, result) {
    res.err = err;
    res.result = result;
    next();
  });

};


ThingCtrl.prototype.update = function update(req, res, next) {
  var thingId = req.param('thingId')
    , body = req.body

  body._id = thingId;
  thingSvc.update(body, function(err, result) {
    res.err = err;
    res.result = result;
    next();
  });

};


ThingCtrl.prototype.remove = function remove(req, res, next) {
  var thingId = req.param('thingId');  

  thingSvc.remove(thingId, function(err, result) {
    res.err = err;
    res.result = result;
    next();
  });

};  