import { z } from "zod";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";

let validation = {
	email: z
		.string({
			message: "Email is required",
		})
		.email({
			message: "Invalid Email",
		})
		.refine(
			async (value) => {
				const emailFoundClient = await Client.findOne({
					where: { email: value },
				});
				const emailFoundService = await Service.findOne({
					where: { email: value },
				});
				return !(emailFoundClient || emailFoundService);
			},
			{
				message: `el email ya se utilizo `,
			}
		),
	password: z
		.string({
			message: "Password is required",
		})
		.min(8, {
			message: "must have at least 8 characters",
		}),
	name: z.string({
		message: "Empty Field",
	}),
	lastName: z.string({
		message: "Empty Field",
	}),
	city: z.string({
		message: "Empty Field",
	}),
	country: z.string({
		message: "Empty Field",
	}),
	genre: z 
		.enum(["Male", "Female", "Other"]),
	numberPhone: z
		.string()
		.refine((value) => !isNaN(Number(value)), {
			message: "must be a number",
		})
		.transform((value) => Number(value))
		.refine((value) => value > 9, {
			message: "Must have at least 9 characters",
		}),
	numberDocument: z
		.string()
		.refine((value) => !isNaN(Number(value)), {
			message: "must be a number",
		})
		.transform((value) => Number(value))
		.refine((value) => value > 7, {
			message: "must have at least 7 characters",
		}),
	dateOfBirth: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: "Incorrect date format. Must be YYYY-MM-DD",
		})
		.refine(
			(value) => {
				const minAge = 18;
				const today = new Date();
				const eighteenYearsAgo = new Date(
					today.getFullYear() - minAge,
					today.getMonth(),
					today.getDate()
				);
				return new Date(value) <= eighteenYearsAgo;
			},
			{
				message: "must be of legal age",
			}
		),
	vehicleType: z
		.string({
			message: "debe ser de tipo string",
		})
		.min(7, {
			message: "must have at least 7 characters",
		}),
	workingHours: z
		.string() // Asumo que en el formulario estás obteniendo la hora como string
		.refine((value) => !isNaN(Number(value)), {
			message: "must be a number",
		})
		.transform((value) => Number(value)) // Convierte a número
		.refine((value) => value >= 2 && value <= 4, {
			message: "should be between 2 and 4",
		}),
	methodOfPayment: z
	.enum(['Paypal', 'Efectivo', 'Mercado Pago', 'Uala']),
	state: z
	.enum(['En servicio','Fuera de Servicio','En Pedido']),
};

export const registerClient = z.object({
	email: validation.email,
	password: validation.password,
	name: validation.name,
	lastName: validation.lastName,
	genre: validation.genre,
	dateOfBirth: validation.dateOfBirth,
});

export const registerService = z.object({ ...validation });

export const login = z.object({
	email: z
		.string({
			message: "Email is required",
		})
		.email({
			message: "Invalid Email",
		}),
	password: z
		.string({
			message: "Password is required",
		})
		.min(8, {
			message: "must have at least 8 characters",
		}),
});

export const updateClient = z.object({
	name: validation.name,
	lastName: validation.lastName,
	city: validation.city,
	country: validation.country,
});

export const updateService = z.object({
	name: validation.name,
	lastName: validation.lastName,
	city: validation.city,
	country: validation.country,
	vehicleType: validation.vehicleType,
	workingHours: validation.workingHours,
	methodOfPayment: validation.methodOfPayment,
	state: validation.state,
});
