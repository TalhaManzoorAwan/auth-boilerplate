module.exports = {

    'facebookAuth' : {
        'clientID'      : '1735126740134948', // your App ID
        'clientSecret'  : 'eff5f09f67e3b3d6e6124bfb8490612d', // your App Secret
       //'callbackURL'   : 'http://localhost:6005/api/auth/facebook/callback'
       // 'callbackURL'   : process.env.fbAuthCallbackUrl? process.env.fbAuthCallbackUrl : 'http://localhost:6005/api/auth/facebook/callback'

      'callbackURL'       : 'https://contribute-dot-cloud.herokuapp.com/api/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : '9bUbRtstIpXdFvVQZjDCm6woq',
        'consumerSecret'    : 'hzkGJXuCbU2ZM9IzN97KJctAJ5vUJVs36pfwBSx0usCIwgFPDn',
        'callbackURL'       : 'https://contribute-dot-cloud.herokuapp.com/api/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '105458208467-hp6bmlu7eeq81ibd0mdnlmqfu5mmdbu1.apps.googleusercontent.com',
        'clientSecret'  : 'J73sVdbXXGj3hstZPb2p7b7m',
        //'callbackURL'   : 'http://localhost:6005/api/auth/google/callback'
        'callbackURL'       : 'http://contribute-dot-cloud.herokuapp.com/api/auth/google/callback'
    }
    ,
    'linkedinAuth' : {
        'consumerKey'       : '81mgvpa3h5trwp',
        'consumerSecret'    : 'f3vxgcYmfAfhLwzK',
        'callbackURL'       : 'https://contribute-dot-cloud.herokuapp.com/api/auth/linkedin/callback'
    }




};

