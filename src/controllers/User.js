module.exports = function (app, passport) {
    var _ = require('underscore');
    var fs = require('fs');
    var async = require('async');
    var crypto = require('crypto');
    var bcrypt = require('bcrypt-nodejs');
    //  var bcrypt = require('bcrypt');
    var path = require('path');
    var uuid = require('node-uuid');
    var rest = require('restler');
    var moment = require('moment-timezone');
    // var mkdirp	=	require('mkdirp');
    var underscoreDeepExtend = require('underscore-deep-extend');
    var AWS = require('aws-sdk');
    var nodemailer = require('nodemailer');
    var sgTransport = require('nodemailer-sendgrid-transport');
    var jwt = require('jwt-simple');
    var secret = app.jwtSecret;

    console.log(uuid.v4());
    var User = app.models.User;

    var options = {
        auth: {
            api_key: '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'
        }
    };
    var Token = app.models.Token;
    var Controller = {
        name: User.modelName
    };

    _.mixin({deepExtend: underscoreDeepExtend(_)});

    var generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }
    var validPassword = function (password, storedPassword) {
        return bcrypt.compareSync(password, storedPassword);
    };

    function genToken(user) {
        //var expires = expiresIn(2); // 2 days
        var token = jwt.encode({
            //exp: expires,
            userID: user._id,
            role: user.role
        }, secret);

        return {
            token: token,
            //expires: expires,
            user: user,
            role: user.role
        };


    }

    function expiresIn(numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }


    Controller.signIn = function (req, res) {

        console.log("Sign in")
        User.findOne({ email: req.body.email}, function (err, User) {
            if (err) {
                app.responder.send(400, res, 'Bad request', 'failed to verify user');
            }
            else if (User) {

                if(User.confirmationStatus == false){

                    app.responder.send(401, res, 'Email not verfied', User.email);
                }
                else{


                    if (!validPassword(req.body.password, User.password)) {
                        app.responder.send(403, res, 'Incorrect password', null);
                    }
                    else {
                        var sessionObj = genToken(User);
                        console.log("session", sessionObj);
                        app.responder.send(200, res, 'User verified successfully', sessionObj);
                    }


                }





            }
            else {
                app.responder.send(404, res, 'User Does Not Exist', null);
            }
        });
    };


    Controller.signUp = function (req, res) {


        var userObj = {

            name: req.body.name,
            email: req.body.email,
            password: generateHash(req.body.password),
            providerType: "Local",
            role: req.body.role,
            token: uuid.v4()

        };



        User.findOne({email: userObj.email}, function (err, user) {
            if (err) {
                app.responder.send(400, res, 'Bad request', 'failed to verify user');
            }
            else if (user) {


                app.responder.send(403, res, 'Email already registered', "Please Login");
            }
            else {
                User.create(userObj, function (err, user) {
                    if (err) {
                        app.responder.send(400, res, 'Bad request', 'failed to create user');
                    }
                    else {
                        console.log(user);


                        var mailer = nodemailer.createTransport(sgTransport(options));
                        var email = {
                            to: [user.email],
                            from: 'no_reply@contributedotcloud.com',
                            subject: 'Email Confirmation', // Subject line
                            text: 'Please confirm your email address for Contribute Dot Cloud by click on this link:'+ 'http://contribute-dot-cloud.herokuapp.com/email-confirmation?token='+user.token
                        };
                        mailer.sendMail(email, function(error, ress) {
                            if(error){
                                console.log(error);
                                app.responder.send(400, res, 'Bad Request','Error in sending email');
                            }else{
                                app.responder.send(200, res, 'Successfully Registered. Please Confirm you email to proceed.', "Confirmation email send to User");
                            }
                        });

                    }
                });


            }

        });


    };



    Controller.resendEmailConfirmation = function (req, res) {

        if(req.query.email){

            User.findOne({email: req.query.email}, function (err, user) {
                if (err) {
                    app.responder.send(400, res, 'Bad request', 'failed to verify user');
                }
                else if (!user) {


                    app.responder.send(404, res, 'Invalid or Deleted User', "User not found");
                }
                else {

                    if( user.confirmationStatus == true)
                    {
                        app.responder.send(200, res, 'Email already confirmed. Go Back to Login Page', "Email Already Confirmed");
                    }

                    else {

                        var mailer = nodemailer.createTransport(sgTransport(options));
                        var email = {
                            to: [user.email],
                            from: 'no_reply@contributedotcloud.com',
                            subject: 'Email Confirmation', // Subject line
                            text: 'Please confirm your email address for Contribute Dot Cloud by click on this link:' + 'http://contribute-dot-cloud.herokuapp.com/email-confirmation?token=' + user.token
                        };
                        mailer.sendMail(email, function (error, ress) {
                            if (error) {
                                console.log(error);
                                app.responder.send(400, res, 'Bad Request', 'Error in sending email');
                            } else {
                                app.responder.send(200, res, 'Email sent again. Please verify you email.', "Confirmation email send to User");
                            }
                        });

                    }


                }

            });

        }
        else{


            app.responder.send(500, res, 'Email is required in Query String', "Not Sending Email");



        }





    };


    Controller.facebookCallback = function (req, res, next) {
        console.log('In Controller');
        passport.authenticate('facebook', function (err, user, info) {
            if (err) {
                res.redirect('/');
                return res.end();
            }
            if (!user) {
                res.redirect('/');
                return res.end();
            } else {


                var obj = genToken(user);
                console.log(obj);
                if (user.role) {

                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&role=' + user.role + '&email=' + user.email + '&token=' + obj.token);
                }
                else if(user.email){

                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name  + '&email=' + user.email + '&token=' + obj.token);
                }
                else {
                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&token=' + obj.token);

                }

            }
        })(req, res);
    };


    Controller.twitterCallback = function (req, res, next) {
        console.log('In Controller');
        passport.authenticate('twitter', function (err, user, info) {
            if (err) {
                res.redirect('/');
                return res.end();
            }
            if (!user) {
                res.redirect('/');
                return res.end();
            } else {


                var obj = genToken(user);
                console.log(obj);
                if (user.role) {

                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&role=' + user.role + '&email=' + user.email + '&token=' + obj.token);
                }
                else {
                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&token=' + obj.token);

                }

            }
        })(req, res);
    };

    Controller.googleCallback = function (req, res, next) {
        console.log('In Controller');
        passport.authenticate('google', function (err, user, info) {
            if (err) {
                res.redirect('/');
                return res.end();
            }
            if (!user) {
                res.redirect('/');
                return res.end();
            } else {


                var obj = genToken(user);
                console.log(obj);
                if (user.role) {

                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&role=' + user.role + '&email=' + user.email + '&token=' + obj.token);
                }
                else if(user.email){

                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name  + '&email=' + user.email + '&token=' + obj.token);
                }
                else {
                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&token=' + obj.token);

                }

            }
        })(req, res);
    };
    Controller.linkedinCallback = function (req, res, next) {
        console.log('In Controller');
        passport.authenticate('linkedin', function (err, user, info) {
            if (err) {
                res.redirect('/');
                return res.end();
            }
            if (!user) {
                res.redirect('/');
                return res.end();
            } else {


                var obj = genToken(user);
                console.log(obj);
                if (user.role) {

                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&role=' + user.role + '&email=' + user.email + '&token=' + obj.token);
                }
                else {
                    res.redirect('/social-user-boarding?userId=' + user._id + '&name=' + user.name + '&token=' + obj.token);

                }

            }
        })(req, res);
    };

    Controller.setUserRole = function (req, res) {


        console.log(req.body);


        async.waterfall([

            checkUserValidity,
            checkEmailUniqueness,
            updateUser
        ], function (err, user) {

            if (err) {

                if (err.status) {
                    app.responder.send(err.status, res, err.errorMessage, err.detail);

                }
                else {
                    app.responder.send(500, res, 'Server Error', err);
                }


            }

            else {

                app.responder.send(200, res, 'User successfully updated', user);

            }


        });


        function checkUserValidity(callback) {


            User.findOne({_id: req.params.userId, deleted: false}, function (err, user) {

                if (err) {
                    callback(err)
                }
                else {

                    if (!user) {

                        callback({
                            status: 404,
                            errorMessage: "Not Found",
                            detail: "User is invalid or deleted !"
                        })

                    }
                    else if (user.role) {

                        console.log('In role');

                        callback({
                            status: 403,
                            errorMessage: "Forbidden Request",
                            detail: "User already updated."
                        })
                    }

                    else {


                        callback(null)
                    }


                }


            })

        }

        function checkEmailUniqueness(callback) {


            User.findOne({'email': req.body.email, '_id':{$ne:req.params.userId},deleted: false}, function (err, user) {

                if (err) {
                    callback(err)
                }
                else {

                    if (user) {

                        callback({
                            status: 403,
                            errorMessage: "Forbidden Request",
                            detail: "Email is already taken !"
                        })

                    }

                    else {


                        callback(null)
                    }


                }


            })

        }

        function updateUser(callback) {

            User.findOne({_id: req.params.userId, deleted: false}, function (err, user) {
                if (err) {

                    callback(err)

                }
                else {


                    console.log('In update');
                    user.role = req.body.role;
                    user.email = req.body.email;

                    console.log(user);

                    user.save(function (err) {
                        if (err) {
                            callback(err)
                        } else {
                            callback(null,user)
                        }
                    });


                }
            });




        }
    };

    Controller.emailConfirmation = function (req, res) {

        if( req.query.token){


            console.log("token", req.query.token);
            User.findOne({'token': req.query.token, deleted: false}, function (err, user) {
                if (err) {

                    app.responder.send(500, res, 'Server Error', err);

                }
                else {

                    if(!user){

                        app.responder.send(404, res, 'Not Found', 'User Not Found');


                    }else {

                        console.log('In update');
                        user.confirmationStatus = true;

                        console.log(user);

                        user.save(function (err) {
                            if (err) {
                                app.responder.send(500, res, 'Server Error', err);

                            } else {
                                var obj = genToken(user);
                                app.responder.send(200, res, 'Email successfully confirmed', obj);
                            }
                        });

                    }
                }
            });

        }
        else{
            app.responder.send(500, res, 'Token is required in Query String', "Not Sending Token");

        }


    };
    return Controller;
};
