var express = require("express");
var fs = require("fs");
var mongoose = require("mongoose");
var path = require("path");
var util = require("util");
var controllers = require("./src/controllers");
var mailer = require("./src/utils/mailer");
var models = require("./src/models");
var responder = require("./src/utils/responder");
var routes = require("./src/routes");
var i18n = require("i18n");
var passport = require('passport');
var http = require('http');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var winston = require('winston');
var session = require('express-session')
require('winston-daily-rotate-file');


var Server = function Server (config) {
    var app = express();
    app.config = config;
    if (app.config.get("newrelic")) {
        this.setupNewRelic(config);
    }

    mongoose.connect(app.config.get("dbOnline:application"), function(err) {
        if (err) {
            console.log(err);
            return process.exit(0);
        }
    });
    this.setupLogging(app);
    //// Middleware

    //app.auditlogger = require("./src/utils/auditlogger")(app);
    //app.use( app.auditlogger);
    app.use(morgan('dev'));
    app.responder = responder(app);

    function skipJsonCheck(res, path){
        // don't check json conetent type for specific types
        //if(/\.jpg|\.ico|\.png|\.map|\.gif|\.js|\.css|\.html|\.svg|\.woff|\.ttf/.test(path.toLowerCase())){
        //    return true;
        //} else if(path.endsWith('/picture')){
        //    return true;
        //} else {
        //  res.setHeader('Content-Type', 'application/json');
        //  return false;
        //}
    }

    // cross-site scripting XSS -  accept content-type header of application/json
    app.use(function(req, res, next) {
        var content_type ="";
        if(req.headers['content-type'] != undefined){
            content_type = req.headers['content-type'];
        }else if(req.headers['Content-Type'] != undefined){
            content_type = req.headers['Content-Type'];
        }
        //app.log.debug("req.path ::" + req.path + " :: content-type:" +content_type+ " :: req.method :" +req.method);
        var skipJson = skipJsonCheck(res, req.path);
        if(skipJson){
            next();
        }else{
            var is_json = /json/i.test(content_type),
                is_multipart = /multipart/i.test(content_type);

            if ('GET' === req.method || 'DELETE' === req.method || is_multipart || is_json) {
                next();
            } else {
                app.responder.send(401, res, 'Only accepts content-type header as application/json');
            }
        }
    });

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(session({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,

    }));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    i18n.configure({
        locales: ["en"],
        directory: path.join(__dirname, "locales"),
        updateFiles: false
    });

    app.i18n = i18n;
    app.use(i18n.init);
    app.use("/doc", express["static"](path.join(__dirname, app.config.get("server:docsPath"))));
    app.use("/static", express["static"](path.join(__dirname, app.config.get("server:staticPath"))));
    app.use(express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/images'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.mailer = mailer({
        i18n: app.i18n,
        log: app.log,
        server: app.config.get("email:server"),
        templatePath: path.join(__dirname, app.config.get("email:templatePath"))
    });



    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err.stack);
        process.exit();
    });

    app.emailSender = app.config.get("emailSender");
    app.jwtSecret = app.config.get("jwtSecret");
    app.confirmUserUrl = app.config.get("confirmUserUrl");
    app.resetPasswordUrl = app.config.get("resetPassword");
    app.localCognitoConfig = app.config.get("localCognitoConfig");
    app.allowedLoginAttempts = app.config.get("allowedLoginAttempts");
    app.loginAttemptsBlockingTime = app.config.get("loginAttemptsBlockingTime");


    models(app);
    require('./passport')(app, passport);
    app.referenceValidator = require("./src/utils/referenceValidator")();
    controllers(app,passport);
    app.all(app.config.get('server:routePrefix')+ '*', require("./src/utils/authenticator")(app).authenticate);

    require("./src/utils/cronJob")(app);
    routes(app, passport);
    this.app = app;
    return this;

};

Server.prototype.setupNewRelic = function (config) {
    if (config && config.get("newrelic:app_name") && config.get("newrelic:license_key")) {
        process.env["NEW_RELIC_APP_NAME"] = config.get("newrelic:app_name");
        process.env["NEW_RELIC_LICENSE_KEY"] = config.get("newrelic:license_key");
        process.env["NEW_RELIC_NO_CONFIG_FILE"] = 1;

        if (config.get("newrelic:logging")) {
            if (config.get("newrelic:logging:log")) {
                process.env["NEW_RELIC_LOG"] = config.get("newrelic:logging:log");
            }
            if (config.get("newrelic:logging:level")) {
                process.env["NEW_RELIC_LOG_LEVEL"] = config.get("newrelic:logging:level");
            }
        }
        require("newrelic");
    }
    console.log("fb Config URL", process.env.fbAuthCallbackUrl)
};

Server.prototype.setupLogging = function (app) {
    var fs = require('fs');
    var dir = './log';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.DailyRotateFile)({
                name: 'mainLog',
                filename: './log/' + (process.env.ENV === 'production' ? 'info' : 'debug'),
                level: process.env.ENV === 'production' ? 'info' : 'debug',
                maxsize: 100000000, //100 MBs
                maxFiles: 5,
                handleExceptions: true,
                humanReadableUnhandledException: true,
                datePattern: '.yyyy.log'
            })
        ]
    });
    logger.info("hello")
    return app.logger = logger;
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

Server.prototype.start = function () {
    var _this = this;
    console.log("Running env=%s", this.app.get("env"));

       require('http').createServer(this.app).listen(process.env.PORT ||  6005 , function() {
        console.log("http server (public) worker started, sharing port " + (process.env.PORT ||  6005) );
    });





//    var server = require('http').createServer(this.app)
//
//
//    var io = require('socket.io').listen(server, function() {
//        console.log("Express server listening on port " + _this.app.config.get("server:ports:public"));
//    });
//
//    server.listen( process.env.PORT ||  6005 );
//    var line_history = [];
//
//// event-handler for new incoming connections
//    io.on('connection', function (socket) {
//
//        // first send the history to the new client
//        for (var i in line_history) {
//            socket.emit('draw_line', { line: line_history[i] } );
//        }
//
//        // add handler for message type "draw_line".
//        socket.on('draw_line', function (data) {
//            // add received line to history
//            line_history.push(data.line);
//            // send line to all clients
//            io.emit('draw_line', { line: data.line });
//        });
//    });
    //this.app.taskQ.start();
};


module.exports = Server;
