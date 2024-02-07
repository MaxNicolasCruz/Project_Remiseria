import { Link } from "react-router-dom";
import { FaFacebook,FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function LinksFooter({props}) {
	return (
		<div className="text-center text-gray-400 p-2">
			<h3 className="border-b-2 text-white border-yellow-400 font-bold inline-block cursor-default hover:border-b-[3px] transition">{props.title}</h3>

			<ul className="py-3">
				{props.links.map((link, index) => (
					<li key={index} className="hover:scale-105 hover:text-white transition">
						<Link to={link.to}>{link.label}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default LinksFooter;
