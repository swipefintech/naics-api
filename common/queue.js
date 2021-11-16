const Bull = require('bull');

module.exports = new Bull('default', process.env.REDIS_URL);
