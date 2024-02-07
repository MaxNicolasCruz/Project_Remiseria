function Button({ children, ...props }) {
	return (
		<button
			className={"font-semibold mr-2 bg-gray-400 cursor-pointer pl-2 pr-2 pt-1.5 pb-1.5 rounded hover:scale-110 transition hover:bg-gray-300 focus:ring-2 focus:ring-white w-16 min-w-max"}
			{...props}
		>
			{children}
		</button>
	);
}

export default Button;
