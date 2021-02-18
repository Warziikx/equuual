const DataTypes = require("sequelize/lib/data-types");

module.exports = function (sequelize) {
	const CustomerImg = sequelize.define(
		"customer_img",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			url: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
		},
		{
			tableName: "customer_img",
			timestamps: false,
		}
	);
	CustomerImg.associate = (models) => {
		CustomerImg.hasMany(models.customer, {
			as: "customer",
			foreignKey: "img_id",
			sourceKey: "id",
		});
	};
	return CustomerImg;
};
