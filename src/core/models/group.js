const DataTypes = require("sequelize/lib/data-types");

module.exports = function (sequelize) {
	const Group = sequelize.define(
		"group",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			creator_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			tableName: "group",
		}
	);
	Group.associate = (models) => {
		Group.belongsTo(models.customer, {
			as: "creator",
			foreignKey: "creator_id",
		});
		Group.belongsToMany(models.customer, { through: "group_member", as: "member", foreignKey: "id_group", onDelete: "cascade" });
		Group.hasMany(models.spend, {
			foreignKey: "group_id",
			targetKey: "id",
			as: "spends",
		});
		Group.belongsToMany(models.option, { through: "group_option", as: "options", foreignKey: "id_group", onDelete: "cascade" });
	};
	return Group;
};
