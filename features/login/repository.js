const Knex = require('knex');
const bcrypt = require('bcrypt');
const debug = require('debug')('express:login');

const knexConfig = require('../../db/knexfile');

const knex = Knex(knexConfig[process.env.NODE_ENV]);

async function getUserForLoginData(email, password) {
  debug('------------------login repository - getUserForLoginData for email: '+email +', password: '+password);
  const [user] = await knex('users')
    .select()
    .where({ email })
    .limit(1);

  if (!user) {
    debug('----------user not found: '+ user);
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return "ERROR";
  }

  return {
    id: user.id,
    username: user.email,
    created_at: user.created_at,
  };
}

async function getUserById(id) {
  debug('------------------login repository - getUserById for ID: '+id);
  const [user] = await knex('users')
    .select(['id', 'name', 'email', /*'role'*/])
    .where({ id })
    .limit(1);
  debug('-------------returning user with id: '+user.id+', name: '+user.name+', email: '+user.email);
  return user;
}

module.exports = {
  getUserForLoginData,
  getUserById,
};
