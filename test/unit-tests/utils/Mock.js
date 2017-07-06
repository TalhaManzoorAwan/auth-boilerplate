var path    = require('path');
var moment  = require('moment');
var clone   = require('clone');
var nconf = require('nconf');
var sinon = require('sinon');

module.exports = function() {

    var applicationRoot = path.join(__dirname, "../../../");

    var config = nconf.argv().env();

    // Init
    var conf = require(path.join(applicationRoot,'config.json'));

    config.file({file: path.join(applicationRoot,'user-data-api.json')});
    config.defaults(conf);

    //default model methods
    var modelMethods = {
        addAction: function(){},
        update: function(){},
        create: function(){},
        remove: function(){},
        find: function(){},
        findById: function(){},
        findByIdAndUpdate: function(){},
        findOne: function(){},
        findOneAndUpdate: function(){},
        bind: function(){},
        where: function(){},
        ne: function (){},
        exec:function(){},
        equals:function(){}
    };

    var app = {
        config: config,
        emailSender: config.get("emailSender"),
        confirmUserUrl: config.get("confirmUserUrl"),
        events: {
            on: sinon.stub(),
            emit: sinon.stub()
        },
        log: {
            error: function(){}
        },
        mailer: {
            sendMail: function(){}
        },
        getDB: function () {
            return {
                modelNames: function(){},
                model: function(){}
            };
        },
        models: {
            User: clone(modelMethods)
        },
        notifier: {
            sendNotificationEmail: function(){}
        },
        responder: {
            send: function(){}
        },
        req: {
            body: {},
            params: {
                user_id: '',
                token:''
            },
            query: {
                start: '',
                end: '',
                type: ''
            },
            user: {
                _id: ''
            }
        },
        res: {
            redirect: function(str){
                return str;
            },
            setHeader: function(){},
            send: function(){},
            sendfile: function(){}
        },
        sms: {
            sendSms: function(){}
        },
        taskQ: {
            create: function(){},
            define: function(){},
            on: function() {},
            _db: {
                findAndModify: function(){},
                ensureIndex: function(){},
                update: function(){},
                find: function(){
                    var obj = {
                        toArray: function(){}
                    };
                    return obj;
                },
                toArray: function(){}
            },
            every: function(){},
            start: function(){},
            now: function(){},
            stop: function(){},
            schedule: function(){},
            save: function(){},
            unique: function(){}
        }
    };

    var dependencies = {};


    var user = {
        __v: 'foobar',
        _id: 'abc123',
        active: true,
        email: 'abc@123.com',
        timezone: 'America/New_York',
        profile: {
            termsAndConditionsAccepted: moment(),
            phone: {
                mobile: '1234566'
            },
            name: {
                first: 'foo',
                last: 'bar',
                full: 'foo bar'
            }
        },
        roles: {
            patient: true
        }
    };

    return {
        applicationRoot: applicationRoot,
        app: app,
        dependencies: dependencies,
        user: user
    };
};