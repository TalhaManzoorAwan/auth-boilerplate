/**
 * Created by macbookpro on 2/17/16.
 */

var jwt = require('jwt-simple');




module.exports  = function(app){
  //  var exceptions = ['/api/sign-in','/api/auth/facebook/callback','/api/sign-up-user','/api/contact-us'],
    var exceptions = [
            {
                url: '/api/sign-in'
            },
            {
                url: '/api/auth/facebook/callback'
            },
            {
                url: '/api/auth/twitter/callback'
            },
            {
                url: '/api/auth/google/callback'
            },
            {
                url: '/api/email-confirmation',
                method: 'GET'
            },
            {
                url: '/api/resend-email-confirmation',
                method: 'GET'
            }
            ,
            {
                url: '/api/auth/linkedin/callback'
            },
            {
                url: '/api/sign-up',
                method: 'POST'

            },
            {
                url: '/api/contact',
                method: 'GET'
            },
            {
                url: '/api/about-us',
                method: 'GET'
            },
            {
                url: '/api/countries',
                method: 'GET'
            },
            {
                url: '/api/categories',
                method: 'GET'
            },
            {
                url: '/api/profiles',
                method: 'GET'
            },
            {
                url: '/api/views',
                method: 'POST'
            },
            {
                url: '/api/views',
                method: 'GET'
            },
            {
                url: '/api/subscriber',
                method: 'POST'
            }

        ],
        exceptionFound,
        url,
        method,
        secret;

    secret = app.jwtSecret;

    return {
        authenticate : function(req, res, next) {

            console.log("Authentication");

            console.log(req.originalMethod);
            url = req.url, method = req.originalMethod,
                exceptionFound = false;

            for (var i = 0; i < exceptions.length; i++) {
                //if (url.match(exceptions[i]) && method == 'GET') {
                //    exceptionFound = true;
                //    break;
                //}

                if  ( url.match(exceptions[i].url) && (!exceptions[i].method || exceptions[i].method == method)) {
                    exceptionFound = true;
                    break;
                }
            }


            if (exceptionFound)
            {
                app.logger.info("User is Authorized!!!");
                app.logger.info("User is Authorized!!!");
                next();
            }
            else {
                try
                {
                    if(!req.headers.token)
                    {
                        app.responder.send(401, res, 'Unauthorized', 'Token is empty');
                    }
                    else
                    {

                        var decodedObj = jwt.decode(req.headers.token, secret);
                        if (decodedObj.exp <= Date.now()) {

                            app.responder.send(401, res, 'Unauthorized', 'Error token Validation');

                        }
                        else {
                            req.userID = decodedObj.userID;
                            req.adminID = decodedObj.adminID;


                            next();
                        }
                    }
                }

                catch (err) {

                    app.responder.send(401, res, 'error validating token', 'failed to verify user');
                }
            }
        }
    };
};