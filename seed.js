/**
 * Created by NovatoreSolutions-mac2 on 07/03/16.
 */


var express = require("express");
var mongoose = require("mongoose");
var bcrypt     = require('bcrypt-nodejs');
var models = require("./src/models");

var app = express();

mongoose.connect("mongodb://contribute-dot-cloud:admin@ds155097.mlab.com:55097/contribute-dot-cloud", function(err) {
    if (err) {
        console.log(err);
        return process.exit(0);
    }
});

models(app);

var Admin = app.models.Admin;



var adminObj = {
    email:  "admin@admin.com",
    userName: "adminCloud",
    password:  bcrypt.hashSync("admin", bcrypt.genSaltSync(8), null),
};

Admin.create(adminObj, function(err, admin){
    if(err){
        console.log(err)
    }
    else{
        console.log(admin)
    }
});







