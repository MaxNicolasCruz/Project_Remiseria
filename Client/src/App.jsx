import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/Home";
import Header from "./components/common/Header";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./pages/Profile";
import Footer from "./components/common/Footer";
import User from "./pages/User";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<div className="flex flex-col min-h-screen">
					<Header />
					<div className="flex-grow">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Login />} />
							<Route element={<ProtectedRoute />}>
								<Route path="/profile" element={<Profile />} />
								<Route path="/user/:id/:name" element={<User />} />
							</Route>
						</Routes>
					</div>
					<Footer />
				</div>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
