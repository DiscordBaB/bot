import { Sequelize, sequelize } from '../databases/db.js'
import { Model } from 'sequelize';
class Appeal extends Model {}
Appeal.init(
    {
        id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        reason: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        disclaimer: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        serverID: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        tableName: 'appeals',
        timestamps: true,
        modelName: 'Appeal'
    }

);
(async () => {
    await Appeal.sync()
})();
export default Appeal