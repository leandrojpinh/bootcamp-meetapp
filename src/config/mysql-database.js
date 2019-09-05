module.exports = {
  dialect: 'mysql',
  host: '192.168.99.100',
  username: 'mysql',
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
