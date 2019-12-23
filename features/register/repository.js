const bcrypt = require('bcrypt');
const knex = require('../../db');


async function createUser({ name, username, email, password, roleCode }) {
  email = username;
  const hashedPass = await bcrypt.hash(password, 5);
  const [user] = await knex('users')
    .returning(['email', 'name'])
    .insert({
      name,
      email,
      password: hashedPass,
      username
      //created_at: new Date(),
      //updated_at: new Date(),
      //email_verified_at: new Date(),
    });
  return user;
}

async function getUserRoles() {
  return knex('roles').select(['role_code', 'description']);
}

module.exports = {
  createUser,
  getUserRoles,
};
