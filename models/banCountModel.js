const { sqlize, SQLize } = require('../databases/db')
class BanCount extends Model {}
BanCount.init(
    {
        id: {
            type: SQLize.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: SQLize.STRING,
            unique: false,
            allowNull: false,
        },
        serverID: {
            type: SQLize.STRING,
            allowNull: false,
            unique: true,
        },
        count: {
            type: SQLize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sqlize,
        freezeTableName: true,
        tableName: 'bancounts',
        modelName: 'BanCount'
    }
);
(async () => {
    await BanCount.sync()
})();

module.exports = BanCount