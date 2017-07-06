module.exports = function(app){

  var sendNotificationEmail = function(args){
    
    app.log.info('Attempting Notification Email process for user: '+args.group_user_id+ " :permission: " +args.permission);
    
    var query = {}
    query._id = args.group_user_id;
    query[args.permission] = true;

    app.models.User.find(query, function(err, results){
      if(results.length > 0) {
        app.log.info('Sending Notification Email for: ' + args.permission);
        var data = {
          "recipients" : [results[0].email],
          "subject" : args.subject,
          "isTextOnly" : false,
          "templateId" : args.template, 
          "templateData" : {
            "first_name" : args.req.user.profile.name.first,
            "link": args.link
          }
        };
        app.taskQ.now('send email', data);                
        
      } else {
        app.log.info('Recipient share settings prohibit email for: ' + args.permission);
      }
    });
  }

  return {
    sendNotificationEmail: sendNotificationEmail
  };
  
};