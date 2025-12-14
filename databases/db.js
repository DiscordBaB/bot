const Sequelize = require('sequelize');
const os = require('os')
home_dir = os.homedir();
const cfg = require(`${home_dir}/.dbab-config/dbab.json`);
// @ts-ignore
const sequelize = new Sequelize(cfg.mysql.database, cfg.mysql.user, cfg.mysql.password,{
    dialect: 'mysql',
    logging: console.log,
    host: cfg.mysql.host,
    port: cfg.mysql.port
});
module.exports = { sequelize: sequelize, Sequelize: Sequelize }