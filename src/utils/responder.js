module.exports = function (app) {

  var send = function (code, res, message, data, error_code) {
    if (!code) {
      throw new Error('error_code is required.');
    }
    if(code >= 200 && code < 400){
      app.logger.info(code, message)
    }
    else if(code >= 400 && code <= 500){
      app.logger.error(code, message, data, error_code)
    }
    res.send(
      code,
      {
        status_code: code,
        message: message,
        data: data
      }
    );
  }

  return {
    send: send
  }
}