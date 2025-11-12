const { SQLize, sqlize, Model } = require('../databases/db')
class ACL extends Model {

}
ACL.init(
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
        password_hash: {
            type: SQLize.STRING,
            allowNull: false,
        },
        createdAt: {
            type: SQLize.DATE,
            allowNull: false,
        },
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