const DataTypes = require("sequelize/lib/data-types");

module.exports = function (sequelize) {
	const Device = sequelize.define(
		"device",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			udid: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			refreshKey: {
				type: DataTypes.STRING(255),
				allowNull: false,
				field: "refresh_key",
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
			tableName: "device",
		}
	);
	Device.associate = (models) => {
		Device.belongsTo(models.customer, {
			as: "customer",
			foreignKey: "customer_id",
		});
	};
	return Device;
};
