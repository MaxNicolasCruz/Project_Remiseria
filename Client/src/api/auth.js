import instance from "./axios";
// Agregar el interceptor de solicitud

export const registerClientRequest = (user) =>
	instance.post(`/client/register`, user, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const registerServiceRequest = (user) =>
	instance.post(`/service/register`, user, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const updateServiceRequest = (user) => {
	return instance.patch(`/service/update`, user, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const updateClientRequest = (user) =>
	instance.patch(`/client/update`, user, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const loginClientRequest = (user) =>
	instance.post(`/client/login`, user, {
		headers: {
			"Content-Type": "application/json",
		},
	});

export const loginServiceRequest = (user) =>
	instance.post(`/service/login`, user, {
		headers: {
			"Content-Type": "application/json",
		},
	});

export const getAllServiceRequest = () => instance.get(`/service/getUsers`);

export const getUserService = (id) => instance.get(`/service/user/${id}`);

export const getService = () => instance.get(`/service/profile`);

export const getClient = () => instance.get(`/client/profile`);

export const getChatClient = () => instance.get(`/client/getChats`);

export const getChatService = () => instance.get(`/service/getChats`);

export const logout = () => instance.post(`/client/logout`);

export const validToken = () => instance.get(`/validToken`);
