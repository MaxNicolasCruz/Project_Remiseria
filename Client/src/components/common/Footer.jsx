import LinksFooter from "../ui/LinksFooter";
import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
function Footer() {
	let enlaces = [
		{
			title: "Agency",
			links: [
				{ to: "/about-us", label: "About Us" },
				{ to: "/policy-privacy", label: "Policy & Privacy" },
				{ to: "/terms-and-conditions", label: "Terms and Conditions" },
				{ to: "/affiliation", label: "Affiliation" },
			],
		},
		{
			title: "Navigate",
			links: [
				{ to: "/", label: "Home" },
				{ to: "/login", label: "Logn" },
				{ to: "/register", label: "Register" },
				{ to: "/profile", label: "Profile" },
			],
		},
		{
			title: "Social networks",
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
					Social networks
					</h3>

					<ul className="py-3 flex justify-evenly max-w-[234px] mx-auto  lg:flex-col lg:items-center lg:h-[120px]  ">
						<li>
							<Link to={"/facebok"}>
								<FaFacebook className="hover:scale-105 transition text-lg" />
							</Link>
						</li>
						<li>
							<Link to={"/intagram"}>
								<FaInstagram className="hover:scale-105 transition text-lg" />
							</Link>
						</li>
						<li>
							<Link to={"/xTwitter"}>
								<FaXTwitter className="hover:scale-105 transition text-lg" />
							</Link>
						</li>
						<li>
							<Link to={"/youtube"}>
								<FaYoutube className="hover:scale-105 transition text-lg" />
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
