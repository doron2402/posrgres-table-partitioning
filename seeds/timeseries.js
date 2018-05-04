
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('timeseries_master').del()
    .then(function () {
      // Inserts seed entries
      return knex('timeseries_master').insert([
        {
          src_id: 1001,
          ts: '2017-06-01T00:00:00.000Z',
          type: 'aa',
          body: '{"cog": 30, "sog": 30}'
        },
        {
          src_id: 1001,
          ts: '2017-06-02T00:00:00.000Z',
          type: 'bb',
          body: '{"cog": 30, "sog": 30}'
        },
        {
          src_id: 1001,
          ts: '2019-06-01T00:00:00.000Z',
          type: 'aa',
          body: '{"cog": 30, "sog": 30}'
        },
        {
          src_id: 1001,
          ts: '2019-06-02T00:00:00.000Z',
          type: 'aa',
          body: '{"cog": 30, "sog": 30}'
        }
      ]);
    });
};
