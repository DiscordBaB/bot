const SQLize = require('sequelize');
const mysql_config = require('/home/ken/.dbab-config/dbab.json').mysql;
const sqlize = new SQLize({
    username: mysql_config.user,
    password: mysql_config.password,
    host: mysql_config.host,
    port: mysql_config.port,
    dialect: 'mysql',
    database: mysql_config.database,
    logging: console.log,
});
sqlize.authenticate().then(() => {
    console.log('Connection to DB has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
module.exports = { sqlize, SQLize }