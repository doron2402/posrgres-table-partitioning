
exports.up = function(knex, Promise) {
  const MASTER_TABLE = 'timeseries_master';
  return Promise.all([
    knex.schema.withSchema('public').createTableIfNotExists(MASTER_TABLE, (table) => {
      table.specificType('src_id', 'serial');
      table.timestamp('timestamp');
      table.jsonb('body').comment('body JSON');
      table.timestamp('received_at').defaultTo(knex.fn.now());
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ])
  .then((res) => {
    console.log(res);
    promises = [];
    for (let index = 1000; index < 1100; index++) {
      const tableName = `timeseries_child_${index}`;
      promises.push(knex.raw(`CREATE TABLE ${tableName} (CHECK src_id = ${index}) INHERITS(${MASTER_TABLE})`));
    }
    return Promise.all(promises)
    .then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  })
  .catch((err) => {
    console.error(err);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('timeseries_master')
  ]).then((res) => {
    const promises = [];
    for (let index = 1000; index < 1100; index++) {
      promises.push(knex.schema.dropTable(`timeseries_child_${index}`));
    }
    return Promise.all(promises)
    .then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  })
  .catch((err) => {
    console.error(err);
  });
};
