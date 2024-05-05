const { User } = require('../../../models');
let percobaanLogin = '';

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}
async function getPercobaanLogin() {
  return percobaanLogin;
}
async function savePercobaanLogin(percobaan, tanggalPercobaan) {
  return (percobaanLogin = { percobaan, tanggalPercobaan });
}
async function resetPercobaanLogin() {
  return (percobaanLogin = { percobaan: 1, tanggalPercobaan: 0 }); 
}
async function searchPercobaanLogin() {
  const waktuLogin = await waktuLoginUsers.findOne();
  return waktuLogin ? waktuLogin.loginWaktu : null;
}
async function addPercobaanLogin(time) {
  const tambahWaktu = new WaktuLoginUsers({ loginWaktu: time });
  await tambahWaktu.save();
}
async function clearWaktuLogin() {
  await WaktuLoginUsers.deleteMany();
}
module.exports = {
  getUserByEmail,
  getPercobaanLogin,
  savePercobaanLogin,
  resetPercobaanLogin,
  searchPercobaanLogin,
  addPercobaanLogin,
  clearWaktuLogin,
};
