const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_permision', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    permisions_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permisions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_permision',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_user_permision_user1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "fk_user_permision_permisions1_idx",
        using: "BTREE",
        fields: [
          { name: "permisions_id" },
        ]
      },
    ]
  });
};
