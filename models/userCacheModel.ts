const {Sequelize} = require('sequelize')
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../databases/db.js');
// Define attribute types for TypeScript
interface UserCacheAttributes {
  id: string;
  createdAt: Date;
  bannerURL?: string | null;
  avatarDecorationURL?: string | null;
  avatarURL?: string | null;
  username?: string | null;
  bot?: boolean | null;
  system?: boolean | null;
  nicknames?: any | null;
}

// Use the same shape for creation attributes (adjust if some fields are optional on create)
type UserCacheCreationAttributes = UserCacheAttributes;

class UserCache extends Model<UserCacheAttributes, UserCacheCreationAttributes>
  implements UserCacheAttributes {
  public id!: string;
  public createdAt!: Date;
  public bannerURL!: string | null;
  public avatarDecorationURL!: string | null;
  public avatarURL!: string | null;
  public username!: string | null;
  public bot!: boolean | null;
  public system!: boolean | null;
  public nicknames!: any | null;
}

UserCache.init(
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bannerURL: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatarDecorationURL: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatarURL: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    system: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    nicknames: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'user_cache',
    modelName: 'UserCache',
    timestamps: true
  }
);

// keep the original behavior of syncing on load
void (async () => {
  await UserCache.sync();
})();

module.exports = UserCache;