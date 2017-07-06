module.exports = function(app){
  var bindDatabaseMethods = function(model){

    model.create            = model.schema.model.create.bind(model.schema.model);
    model.find              = model.schema.model.find.bind(model.schema.model);
    model.findById          = model.schema.model.findById.bind(model.schema.model);
    model.findOne           = model.schema.model.findOne.bind(model.schema.model);
    model.update            = model.schema.model.update.bind(model.schema.model);
    model.findByIdAndUpdate = model.schema.model.findByIdAndUpdate.bind(model.schema.model);
    model.findOneAndUpdate  = model.schema.model.findOneAndUpdate.bind(model.schema.model);
    model.remove            = model.schema.model.remove.bind(model.schema.model);
    model.populate          = model.schema.model.populate.bind(model.schema.model);
    model.count             = model.schema.model.count.bind(model.schema.model);
    model.search            = model.schema.model.search ? model.schema.model.search.bind(model.schema.model) : null;
  }

  return {
    bindDatabaseMethods: bindDatabaseMethods
  };
};
