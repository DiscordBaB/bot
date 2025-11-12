const { SQLize, sqlize } = require('../databases/db')
class Appeal extends Model {}
Appeal.init(
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
        reason: {
            type: SQLize.TEXT,
            allowNull: false,
        },
        disclaimer: {
            type: SQLize.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: SQLize.DATE,
            allowNull: false,
        },
        serverID: {
            type: SQLize.STRING,
            allowNull: false
        }
    },
    {
        sqlize,
        freezeTableName: true,
        tableName: 'appeals',
        timestamps: true,
        modelName: 'Appeal'
    }

);
(async () => {
    await Appeal.sync()
})();
module.exports = Appeal