

exports.up = function(knex, Promise) {
  return knex.schema.createTable('replies', function(table) {
    table.increments();
		table.integer('commentId').notNullable().references('id').inTable('comments');
    table.integer('userId').notNullable().references('id').inTable('users');
    table.string('reply').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('replies')
};

