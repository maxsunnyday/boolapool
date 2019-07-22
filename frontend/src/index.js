document.addEventListener('DOMContentLoaded', function(){
	const mainEl = document.querySelector('main')

	//Display Trips
	fetch("http://localhost:3000/trips")
	.then(response => response.json())
	.then(trips => {
		

		for (let trip of trips) {
			mainEl.innerHTML += `<h1>${trip.destination}</h1>
								<h2>${trip.address}</h2>
								<h2>${trip.users.length}/${trip.capacity}</h2>`
		}
	})

	//Create new Trip
	document.addEventListener('submit', function(e){
		e.preventDefault()
	
		fetch("http://localhost:3000/trips", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				destination: e.target.children[1].value,
				address: e.target.children[3].value,
				capacity: e.target.children[5].value,
				start_time: e.target.children[7].value,
				end_time: e.target.children[9].value
			})
		}).then(response => response.json())
		.then(trip => {
			mainEl.innerHTML += `<h1>${trip.destination}</h1>
								<h2>${trip.address}</h2>
								<h2>1/${trip.capacity}</h2>` //Hardcoded 1
		})
	})
})

