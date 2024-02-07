import { createContext, useContext, useEffect, useState } from "react";
import {
	registerClientRequest,
	registerServiceRequest,
	loginClientRequest,
	loginServiceRequest,
	validToken,
	getClient,
	getService,
} from "../api/auth";
import Cookies from "js-cookie";
export const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(false);
	const [isAutheticated, setIsAutheticated] = useState(true);
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (errors.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errors]);

	// definir que tipo de session eligio el usuario
	const signup = async (user, typeRegister) => {
		try {
			if (typeRegister) {
				const res = await registerServiceRequest(user);
				console.log(res.data);
				setIsAutheticated(true);
				return;
			}
			const res = await registerClientRequest(user);
			console.log(res.data);
			setIsAutheticated(true);
		} catch (error) {
			console.log(error.response);
			setErrors([error.response.data]);
		}
	};

	const signin = async (user) => {
		try {
			const resClient = await loginClientRequest(user);
			console.log(resClient);
			setIsAutheticated(true);
		} catch (error) {
			console.log(error);
			if (error.response.status == 404) {
				try {
					const resService = await loginServiceRequest(user);
					console.log(resService);
					setIsAutheticated(true);
					return;
				} catch (error) {
					console.log(error);
					setErrors([error.response.data]);
					return;
				}
			}
			console.log(error.response);
			setErrors([error.response.data]);
		}
	};

	useEffect(() => {
		async function checkLogin() {
			const cookies = Cookies.get();

			if (!cookies.token) {
				setIsAutheticated(false);
				setLoading(false);
				setUser(null);
				return;
			}
			const dataToken = await validToken(cookies.token);
			if (!dataToken) {
				setIsAutheticated(false);
				setLoading(false);
				return;
			}
			setLoading(false);
			console.log(dataToken);
			try {
				const foundClient = await getClient(dataToken.data);
				setUser(foundClient.data);

				setIsAutheticated(true);
				console.log(foundClient);
				return;
			} catch (error) {
				console.log(error);
				if (error.response.status == 404) {
					const foundService = await getService(dataToken.data);
					console.log(foundService);
					setIsAutheticated(true);
					setUser(foundService.data);
					return;
				}
				setIsAutheticated(false);
				setLoading(false);
			}
		}
		checkLogin();
	}, []);
	return (
		<AuthContext.Provider
			value={{ signup, signin, user, errors, isAutheticated, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};
