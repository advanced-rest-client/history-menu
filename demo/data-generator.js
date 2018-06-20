/* global chance */
const DataGenerator = {};
const methods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD'];
const methodsSize = methods.length - 1;

var LAST_TIME = Date.now();

function setMidninght(time) {
  var now = new Date(time);
  now.setMilliseconds(0);
  now.setSeconds(0);
  now.setMinutes(0);
  now.setHours(0);
  return now.getTime();
}

DataGenerator.genRequestObject = function() {
  var methodIndex = chance.integer({min: 0, max: methodsSize});
  var url = chance.url();
  LAST_TIME -= chance.integer({min: 1.8e+6, max: 8.64e+7});
  var time = LAST_TIME;
  var method = methods[methodIndex];
  var obj = {
    _id: setMidninght(time) + '/' + encodeURIComponent(url) + '/' + method,
    method: methods[methodIndex],
    url: url,
    headers: 'x-test: true',
    created: LAST_TIME,
    updated: LAST_TIME
  };
  return obj;
};

DataGenerator.generateRequests = function(size) {
  size = size || 25;
  var result = [];
  for (var i = 0; i < size; i++) {
    result.push(DataGenerator.genRequestObject());
  }
  return result;
};

DataGenerator.generateHistory = function(size) {
  var requests = DataGenerator.generateRequests(size);
  var db = new PouchDB('history-requests');
  return db.bulkDocs(requests);
};

DataGenerator.destroyData = function() {
  var db = new PouchDB('history-requests');
  return db.destroy();
};
