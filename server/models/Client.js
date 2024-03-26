import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Client = sequelize.define(
	"Client",
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.STRING(30),
		},
		password: {
			type: DataTypes.STRING(100),
		},
		name: {
			type: DataTypes.STRING(30),
		},
		last_name: {
			type: DataTypes.STRING(30),
		},
		genre: {
			type: DataTypes.ENUM("Male", "Female", "Other"),
		},
		description: {
			type: DataTypes.TEXT(),
		},
		date_of_birth: {
			type: DataTypes.STRING(30),
		},
		city: {
			type: DataTypes.STRING(30),
		},
		country: {
			type: DataTypes.STRING(30),
		},
		number_phone: {
			type: DataTypes.STRING(15),
		},
		number_document: {
			type: DataTypes.STRING(15),
		},
		image: {
			type: DataTypes.STRING(100),
		},
		socket_id: {
			type: DataTypes.STRING(200),
		},
	},
	{
		timestamps: false, // Esta línea desactiva las columnas createdAt y updatedAt
	}
);
