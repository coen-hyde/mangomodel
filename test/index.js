var should = require('should')
  , Monk = require('monk')
  , _ = require('underscore')
	, MangoModel = require('../lib/mangomodel.js')
  , fixtures = require('./data/mongo_fixtures.js')
  , ObjectId = require('mongodb/node_modules/bson').ObjectID;

var db = Monk('127.0.0.1/mangomodel-test');

beforeEach(function(done) {
  fixtures.load(db, done);
  MangoModel.models = [];
});

describe('MangoModel', function(){
  it('should be able to forward method calls to monk', function(done){
    var Ants = new MangoModel(db, {
      collection: 'ants'
    });

    Ants.findById('aa0000000000000000000003', function(err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc._id.should.eql(ObjectId('aa0000000000000000000003'));
      done();
    });
  });
  it('should be able to define model and retrieve it', function() {
    MangoModel.create(db, {
      collection: 'bugs'
    });

    var Bugs = MangoModel.model('bugs');
    should.exist(Bugs);
    Bugs.modelDefinition.should.have.property('collection', 'bugs');
  });
  it('should not be able to retrieve a model that does not exist', function() {
    var Worms = MangoModel.model('worms');
    should.not.exist(Worms);
  });
});