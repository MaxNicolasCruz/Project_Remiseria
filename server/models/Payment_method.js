import { DataTypes } from 'sequelize';
import { sequelize } from "../database/database.js";

// another table
import { Service } from "./Service.js";

export const Payment_method = sequelize.define('Payment_method', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    method: {
        type: DataTypes.STRING(30)
    }
}, {
    timestamps: false // Esta línea desactiva las columnas createdAt y updatedAt
});


Payment_method.hasMany(Service, { // Service-> Service es el valor de alias en Service.js
    as: "services", // El nombre del modelo pero en plural
    foreignKey: "method_of_payment"
})

Service.belongsTo(Payment_method, { // models.PaymentMethod -> PaymentMethods es el valor de alias en PaymentMethods.js
    as: "methodUser",
    foreignKey: "method_of_payment"
})