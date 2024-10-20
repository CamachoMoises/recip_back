const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('group_permision', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'group',
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
    tableName: 'group_permision',
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
        name: "fk_group_permision_group1_idx",
        using: "BTREE",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "fk_group_permision_permisions1_idx",
        using: "BTREE",
        fields: [
          { name: "permisions_id" },
        ]
      },
    ]
  });
};
