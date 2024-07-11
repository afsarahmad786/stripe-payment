// response/apiResponse.js

function success(data, message = "Request succeeded") {
  return {
    success: true,
    data,
    message,
    errors: [],
  };
}

function error(message = "Request failed", errors = []) {
  return {
    success: false,
    data: null,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  };
}

module.exports = { success, error };
