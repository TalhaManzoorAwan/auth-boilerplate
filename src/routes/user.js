var validate = require('../utils/validator/SchemaValidator');
var updateSchema = require('../schemas/user-update');

module.exports = function (app, passport) {
    var UserController = app.controllers.User;

    var baseUrl = app.config.get('server:routePrefix');

    app.post(baseUrl +'/sign-in', UserController.signIn);
    app.post(baseUrl +'/sign-up', UserController.signUp);
    app.post(baseUrl +'/user/:userId/updateRole', UserController.setUserRole);

    app.get(baseUrl +'/email-confirmation', UserController.emailConfirmation);
    app.get(baseUrl +'/resend-email-confirmation', UserController.resendEmailConfirmation);


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/linkedin', passport.authenticate('linkedin'));

    app.get('/api/auth/facebook/callback', UserController.facebookCallback);
    app.get('/api/auth/twitter/callback', UserController.twitterCallback);
    app.get('/api/auth/google/callback', UserController.googleCallback);
    app.get('/api/auth/linkedin/callback', UserController.linkedinCallback);

};
