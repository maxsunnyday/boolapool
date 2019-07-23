const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

document.addEventListener('DOMContentLoaded', function(){

	const ulEl = document.querySelector('ul')
	

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
			let h1Tag = document.createElement("h1")
			h1Tag.innerText = "Welcome Back User"
			const logoutButton = document.createElement("button")
			logoutButton.id = "logout"
			logoutButton.innerText = "Logout"
			mainContainer.appendChild(h1Tag)
			mainContainer.appendChild(logoutButton)

			let tbody = document.querySelector('tbody')
		
			// Logout functionality
			logoutButton.addEventListener('click', function(e){
				localStorage.removeItem('user_id')
				displayLogin()
			})

			for (let trip of trips) {
				let start = new Date(trip.start_time)
				let end = new Date(trip.end_time)

				let start_formatted = start.getUTCFullYear() + "-" + appendLeadingZeroes(start.getUTCMonth() + 1) + "-" + appendLeadingZeroes(start.getUTCDate()) + " " + appendLeadingZeroes(start.getUTCHours()) + ":" + appendLeadingZeroes(start.getUTCMinutes())

				let end_formatted = end.getUTCFullYear() + "-" + appendLeadingZeroes(end.getUTCMonth() + 1) + "-" + appendLeadingZeroes(end.getUTCDate()) + " " + appendLeadingZeroes(end.getUTCHours()) + ":" + appendLeadingZeroes(end.getUTCMinutes())

				let tr = document.createElement("tr")

				tr.innerHTML = `<td>${trip.destination}</td>
				<td>${trip.address}</td>
				<td>${start_formatted} - ${end_formatted}</td>
				<td>${trip.users.length}/${trip.capacity}</td>
				<td><button class="join" data-id=${trip.id}>Join!</button></td>`

				tbody.appendChild(tr)
			}
			// console.log(tbody)
		})

		//Create new Trip
		document.addEventListener('submit', function(e){
			if (e.target.className === "new-trip") {
				e.preventDefault()

				let tbody = document.querySelector('tbody')

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
						end_time: e.target.children[9].value,
						user_id: userId
					})
				}).then(response => response.json())
				.then(trip => {
					let start = new Date(trip.start_time)
					let end = new Date(trip.end_time)

					let start_formatted = start.getUTCFullYear() + "-" + appendLeadingZeroes(start.getUTCMonth() + 1) + "-" + appendLeadingZeroes(start.getUTCDate()) + " " + appendLeadingZeroes(start.getUTCHours()) + ":" + appendLeadingZeroes(start.getUTCMinutes())

					let end_formatted = end.getUTCFullYear() + "-" + appendLeadingZeroes(end.getUTCMonth() + 1) + "-" + appendLeadingZeroes(end.getUTCDate()) + " " + appendLeadingZeroes(end.getUTCHours()) + ":" + appendLeadingZeroes(end.getUTCMinutes())

					let tr = document.createElement("tr")

					tr.innerHTML = `<td>${trip.destination}</td>
					<td>${trip.address}</td>
					<td>${start_formatted} - ${end_formatted}</td>
					<td>${trip.users.length}/${trip.capacity}</td>
					<td><button class="join" data-id=${trip.id}>Join!</button></td>`

					tbody.appendChild(tr)
				})
			}
		})

		document.querySelector("tbody").addEventListener("click", function(e) {
			if (e.target.className === "join") {
				fetch(BASE_URL + "/usertrips", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify({
						user_id: userId,
						trip_id: e.target.dataset.id
					})
				}).then(response => response.json())
				.then(usertrip => {
					console.log(usertrip)
					const tripCapacity = e.target.parentElement.previousElementSibling
					let number = parseInt(tripCapacity.innerText.split("/")[0], 10)
					number += 1
					tripCapacity.innerText = `${number}/${tripCapacity.innerText.split("/")[1]}`
				})	
			}
		})

	} else {
		displayLogin()
	}
})