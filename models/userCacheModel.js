const { SQLize, sqlize } = require('../databases/db')

class UserCache extends Model {}
UserCache.init(
    {
        id: {
            type: SQLize.STRING,
            unique: true,
            allowNull: false
        },
        userObj: {
            type: SQLize.JSON,
            defaultValue: {
                id: null,
                createdAt: null,
                bannerURL: null,
                avatarDecorationURL: null,
                avatarURL: null,
                username: null,
                bot: null,
                system: null

            }
        },
        nicknames: {
            type: SQLize.JSON,
            allowNull: true,
            // {'server_id': 'nickname'}
            defaultValue: {},
        }
    },
    {
        sqlize,
        freezeTableName: true,
        tableName: 'user_cache',
        modelName: 'userCache'
    }

);
(async () => {
    await UserCache.sync()
})();
module.exports = UserCache