/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"spend_customer",
		{
			spend_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			customer_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			nb_part: {
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
			tableName: "spend_customer",
		}
	);
};
