'use strict';

const MASTER_TABLE = 'timeseries_master';
const SRC_ID_STARTS_AT = 1;
const SRC_ID_ENDS_AT = 100;

/**
 * This will allow us to to have smaller indexes
 * -- insert into timeseries_master (src_id, timestamp, body)
 * -- values (20, '2017-01-01T00:00:00.000Z', '{"value_a": 30, "value_b": 20, "value_c": 10 }');
 * -- select * from timeseries_master where src_id = 20;
 */

exports.up = function(knex, Promise) {

  return knex.schema.withSchema('public').hasTable(MASTER_TABLE)
  .then((exists) => {
    if (!exists) {
      return knex.schema.withSchema('public').createTable(MASTER_TABLE, (table) => {
        table.specificType('src_id', 'serial');
        table.timestamp('timestamp');
        table.jsonb('body').comment('body JSON');
        table.timestamp('received_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .then((res) => {
        promises = [];
        for (let index = DRONE_ID_STARTS_AT; index < DRONE_ID_ENDS_AT; index++) {
          const tableName = `timeseries_child_${index}`;
          promises.push(knex.raw(`CREATE TABLE ${tableName} (CHECK (src_id = ${index})) INHERITS (${MASTER_TABLE})`));
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
    }
  }).catch((err) => {
    console.error(err);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('timeseries_master')
  ]).then((res) => {
    const promises = [];
    for (let index = DRONE_ID_STARTS_AT; index < DRONE_ID_ENDS_AT; index++) {
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
