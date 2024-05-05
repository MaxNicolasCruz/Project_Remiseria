import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Header from "./components/common/Header";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./pages/Profile";
import Footer from "./components/common/Footer";
import User from "./pages/User";
import Chat from "./components/ui/Chat";
import Chats from "./pages/Chats";
import Orders from "./pages/Orders";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<div className="flex flex-col min-h-screen">
					<Header />
					<main className="flex-grow">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/user/chat" element={<Chat />} />
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Login />} />
							<Route element={<ProtectedRoute />}>
								<Route path="/chats" element={<Chats />} />
								<Route path="/profile" element={<Profile />} />
								<Route path="/order" element={<Orders />} />
								<Route path="/user/:id/:name" element={<User />} />
							</Route>
						</Routes>
					</main>
					<Footer />
				</div>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
