/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"group_option",
		{
			id_group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			id_option: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
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
			tableName: "group_option",
		}
	);
};
