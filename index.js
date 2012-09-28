var revalidator = require('revalidator')
  , moment = require('moment')
  , MonkCollection = require('monk/lib/collection');

var MangoModel = function(db, collection, modelDefinition) {
  if (db === null) {
    this.getDb = function() {
      return MangoModel.globalDb;
    }
  }
  else if (db.hasOwnProperty('driver')) {
    this.getDb = function() {
      return db;
    }
  }
  else {
    // db should be function that returns the actual db connection
    this.getDb = db;
  }

  this.modelDefinition = modelDefinition || {};
  this.modelDefinition.collection = collection;

  // Copy user defined methods on to model
  if (this.modelDefinition.hasOwnProperty('methods')) {
    for (var name in this.modelDefinition.methods) {
      this[name] = this.modelDefinition.methods[name].bind(this);
    }
  }
};

MangoModel.globalDb = null;
MangoModel.setDb = function(db) {
  this.globalDb = db;
};

MangoModel.models = {};

MangoModel.create = function(db, collection, modelDefinition) {
  if (typeof(arguments[0]) === 'string') {
    var modelDefinition = collection;
    var collection = db;
    var db = null;
  }
  
  MangoModel.models[collection] = new this(db, collection, modelDefinition);
  return MangoModel.models[collection];
};

MangoModel.model = function(collection) {
  if (MangoModel.models.hasOwnProperty(collection)) {
    return MangoModel.models[collection];
  }
}

MangoModel.prototype.getCollection = function() {
  return this.getDb().get(this.modelDefinition.collection);
};

MangoModel.prototype.validate = function(data) {
  var schema = {};
  if (this.modelDefinition.hasOwnProperty('schema')) {
    schema = this.modelDefinition.schema;
  }

  return revalidator.validate(data, schema);
};

// Copy across all functionality that Monk has
var collectionMethods = Object.keys(MonkCollection.prototype);

collectionMethods.forEach(function(name) {
  MangoModel.prototype[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    var collection = this.getCollection();
    var colFn = collection[name];
    colFn.apply(collection, args);
  }
});

module.exports = MangoModel;