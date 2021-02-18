/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"group_member",
		{
			id_group: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			id_customer: {
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
			tableName: "group_member",
		}
	);
};
