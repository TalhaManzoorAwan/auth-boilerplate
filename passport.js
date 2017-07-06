/**
 * Created by macbookpro on 11/9/15.
 */
module.exports = function(app, passport)
{
    var bcrypt = require('bcrypt-nodejs');
    var configAuth = require('./auth');

    var FacebookStrategy = require('passport-facebook').Strategy;
    var TwitterStrategy  = require('passport-twitter').Strategy;
    var LinkedInStrategy  = require('passport-linkedin').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var User = app.models.User;




    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {

        done(null, user);

    });


    passport.use( new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'name', 'email'],
            passReqToCallback: true

        },
        function(req, token, refreshToken, profile, done) {
            process.nextTick(function(){
                User.findOne({  'providerId' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        console.log(profile)
                        // set all of the facebook information in our user model
                        newUser.providerId    = profile.id; // set the users facebook id
                        newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.providerType = "facebook";
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            })
        }
    ));


    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitterAuth.consumerKey,
            consumerSecret  : configAuth.twitterAuth.consumerSecret,
            callbackURL     : configAuth.twitterAuth.callbackURL

        },
        function(token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function() {

                User.findOne({ 'providerId' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        console.log("facebook-profile",profile);
                        var newUser                 = new User();

                        // set all of the user data that we need
                        newUser.providerId          = profile.id;
                        //newUser.twitter.token       = token;
                        newUser.username    = profile.username;
                        newUser.name = profile.displayName;
                        newUser.providerType = "twitter";
                        // save our user into the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            });

        }));


    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL

        },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'providerId' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {

                        console.log(profile)
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.providerId    = profile.id;
                        //newUser.google.token = token;
                        newUser.name  = profile.displayName;
                        newUser.email = profile.emails[0].value; // pull the first email
                        newUser.providerType = "google";
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));



    passport.use(new LinkedInStrategy({

            consumerKey        : configAuth.linkedinAuth.consumerKey,
            consumerSecret    : configAuth.linkedinAuth.consumerSecret,
            callbackURL     : configAuth.linkedinAuth.callbackURL
            //profileFields: ['id', 'first-name', 'last-name', 'email-address']
        },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'providerId' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {

                        console.log("linked",profile)
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.providerId    = profile.id;
                        //newUser.google.token = token;
                        newUser.name  = profile.displayName;
                        //newUser.email = profile.emails[0].value; // pull the first email
                        newUser.providerType = "google";
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));

};