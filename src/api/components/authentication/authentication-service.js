const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const batasPercobaan = 5; 
const waktuMenungguPercobaan = 30;
let menambahWaktu = true;
/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

async function checkPercobaanLogin() {
  const waktuSekarang = Date.now(); // 
  const percobaanSebelum =
    (await authenticationRepository.getPercobaanLogin()) || {
      percobaan: 1,
      tanggalPercobaan: 0,
    };
  

  const batasWaktu = await authenticationRepository.searchWaktuLogin(); 
  const waktuLewat = (waktuSekarang - batasWaktu) / (60 * 1000);
  const waktuTunggu = (waktuTungguPercobaan - waktuLewat).toFixed(2);
  if (waktuLewat < waktuTungguPercobaan) {
    return { success: true, waktuTunggu: waktuTunggu };
  }
  if (waktuLewat > waktuTungguPercobaan) {
    menambahWaktu = true;
    await authenticationRepository.clearWaktuLogin(); 
    authenticationRepository.resetPercobaanLogin(); 
  }

  if (percobaanSebelum.percobaan > batasPercobaan) {
    if (menambahWaktu === true) {
      await authenticationRepository.addLoginTime(percobaanSebelum.tanggalPercobaan);
      menambahWaktu = false;
    }
    return { success: true, waktuTunggu: '30 menit' };
  }
  
  await authenticationRepository.savePercobaanLogin(
    percobaanSebelum.percobaan + 1,
    waktuSekarang
  );
}


module.exports = {
  checkLoginCredentials,
  checkPercobaanLogin,
};
