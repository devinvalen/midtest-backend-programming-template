const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Get user detail pagination
 * @param {string} nomorPage - Nomor halaman
 * @param {string} besarPage - Jumlah data per halaman
 * @param {string} search - Search data
 * @param {string} sortQuery - Mengurutkan data
 * @returns {Promise}
 */
async function getPaginationUsers(nomorPage, besarPage, search, sortQuery) {
  const listDaftarNama = ['email', 'name'];
  if (nomorPage < 0 || besarPage < 0) {
    throw new Error(' nomorPage tipe nya harus integer');
  }
  let results = await User.find();
  if (search) {
    const [daftarNama, kunciSearch] = search.split(':');
    if (!listDaftarNama.includes(daftarNama)) {
      throw new Error(
        `Parameter salah pada daftar nama  ${daftarNama}  pada pencarian`
      );
    }
    if (kunciSearch) {
      results = results.filter((user) =>
        user[daftarNama].includes(kunciSearch)
      );
    } else {
      results = [];
    }
  }

  if (sortQuery) {
    const [daftarNama, sortQueryKey] = sortQuery.split(':');
    if (!sortQuery.includes(daftarNama)) {
      throw new Error(
        `Parameter salah pada dafttar nama ${daftarNama}  pada sort `
      );
    }
    const opsiSort = { [daftarNama]: sortQueryKey === 'desc' ? -1 : 1 };
    results.sortQuery(
      (a, b) => (a[daftarNama] - b[daftarNama]) * opsiSort[daftarNama]
    );
  }

  return results;
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  getPaginationUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
