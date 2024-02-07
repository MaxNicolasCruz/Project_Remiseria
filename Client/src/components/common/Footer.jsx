import LinksFooter from "../ui/LinksFooter";
import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
function Footer() {
	let enlaces = [
		{
			title: "Compañía",
			links: [
				{ to: "/sobre-nosotros", label: "Sobre Nosotros" },
				{ to: "/politica-privacidad", label: "Política de Privacidad" },
				{ to: "/terminos-condiciones", label: "Términos y Condiciones" },
				{ to: "/afiliacion", label: "Afiliación" },
			],
		},
		{
			title: "Navegacion",
			links: [
				{ to: "/", label: "Inicio" },
				{ to: "/login", label: "Iniciar Session" },
				{ to: "/register", label: "Registrarse" },
				{ to: "/profile", label: "Perfil" },
			],
		},
		{
			title: "Redes Sociales",
			links: [
				{ to: "/facebok", label: <FaFacebook /> },
				{ to: "/instagram", label: <FaInstagram /> },
				{ to: "/x", label: <FaXTwitter /> },
				{ to: "/youtube", label: <FaYoutube /> },
			],
		},
	];
	return (
		<footer>
			<div className="bg-gray-800 py-3 sm:flex sm:items-start sm:justify-around lg:justify-evenly">
				<LinksFooter props={enlaces[0]}></LinksFooter>
				<LinksFooter props={enlaces[1]}></LinksFooter>
				<div className="text-center text-gray-50 p-2">
					<h3 className="border-b-2 border-yellow-400 inline-block cursor-default hover:border-b-[3px] transition font-bold">
						Redes Sociales
					</h3>

					<ul className="py-3 flex justify-evenly max-w-[234px] mx-auto  lg:flex-col lg:items-center lg:h-[120px]  ">
						<li>
							<Link to={"/facebok"}>
								<FaFacebook className="hover:scale-105 transition text-lg"/>
							</Link>
						</li>
						<li>
							<Link to={"/intagram"}>
								<FaInstagram className="hover:scale-105 transition text-lg"/>
							</Link>
						</li>
						<li>
							<Link to={"/xTwitter"}>
								<FaXTwitter className="hover:scale-105 transition text-lg"/>
							</Link>
						</li>
						<li>
							<Link to={"/youtube"}>
								<FaYoutube className="hover:scale-105 transition text-lg"/>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
