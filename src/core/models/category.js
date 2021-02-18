/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	let Category = sequelize.define(
		"category",
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
			color: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			is_default: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
			illustration_path: {
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
			tableName: "category",
		}
	);
	Category.associate = (models) => {
		Category.hasMany(models.spend, {
			foreignKey: "category_id",
			targetKey: "id",
			as: "spend",
		});
	};
	return Category;
};
