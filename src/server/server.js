var express     = require('express')
  , bodyParser  = require('body-parser')
  , controllers = require('./controllers')  
  , mongoManager = require('./common/mongoManager')
  , configManager = require('./common/configManager')

  , Q = require('q')  

  , AppError = require('./common/apperror')

  , app         = express()
  , config = configManager.env();

mongoManager.initialize(config.mongodb);



app.use(bodyParser.json());

// paging support
app.get('/api/*', function(req, res, next) {

  var paging = req.paging = {
    start: req.query.start || null,
    page: Math.max(1, req.query.page || 1),
    pagesize: Math.max(1, Math.min(1000, req.query.pagesize || 25))    
  };
  paging.skip = (paging.page - 1) * paging.pagesize;
  
  next();
});


app.get    ('/api/things', controllers.thingCtrl.list);
app.post   ('/api/things', controllers.thingCtrl.create);
app.get    ('/api/things/:thingId', controllers.thingCtrl.get);
app.put    ('/api/things/:thingId', controllers.thingCtrl.update);
app.delete ('/api/things/:thingId', controllers.thingCtrl.remove);






































// TODO CLEAN THIS UP
// Finalization handler
app.all ('/api/*', function(req, res) {

  var err = res.err
    , result = res.result
    , hasValidation = false
    , hasInvalid = false;

  if(err) {

    if(Array.isArray(err)) {
      
      err.forEach(function(e) {
        
        console.log(e instanceof AppError);

        if(e instanceof AppError) {
          if(e.type === 'validation') {
            hasValidation = true;
          }
        }

        
      });

    }

    else {
      
    }

    if(hasInvalid) {
      return res.status(400).send(err);
    }

    if(hasValidation) {
      return res.status(422).send(err);
    }

    return res.status(500).send({message: err.message, stacktrace: err.stacktrace });
  }

  else if(result) { 

    var client;

    // perform the toClient conversion here for all objects

    if(Array.isArray(result)) {
      
      client = result.map(function(item) {
        return item.toClient();
      });      

    } else if(result.toClient) {      
      client = result.toClient();      
    }

    // check the verb used and respond appropriately:
    // 200 get/put
    // 201 post
    // 204 delete

    switch(req.method) {
    case 'GET':
      res.status(200).send(client);
      break;
    case 'PUT':
      res.status(200).send(client);
      break;
    case 'POST':
      res.status(200).send(client);
      break;
    case 'DELETE':
      res.status(204).end();
      client = null;
      break;
    }

  } else {
    res.status(404).send('404 Error: Requested item could not be found');
  }

})


app.listen(config.express.port, function(err) {
  console.log('Started express server at *:%d', config.express.port);
});