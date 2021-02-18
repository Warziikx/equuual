/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	let Option = sequelize.define(
		"option",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
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
			tableName: "option",
		}
	);
	Option.associate = (models) => {
		Option.belongsToMany(models.group, { through: "group_option", as: "group", foreignKey: "id_option", onDelete: "cascade" });
	};
	return Option;
};
