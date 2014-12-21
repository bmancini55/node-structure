var Q = require('q');


function func1(next) {
  var deferred = new Q.defer();
  deferred.resolve('blah');
  return deferred.promise.nodeify(next);
}

function func2(next) {
  var deferred = new Q.defer();
  deferred.resolve(blah);
  return deferred.promise.nodeify(next);
}

function func3(next) {
  return Q.promise(function(resolve, reject) {
    resolve(blah);
  })
  .nodeify(next);
}

function func4(next) {
  return new Promise(function(resolve, reject) {
    resolve("native");
  })
  .nodeify(next);
}

if(Promise) {
Promise.prototype.nodeify = function (nodeback) {
  if (nodeback) {
    this.then(function (value) {
      nextTick(function () {
        nodeback(null, value);
      });
    }, function (error) {
      nextTick(function () {
        nodeback(error);
      });
    });
  } else {
    return this;
  }
};
}


// func2(function(err) {
//   console.log(err);
// })

func1()
.then(function() { return func4(); })
.then(console.log, console.error);