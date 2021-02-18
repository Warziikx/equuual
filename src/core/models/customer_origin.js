const DataTypes = require("sequelize/lib/data-types");

module.exports = function (sequelize) {
	const CustomerOrigin = sequelize.define(
		"customer_origin",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			origin_name: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
		},
		{
			tableName: "customer_origin",
			timestamps: false,
		}
	);
	CustomerOrigin.associate = (models) => {
		CustomerOrigin.hasMany(models.customer, {
			as: "customer",
			foreignKey: "origin_id",
			sourceKey: "id",
		});
	};
	return CustomerOrigin;
};
