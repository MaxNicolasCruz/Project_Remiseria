function CardService({user}) {
	return (
		<div className="card bg-slate-300 mx-auto">
			<div className="h-[300px]">
				<img
					src={user.image}
					alt="goku"
					className="w-full h-full  object-contain pt-3"
				/>
			</div>
			<div className="flex flex-col items-center p-2">
				<span>Name: {user.name}</span>
				<span>Locate: {user.city}</span>
				<span>Rating: {user.rating}</span>
				<span>Status: {user.state}</span>
			</div>
		</div>
	);
}

export default CardService;
