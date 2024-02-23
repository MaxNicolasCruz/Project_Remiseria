import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function protectedRoute() {
	const { loading, isAutheticated } = useAuth();
	if (loading) return <h1>loading...</h1>;
	if (!loading && !isAutheticated) return <Navigate to={"/login"} replace />;
	return <Outlet />;
}

export default protectedRoute;
