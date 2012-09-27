var _ = require('underscore')
	, revalidator = require('revalidator')
	, moment = require('moment')
	, MonkCollection = require('monk/lib/collection');

var MangoModel = function(db, modelDefinition) {
	if (_.isFunction(db)) {
    this.getDb = db;
  }
  else {
		this.getDb = function() {
			return db;
		}
	}
	this.modelDefinition = modelDefinition;
};

MangoModel.models = {};
MangoModel.create = function(db, modelDefinition) {
  MangoModel.models[modelDefinition.collection] = new this(db, modelDefinition);
};

MangoModel.model = function(name) {
  if (_.has(MangoModel.models, name)) {
    return MangoModel.models[name];
  }
}

MangoModel.prototype.getCollection = function() {
	return this.getDb().get(this.modelDefinition.collection);
};

MangoModel.prototype.validate = function(data) {
  // body...
};


_.each(MonkCollection.prototype, function(fn, name) {
  MangoModel.prototype[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    var collection = this.getCollection();
    var colFn = collection[name];
    colFn.apply(collection, args);
  }
});

module.exports = MangoModel