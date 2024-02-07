import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

// another table
import { Service } from "./Service.js";

export const Timetable = sequelize.define('Timetable', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    timetable: {
        type: DataTypes.STRING(50)
    }
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});


Timetable.hasMany(Service, { // Service-> Service es el valor de alias en Service.js
    as: "services", // El nombre del modelo pero en plural
    foreignKey: "working_hours"
})

Service.belongsTo(Timetable, { // models.Timetable -> Timetables es el valor de alias en Timetables.js
    as: "timetableUser",
    foreignKey: "working_hours"
})