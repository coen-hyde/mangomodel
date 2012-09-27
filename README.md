MangoModel
==========

MangoModel is not an ORM. It is a very simple wrapper over the Monk MongoDb library. MangoModel's main purpose is to allow dynamic db switching and data validation.

Using MangoModel
----------------

```js
// Create db connection
var db = Monk('host/db');

// Create model
var Ant = MangoModel.create(db, 'ants');

// Accessing your model
var Ant = MangoModel.model('ants');

// Set the global db object so you don't have to specify the db every time you define a model
MangoModel.setDb(db);

var Rat = MangoModel.create('rats');
```

Dynamic DB switching
--------------------

When providing the database connection to either a model or the global MangoModel, you can provide a function that returns the database connection. This allows you to switch the database out as required.

Defining methods on your model
------------------------------

```js
var Cat = MangoModel.create('cats', {
  methods:
    getFatCats: function(cb) {
      this.find({weight: {'$gt':30}}, cb);
    }
  }
});

var cats = Cat.getFatCats(function(err, cats) {
  // variable cats is an array of cat objects
});
```

Defining a schema for data validation
-------------------------------------

// TODO
