import { sequelize, Sequelize } from '../databases/db.js'
import { Model } from 'sequelize';
class BanCount extends Model {}
BanCount.init(
    {
        id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: Sequelize.STRING,
            unique: false,
            allowNull: false,
        },
        serverID: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        tableName: 'bancounts',
        modelName: 'BanCount',
        timestamps: true
    }
);
(async () => {
    await BanCount.sync()
})();

export default BanCount