var Errors = function (code, msg) {
  var err = new Error(msg);

  switch (code) {
    case 400:
      err.error = 'ERR_BAD_REQUEST';
      break;
    case 401:
      err.error = 'ERR_UNAUTHORIZED';
      break;
    case 403:
      err.error = 'ERR_NOT_ALLOWED';
      break;
    case 404:
      err.error = 'ERR_NOT_FOUND';
      break;
    case 405:
      err.error = 'ERR_METHOD_NOT_ALLOWED';
      break;
    case 500:
    case 501:
    case 502:
    case 503:
      err.error = 'ERR_API_INTERNAL_ERROR';
      break;
    case 601:
      err.error = 'ERR_EMPTY_RESULTS';
      break;
    case 602:
      err.error = 'ERR_INVALID_KEY';
      break;
    case 603:
      err.error = 'ERR_INVALID_SESSION';
      break;
    case 604:
      err.error = 'ERR_ALREADY_RATED';
      break;
    case 605:
      err.error = 'ERR_LOGIN_FAILED';
      break;
  }

  err.data = '';
  err.code = code;
  err.msg = msg;
  return err;
};

exports.Errors = Errors;