const DataTypes = require("sequelize/lib/data-types");

module.exports = function (sequelize) {
	const Friend = sequelize.define(
		"friend",
		{
			customer_id_1: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				references: {
					model: "customer",
					key: "id",
				},
			},
			customer_id_2: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				references: {
					model: "customer",
					key: "id",
				},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			accepted : {
				type : DataTypes.BOOLEAN,
				allowNull: true,
			}
		},
		{
			tableName: "friend",
		}
	);

	return Friend;
};
