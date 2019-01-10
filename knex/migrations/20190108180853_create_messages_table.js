

exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function(table) {
    table.increments();
		table.integer('user_one').notNullable().references('id').inTable('users');
    table.integer('user_two').notNullable().references('id').inTable('users');
    table.string('message', 500).notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages')
};

