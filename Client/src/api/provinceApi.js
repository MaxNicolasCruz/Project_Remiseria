import axios from "axios";

const instance = axios.create({
	baseURL: `https://apis.datos.gob.ar/georef/api`
});

export const getProvices = () => {
	return instance.get("/provincias");
};


export const getProvincesByName = (province) => {
	return instance.get(`/provincias?nombre=${encodeURIComponent(province)}`);
};

