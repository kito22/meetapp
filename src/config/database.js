module.exports = {
  dialect: 'postgres',
  host: '192.168.99.100',
  password: 'docker',
  database: 'meetapp',
  username: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
