var Q       = require('q')
  , mongodb = require('mongodb');


function BaseMapper() {

}

module.exports = BaseMapper;


BaseMapper.prototype.createParser = function createParser(Type) {
  var deferred = new Q.defer();

  var parser = function(err, docs) {

    if(err) return deferred.reject(err);
    else {

      var result;

      // handle empty set
      if(docs === null || docs === undefined) {
        result = docs;
      }

      // handle an array
      else if(Array.isArray(docs)) {
        result = parseArray(Type, docs);

      } 

      // handle single object
      else if(docs && docs._id) {
        result = new Type(docs);
      }

      // handle from findOneAndModify or findOneAndDelete
      else if(docs.ok) {          
        if(docs.value) 
          result = new Type(docs.value);
        else
          result = null;
      }      

      // handle insert and insertOne
      else if(docs.result && docs.result.ok) {      
        result = parseArray(Type, docs.ops);        

        // convert to single object when single instance inserted
        if(docs.result.n === 1) {
          result = result[0];
        }
      }    
      return deferred.resolve(result);
    }
  };

  parser.promise = deferred.promise;
  return parser;
};

function parseArray(Type, docs) {
  return docs.map(function(doc) {
    return new Type(doc);
  });
}



BaseMapper.prototype.createUpdate = function createUpdate(instance) {
  
  var $update = {
      $set: {}
    };

  instance.schema().forEach(function(prop) {
    if(instance[prop.name]) {
      $update.$set[prop.name] = instance[prop.name];
    }  
  });

  return $update;
}


BaseMapper.prototype.createQueryById = function createIdQuery(instance) {

  var result;

  // handle string
  if(typeof(instance) === 'string') {
    result = { _id: new mongodb.ObjectID(instance) };
  }

  // handle object
  else if(typeof(instance) === 'object') {
    result = { _id: new mongodb.ObjectID(instance._id || instance.id) };
  }

  // handle ObjectID
  else if (instance instanceof mongodb.ObjectID) {
    result = { _id: instance };
  }

  // else
  else throw new Error('Unknown type for createIdQuery');  

  return result;

}