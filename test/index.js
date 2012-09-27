var should = require('should')
  , Monk = require('monk')
	, MangoModel = require('../index.js')
  , fixtures = require('./data/mongo_fixtures.js')
  , ObjectId = require('mongodb/node_modules/bson').ObjectID;

var db = Monk('127.0.0.1/mangomodel-test');

beforeEach(function(done) {
  fixtures.load(db, done);
  MangoModel.models = [];
  delete MangoModel.globalDb
});

describe('MangoModel', function(){
  it('should be able to forward method calls to monk', function(done){
    var Ants = new MangoModel(db, 'ants');

    Ants.findById('aa0000000000000000000003', function(err, doc) {
      should.not.exist(err);
      should.exist(doc);
      doc._id.should.eql(ObjectId('aa0000000000000000000003'));
      done();
    });
  });
  it('should be able to define model and retrieve it', function() {
    MangoModel.create(db, 'bugs');

    var Bugs = MangoModel.model('bugs');
    should.exist(Bugs);
    Bugs.modelDefinition.should.have.property('collection', 'bugs');
  });
  it('should be able to create a model with global db', function(done) {
    MangoModel.models.should.have.length(0);
    MangoModel.setDb(db);

    var Ants = MangoModel.create('ants');
    done();
    // Ants.findById('aa0000000000000000000004', function(err, doc) {
    //   should.not.exist(err);
    //   doc._id.should.eql(ObjectId('aa0000000000000000000004'));
    //   done();
    // });
  });
  it('should not be able to retrieve a model that does not exist', function() {
    var Worms = MangoModel.model('worms');
    should.not.exist(Worms);
  });
  it('should transfer methods from methods property onto model', function(done) {
    MangoModel.create(db, 'cats', {
      methods: {
        echo: function() {
          return this.modelDefinition.collection;
        }
      }
    });

    var Cats = MangoModel.model('cats');
    Cats.should.have.property('echo');
    Cats.echo().should.eql('cats');
    done();
  });
  it('should validate data', function(done) {
    var Dogs = MangoModel.create(db, 'dogs', {
      schema: {
        properties: {
          breed: {
            description: 'the breed of the dog'
          , type: 'string'
          , required: true
          }
        , name: {
            description: 'the name of the dog'
          , type: 'string'
          , required: true
          }
        }
      }
    });

    var result = Dogs.validate({});
    result.should.have.property('valid', false);
    result.should.have.property('errors');
    result.errors[0].should.have.property('property', 'breed');
    done();
  });
});