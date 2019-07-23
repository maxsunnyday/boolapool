document.addEventListener('DOMContentLoaded', function(){
	const ulEl = document.querySelector('ul')
	const tbody = document.querySelector('tbody')

	//Display Trips
	fetch("http://localhost:3000/trips")
	.then(response => response.json())
	.then(trips => {
		

		for (let trip of trips) {
			tbody.innerHTML += `<tr>
									<td>${trip.destination}</td>
									<td>${trip.address}</td>
									<td> - </td>
									<td>${trip.users.length}/${trip.capacity}</td>
								</tr>`
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
			console.log(trip)
			ulEl.innerHTML += `<li class="contained"><h2>${trip.destination} ${trip.address} 1/${trip.capacity}</h2>`
		})
	})
})

