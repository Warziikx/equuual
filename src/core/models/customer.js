const DataTypes = require("sequelize/lib/data-types");

module.exports = function (sequelize) {
	const Customer = sequelize.define(
		"customer",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			login: {
				type: DataTypes.STRING(30),
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: true,
				get() {
					return null;
				},
			},
			displayName: {
				type: DataTypes.STRING(90),
				allowNull: true,
				field: "display_name",
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			img_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			provider_id: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},
			reset_password_token: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
		},
		{
			tableName: "customer",
		}
	);
	Customer.associate = (models) => {
		Customer.hasMany(models.device, {
			as: "devices",
			foreignKey: "customer_id",
			sourceKey: "id",
		});
		Customer.hasMany(models.group, {
			foreignKey: "creator_id",
			targetKey: "id",
			as: "created",
		});
		Customer.belongsToMany(models.customer, {
			through: models.friend,
			as: "friends",
			foreignKey: "customer_id_1",
		});
		Customer.belongsToMany(models.customer, {
			through: models.friend,
			as: "userFriends",
			foreignKey: "customer_id_2",
		});
		Customer.belongsToMany(models.group, {
			through: "group_member",
			as: "groups",
			foreignKey: "id_customer",
			onDelete: "cascade",
		});
		Customer.hasMany(models.spend, {
			foreignKey: "payer_id",
			targetKey: "id",
			as: "spends",
		});
		Customer.belongsTo(models.customer_img, {
			as: "customerImg",
			foreignKey: "img_id",
		});
		Customer.belongsTo(models.customer_origin, {
			as: "origin",
			foreignKey: "origin_id",
		});
		Customer.belongsToMany(models.spend, { through: "spend_customer", as: "participate", foreignKey: "customer_id", onDelete: "cascade" });
		/*Customer.hasMany(models.customer, {
			through: "friend",
			as: "friend2",
			foreignKey: "customer_id_2",
			onDelete: "cascade",
		});*/
	};
	return Customer;
};
