var DataTypes = require("sequelize").DataTypes;
var _group = require("./group");
var _user = require("./user");

function initModels(sequelize) {
  var group = _group(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  user.belongsTo(group, { as: "group", foreignKey: "group_id"});
  group.hasMany(user, { as: "users", foreignKey: "group_id"});

  return {
    group,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
