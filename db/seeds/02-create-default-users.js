const bcrypt = require('bcrypt');

const defaultRoles = require('../../resources/user-roles');

exports.seed = async function seed(knex) {
  const hashedPass = await bcrypt.hash('secret', 5);
  const defaultUsers = defaultRoles.map(roleObject =>
    Object.assign({}, roleObject, { email: `${roleObject.role_code.toLowerCase()}@argon.com` })
  );
  const defaultEmails = defaultUsers.map(userObject => userObject.email);
  const existingDefaultUsersEmails = await knex('users')
    .whereIn('email', defaultEmails)
    .select('email')
    .then(existingDefaultUsers => existingDefaultUsers.map(userObject => userObject.email));

  if (
    !Array.isArray(existingDefaultUsersEmails) ||
    existingDefaultUsersEmails.length !== defaultEmails.length
  ) {
    await Promise.all(
      defaultUsers.map(async userObject => {
        if (!existingDefaultUsersEmails.includes(userObject.email)) {
          const NOW = new Date();
          await knex.raw(
            `INSERT INTO users(id,username,name,email,password)
            VALUES (
              nextval('user_id_seq'),
              CONCAT('testUser', nextval('user_id_seq')::VARCHAR),
              'default ${userObject.description}',
              '${userObject.email}',
              '${hashedPass}'
            )`,
            []
          ).then(query => query.rows);
            /*id: id,
            username:"testUser" + String(id),
            name: `default ${userObject.description}`,
            email: userObject.email,
            password: hashedPass,*/
            //role: userObject.role_code,
            //created_at: NOW,
            //updated_at: NOW,
          //});
        }
        return Promise.resolve();
      })
    );
  }
};
