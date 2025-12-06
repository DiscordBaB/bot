const Sequelize = require('sequelize');
const cfg = require('/home/ken/.dbab-config/dbab.json');
// @ts-ignore
const sequelize = new Sequelize(cfg.mysql.database, cfg.mysql.user, cfg.mysql.password,{
    dialect: 'mysql',
    logging: console.log,
    host: cfg.mysql.host,
    port: cfg.mysql.port
});
export { sequelize }
export { Sequelize }