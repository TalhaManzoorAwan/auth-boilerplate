# Novtore Authentication Boilerplate

Novatore Authentication Boilerplate is a Node.js (sample) app to perform authentication with **Twitter**, **Facebook**, **LinkedIn**, **Google** with [passport](https://www.npmjs.com/package/passport).

Most of the code is related to **Contribute dot cloud** application.

#### Features Included In Current Implementation

1. Signin UI with signin API
2. Signup UI with signup API (with two roles: student and teacher)
3. Confirmation email to user when signing up using [Node Mailer](https://www.npmjs.com/package/nodemailer) (Use you own key)
4. Role-based redirecton to different views after successful signin


#### Main Libraries For Authentication

1. [Passport](https://www.npmjs.com/package/passport)
2. [Passport Facebook](https://www.npmjs.com/package/passport-facebook)
3. [Passport Twitter](https://www.npmjs.com/package/passport-twitter)
4. [Passport Google](https://www.npmjs.com/package/passport-google-oauth)
5. [Passport LinkedIn](https://www.npmjs.com/package/passport-linkedin)

## Example (Facebook):

1.Create a facebook app from developers console. Copy app-secret, app id and paste in auth.js file. Also set the callback URL in your  facebook app

    //auth.js
     'facebookAuth' : {
             'clientID'      : 'FACEBOOK_APP_ID', // your App ID
             'clientSecret'  : 'FACEBOOK_APP_SECRET', // your App Secret
             'callbackURL'   : 'http://www.example.com/auth/facebook/callback'
        }
        
2. Hit that route from front-end like `<a href="/auth/facebook">Login with Facebook</a>`

    `app.get('/auth/facebook', passport.authenticate('facebook'));`


3. Callback url that is hit by Facebook

    `app.get('/auth/facebook/callback', passport.authenticate('facebook'));`


4. In `passport.js`


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


5. Same process is followed for other social networks


We are getting email from both facebook and google till now ,not from twitter and likedin , if any website is not returning email,in that case we can get it from user on a boarding-page.


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
