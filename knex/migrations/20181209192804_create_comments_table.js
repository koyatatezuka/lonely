
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    table.increments();
		table.integer('userId').notNullable().references('id').inTable('users');
		table.string('comment', 1000).notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments')
};
