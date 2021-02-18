/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	let Spend = sequelize.define(
		"spend",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			payer_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			amount: {
				type: DataTypes.DOUBLE,
				allowNull: true,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			group_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			category_id: {
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
			tableName: "spend",
		}
	);
	Spend.associate = (models) => {
		Spend.belongsTo(models.group, {
			as: "group",
			foreignKey: "group_id",
		});
		Spend.belongsTo(models.customer, {
			as: "payer",
			foreignKey: "payer_id",
		});
		Spend.belongsTo(models.category, {
			as: "category",
			foreignKey: "category_id",
		});
		Spend.belongsToMany(models.customer, { through: "spend_customer", as: "percent_divide", foreignKey: "spend_id", onDelete: "cascade" });
	};
	return Spend;
};
