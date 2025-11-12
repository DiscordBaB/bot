const { SQLize, sqlize, Model } = require('../databases/db')
class Bans extends Model {

}
Bans.init(
    {
        id: {
            type: SQLize.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: SQLize.STRING,
            unique: true,
            allowNull: false
        },
        serverID: {
            type: SQLize.STRING,
            allowNull: false,
        },
        createdAt: {
            type: SQLize.DATE,
            allowNull: false,
        },
        expiresAt: {
            type: SQLize.DATE,
            allowNull: true // If null, ban is permanent
        }
    },
    {
        sqlize,
        freezeTableName: true,
        tableName: 'ACL',
        modelName: 'ACL',
        timestamps: true
    }

);
(async () => {
    await ACL.sync()
})();
module.exports = ACL