# Authentication Boilerplate

Authentication Boilerplate is a Node.js sample application that implements authentication with *Twitter*, *Facebook*, *LinkedIn*, *Google* using [Passport js](https://www.npmjs.com/package/passport)

Some portion/logic of this app is specific to project **Contribute dot cloud**

#### Following functionalities are already completed

1. Login page UI with SignIn Rest API
2. Sign up page UI with SignUp Rest Api ( Two Roles : Student or Teacher)
3. Confirmation Email to User when signIn using SendGrid's 'Node Mailer'. (Use you own Node mailer key).
4. Redirect to respective page after login depending on their role.
5. Front-end proper routes defined.


#### Authentication with social website. (Official Website: http://passportjs.org/)

1. Login with Facebook using passport.Js
2. Login with Twitter using passport.Js
3. Login with Google using passport.Js
4. Login with LinkedIn using passport.Js

#### Example:


    #### Create a facebook app and copy app-secret, app id and paste in auth.js file .Set the callback URL in your app.

     'facebookAuth' : {
             'clientID'      : 'FACEBOOK_APP_ID', // your App ID
             'clientSecret'  : 'FACEBOOK_APP_SECRET', // your App Secret
             'callbackURL'       : 'http://www.example.com/auth/facebook/callback'
        },

    #### Hit that route from front-end like "<a href="/auth/facebook">Login with Facebook</a>"

    --> app.get('/auth/facebook', passport.authenticate('facebook'));

    #### Other logics are defined in passport.js file.

    #### Callback url that hit by facbook:

    --> app.get('/auth/facebook/callback',
          passport.authenticate('facebook'));

    #### In Passport.JS

    var configAuth = require('./auth');
    var FacebookStrategy = require('passport-facebook').Strategy;


     passport.use(new FacebookStrategy({
         clientID: configAuth.facebookAuth.clientID,
         clientSecret: configAuth.facebookAuth.clientSecret,
         callbackURL: configAuth.facebookAuth.callbackURL,
       },
       function(accessToken, refreshToken, profile, done) {
         User.findOrCreate(..., function(err, user) {
           if (err) { return done(err); }
           done(null, user);
         });
       }
     ));


#### Same case for other social website.

We are getting email from both facebook and google till now ,not from twitter and likedin , if any website is not returning email,in that case we are getting it from user on Boarding-page.


#### Install and run Mongodb , Node, and NPM (Use your own mongo db link in server.JS)



#### Install node modules
make install or npm install

#### Run the app
node app.js --config contribute-dot-cloud.json






#### Run all tests
    $ grunt test         

#### Generate both JSON & HTML reports
    $ grunt unit_test_coverage_report

#### Generate JSON report only
     $ grunt json_report

#### Generate HTML report only
    $ grunt html_report

#### Log files path must exist in your local system.
    /var/log/contribute-dot-cloud
