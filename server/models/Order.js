import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

// another table
import { Client } from "./Client.js";
import { Service } from "./Service.js";

export const Order = sequelize.define("Order", {
	// Model attributes are defined here
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	id_client: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Client, // 'Movies' would also work
			key: "id",
		},
	},
	id_service: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Service, // 'Movies' would also work
			key: "id",
		},
	},
	date: {
		type: DataTypes.DATE,
	},
	method_pay: {
		type: DataTypes.INTEGER,
	},
	status: {
		type: DataTypes.ENUM(
			"Enviada",
			"En espera",
			"Aceptada",
			"Rechazada",
			"Realizada"
		),
	},
});

// relations

Client.hasMany(Order, {
	foreignKey: "id_client",
	targetKey:'id'
});

Service.hasMany(Order, {
	foreignKey: "id_service",
	targetKey: "id",
});

Order.belongsTo(Client, {
	foreignKey: "id_client",
	sourceKey: "id",
});

Order.belongsTo(Service, {
	foreignKey: "id_service",
	targetKey: "id",
});
