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
  const emailSebelum = request.body.email;
  const email = emailSebelum.toLowerCase();
  const password = request.body.password;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    try {
      const loginAttemptLimitResult =
        await authenticationServices.checkLoginAttempt();

      if (loginAttemptLimitResult) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `Terlalu banyak kegagalan dalam login. Tunggulah ${loginAttemptLimitResult.waktuWunggu} menit, untuk mencoba lagi.`
        );
      }
    } catch (error) {
      // Tangani kesalahan di sini
      console.error(error);
    }

    if (!loginSuccess) {
      percobaan--;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Email atau Password salah, anda memiliki ${percobaan} kali lagi untuk mencoba`
      );
    }

    percobaan = 5;

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
