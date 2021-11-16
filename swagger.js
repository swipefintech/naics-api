module.exports = {
  apis: ['./routes/*.js'],
  definition: {
    basePath: '/api',
    explorer: true,
    info: {
      title: 'NAICS',
      version: '1.0.0',
    },
    swagger: '2.0',
  },
};
