exports.up = function migrate(knex) {
  return knex.schema.createTable('codes', (table) => {
    table.increments();
    table.string('code', 6).notNullable().index();
    table.string('title').notNullable().index();
    table.bigInteger('businesses').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function rollback(knex) {
  return knex.schema.dropTable('codes');
};
