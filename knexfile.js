'use strict';

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.POSTGRES_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds',
    }
  },

  staging: {
    client: 'postgresql',
    connection: process.env.POSTGRES_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds',
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.POSTGRES_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds',
    }
  }

};
