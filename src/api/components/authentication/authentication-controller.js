const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
let percobaan = 5;
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  try {
    const { email, password } = getEmailAndPassword(request);

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    await handleLoginAttempt(loginSuccess);

    if (!loginSuccess) {
      decrementPercobaan();
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Email atau Password salah, anda memiliki ${percobaan} kali lagi untuk mencoba`
      );
    }

    resetPercobaan();

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

function getEmailAndPassword(request) {
  const emailSebelum = request.body.email;
  const email = emailSebelum.toLowerCase();
  const password = request.body.password;
  return { email, password };
}

async function handleLoginAttempt(loginSuccess) {
  if (loginSuccess) {
    return;
  }
  try {
    const loginAttemptLimitResult =
      await authenticationServices.checkLoginAttempt();
    if (loginAttemptLimitResult) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Terlalu banyak kegagalan dalam login. Tunggulah ${loginAttemptLimitResult.waktuTunggu} menit, untuk mencoba lagi.`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function decrementPercobaan() {
  percobaan--;
}

function resetPercobaan() {
  percobaan = 5;
}

module.exports = {
  login,
};
