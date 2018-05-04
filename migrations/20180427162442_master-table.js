'use strict';

const MASTER_TABLE = 'timeseries_master';
const SRC_ID_STARTS_AT = 1000;
const SRC_ID_ENDS_AT = 1015;
const START_YEAR = 2016;
const END_YEAR = 2020;

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
        table.timestamp('ts', true).notNullable();
        table.string('type');
        table.jsonb('body').comment('body JSON');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .then((res) => {
        const promises = [];
        for (let index = SRC_ID_STARTS_AT; index < SRC_ID_ENDS_AT; index++) {
          for (let year = START_YEAR; year < END_YEAR; year++) {
            const tableName = `timeseries_child_${index}_${year}`;
            const sqlQuery = `CREATE TABLE ${tableName} (
              CHECK (
                src_id = ${parseInt(index)}
                AND ts >= timestamp '${year}-01-01'
                AND ts < timestamp '${(year+1)}-01-01'
              )
            )
            INHERITS (${MASTER_TABLE});`;
            promises.push(knex.raw(sqlQuery));
          }// eo for by year
        } // eo for by src_id
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
    for (let index = SRC_ID_STARTS_AT; index < SRC_ID_ENDS_AT; index++) {
      for (let year = START_YEAR; year < END_YEAR; year++) {
        const tableName = `timeseries_child_${index}_${year}`;
        promises.push(knex.schema.dropTable(tableName));
      }// eo for by year
    } // eo for by src_id

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
