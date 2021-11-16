const env = process.env.NODE_ENV || 'local';
const config = require('../knexfile')[env];

module.exports = require('knex')(config);
