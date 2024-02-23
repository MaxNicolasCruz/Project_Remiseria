import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { logout } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

function Header() {
	const { isAutheticated } = useAuth();

	function logoutFc() {
		logout().then((res) => {
			window.location.reload();
		});
	}

	return (
		<header className="w-full bg-yellow-400">
			<div className="flex flex-col items-center sm:flex-row justify-evenly sm:max-w-4xl sm:ml-auto sm:mr-auto">
				<div className="w-20 mt-1 sm:mb-1">
					<Link to="/">
						<img
							src="/logo.png"
							className="w-full h-full bg-slate-400 rounded-full cursor-pointer hover:scale-110 transition-all"
							alt="logo"
						></img>
					</Link>
				</div>
				<div className="flex items-center relative mt-2 mb-2">
					{
						//elimina la x del input que viene por defecto
					}
					<style>
						{`
      						.sn-none::-webkit-search-cancel-button,
      						.sn-none::-webkit-search-clear-button {
        						-webkit-appearance: none;
        						appearance: none;
        						display: none;
								}`}
					</style>
					<input
						type="search"
						name="search"
						className="rounded mt-1 pl-1 outline-none appearance-none sn-none"
						placeholder="Search"
					></input>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 right-1 top-1.5 absolute"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</div>
				<ul className="flex flex-col items-center sm:flex-row sm:justify-center">
					<li className="font-semibold flex border-gray-700 cursor-pointer sm:mr-2.5 focus:ring-1 focus:ring-slate-400 rounded">
						Rating
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 pt-1 sm:pb-0.5 sm:pr-1.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
							/>
						</svg>
					</li>
					<li className="font-semibold flex border-gray-700 cursor-pointer focus:ring-1 focus:ring-slate-400 rounded">
						Filters
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 pt-0.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
							/>
						</svg>
					</li>
				</ul>
				<div className="mb-2 mt-2">
					{isAutheticated ? (
						<Button onClick={logoutFc}>Logout</Button>
					) : (
						<>
							<Link to={"/login"}>
								<Button>Login</Button>
							</Link>
							<Link to={"/register"}>
								<Button>Register</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}

export default Header;
