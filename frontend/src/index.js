const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

document.addEventListener('DOMContentLoaded', function(){
	//Login method
	if (localStorage.getItem('user_id')) {
		const userId = localStorage.getItem('user_id')

		fetch(`${BASE_URL}/users/${userId}`)
		.then(res => res.json())
		.then(user => {
			displayHomePage(user)
		})

		const ulEl = document.querySelector('ul.container')

		//Display Trips
		fetch("http://localhost:3000/trips")
		.then(response => response.json())
		.then(trips => {
			for (let trip of trips) {
				console.log(trip)
				ulEl.innerHTML += `<li class="contained">
									<h2>${trip.destination} ${trip.address} ${trip.users.length}/${trip.capacity}</h2>
									</li>`
			}
		})

		//Create new Trip
		document.getElementsByClassName("new-trip")[0].addEventListener('submit', function(e){
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
				ulEl.innerHTML += `<li class="contained"><h2>${trip.destination}</h2>
									<h3>${trip.address}</h3>
									<h3>1/${trip.capacity}</h3></li>` //Hardcoded 1
			})
		})
	} else {
		displayLogin()
	}
})