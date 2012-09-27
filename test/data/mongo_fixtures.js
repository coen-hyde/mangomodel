var async = require('async')
  , monk = require('monk')
  , ObjectId = require('mongodb/node_modules/bson').ObjectID;

module.exports = {
  load: function(db, cb) {
    var documents = [];
    for (var num = 1; num <= 9; num = ++num) {
      documents.push({
        _id: ObjectId('aa000000000000000000000' + num),
        email: 'dumbarse-' + num + '@test.kondoot.com',
        created_at: new Date("2012-09-25T00:0" + num + ":00.000Z")
      });
    }
    
    var ants = db.get('ants');
    ants.drop(function() {
      async.forEach(documents, function(document, done) {
        ants.insert(document, done);
      }, cb);
    });
  }
};
