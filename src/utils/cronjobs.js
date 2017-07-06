var _ = require('underscore');
var async =  require('async');
var Cron = {};

module.exports = function (app) {

    var Alert = app.models.Alert;
    var Task = app.models.Task;
    var User = app.models.User;
    var Estate = app.models.Estate;
    var FeaturedProperty = app.models.FeaturedProperty;

    Cron.modules = {
        // Alert: require('./lib/.../tasks.js')(app)
    };


    Cron.start = function() {
        app.taskQ.on('start', function(job) {
            app.log.info("Starting: ", job.attrs._id.toString(), job.attrs.name);
            app.log.info("Starting: ", JSON.stringify(job.attrs));
        });
    };
    Cron.start();

    Cron.completed = function() {
        app.taskQ.on('completed', function(job) {
            app.log.info("Completed '%s':", job.attrs.name, job.attrs._id ? job.attrs._id.toString() : "");
        });
    };
    Cron.completed();

    Cron.success = function() {
        app.taskQ.on('success', function(job) {
            app.log.info("Success '%s':", job.attrs.name, job.attrs._id ? job.attrs._id.toString() : "");

        });
    };
    Cron.success();

    Cron.fail = function() {
        app.taskQ.on('fail', function(err, job) {
            app.log.info("Failed '%s':", job.attrs.name, JSON.stringify(job.attrs));
            app.log.error("Failed :", job.attrs.name, job.attrs._id, err);
        });
    };
    Cron.fail();

    app.taskQ.start();


    process.on('SIGTERM', graceful);
    process.on('SIGINT' , graceful);

    Cron.uncaughtException = function() {
        process.on('uncaughtException', function(err) {
            app.log.error('Caught exception: ' + err.stack);
            graceful();
        });
    };
    Cron.uncaughtException();


    function graceful() {
        app.log.info("################# agenda graceful existing : ***************" );
        app.taskQ.stop(function() {
            process.exit(0);
        });
    }


    return Cron;
};