
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('gender').notNullable();
    table.string('sexualPreference').notNullable();
    table.date('dob').notNullable();
    table.string('likes').notNullable();
    table.string('dislikes').notNullable();
    table.string('hobbies').notNullable();
    table.integer('lonelyLevel').notNullable();
    table.string('image')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
