function label({ children, ...props }) {
	return (
		<label className="mb-1 mt-2 block" {...props}>
			{children}
		</label>
	);
}

export default label;
