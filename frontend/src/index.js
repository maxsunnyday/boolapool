const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

document.addEventListener('DOMContentLoaded', function(){

	

	//Login method
	if (localStorage.getItem('user_id')) {
		const userId = localStorage.getItem('user_id')

		// fetch(`${BASE_URL}/users/${userId}`)
		// .then(res => res.json())
		// .then(user => {
		// 	displayHomePage(user)
		// })

		//Display Trips
		fetch("http://localhost:3000/trips")
		.then(response => response.json())
		.then(trips => {
			const buttonDiv = document.querySelector('div.button')
			
			const button = document.createElement('button')
			button.id ="logout"
			button.innerText="Logout"
			console.log(button)
			buttonDiv.append(button)
		  
			// Logout functionality
			const logoutButton = document.querySelector('button#logout')

			console.log(logoutButton)
			logoutButton.addEventListener('click', function(e){
				localStorage.removeItem('user_id')
				displayLogin()
			})

			const tbody = document.querySelector('tbody')
		
			// Logout functionality

			for (let trip of trips) {
				tbody.innerHTML += `<tr>
										<td>${trip.destination}</td>
										<td>${trip.address}</td>
										<td> - </td>
										<td>${trip.users.length}/${trip.capacity}</td>
									</tr>`
			}
			console.log(tbody)
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
				ulEl.innerHTML += `<li class="contained"><h2>${trip.destination} ${trip.address} 1/${trip.capacity}</h2>`
			})
		})
	} else {
		displayLogin()
	}
})