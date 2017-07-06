/**
 * Created by macbookpro on 2/17/16.
 */

var async = require("async");


module.exports = function(){


  //usage   // getValidObjs(Building, arr, function(err, building){
  // getValidObj(Building, req.params.id, function(err, building){


  return {
    getValidObj: function (model, reference, callback) {
      model.findOne({_id: reference, deleted: false})
          .exec(function (err, obj) {
            if (err) {
              callback(err)
            }
            else if (!obj) {
              callback({
                status: 404,
                errorMsg: "Not Found",
                detail: "Document is invalid or deleted !"
              })
            }
            else {
              callback(null, obj)
            }
          })
    },


    getValidObjs: function (model, references, callback) {

      model.find({_id: {$in: references}, deleted: false}).exec(function (err, objs) {
        if (err) {
          callback(err)
        }
        else if (references.length !== objs.length) {
          callback({
            status: 404,
            errorMsg: "Not Found",
            detail: "Few documents not found or deleted !"
          })
        }
        else {
          callback(null, objs)
        }
      })
    },



    checkDeleteReferencing: function (objs, done)
    {
      async.each(objs,function(obj, asyncCallback) {


            var para = { };

            if(obj.isDeletedFalse)
            {
              para = { };

            }
            else
            {
              para={deleted:false};
            }
            para[obj.name]=obj._id;


            console.log('PAra',para)
            console.log('Obj',obj)

            obj.model.findOne(para).exec(function (err, collection) {
              if (err) {
                asyncCallback(err)
              }

              else if (collection ) {
                asyncCallback({
                  status: 403,
                  errorMsg: "Forbidden",
                  detail: "Forbidden due to reference in other entities"
                })
              }
              else {
                asyncCallback()
              }


            })}
          , function (err) {
            if (err) {
              done(err)
            }
            else {

              done()

            }
          });

    }



  };

};