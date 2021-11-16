exports.up = function migrate(knex) {
  return knex.schema.alterTable('codes', (table) => {
    table.integer('parent_id')
      .unsigned()
      .references('id')
      .inTable('codes')
      .onDelete('set null');
  });
};

exports.down = function rollback(knex) {
  return knex.schema.alterTable('codes', (table) => {
    table.dropForeign('parent_id');
    table.dropColumn('parent_id');
  });
};
