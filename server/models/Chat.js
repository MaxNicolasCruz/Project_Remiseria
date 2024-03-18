import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

// another table
// import { Client } from "./Client.js";
// import { Service } from "./Service.js";

export const Chat = sequelize.define(
	"Chat",
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		id_receiver: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		id_sender: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sender_type: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		receiver_type: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		id_type_message: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		message: {
			type: DataTypes.TEXT,
		},
		date: {
			type: DataTypes.DATE,
		},
	},
	{
		timestamps: false, // Esta línea desactiva las columnas createdAt y updatedAt
	}
);


