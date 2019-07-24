const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

const toolbar = document.querySelector("div.btn-toolbar")

document.addEventListener('DOMContentLoaded', function(){

	//Login method
	if (localStorage.getItem('user_id')) {
		let userId = localStorage.getItem('user_id')
		const profileBtn = document.createElement("div")
		profileBtn.className = "btn btn-outline-primary"
		profileBtn.innerText = "Profile"
		toolbar.appendChild(profileBtn)
		const logoutButton = document.createElement("div")
		logoutButton.id = "logout"
		logoutButton.className = "btn btn-outline-primary"
		logoutButton.innerText = "Logout"
		toolbar.appendChild(logoutButton)
		// Logout functionality
		logoutButton.addEventListener('click', function(e){
			localStorage.removeItem('user_id')
			displayLogin()
		})
		

		//Display Trips
		document.querySelector("div#all").addEventListener("click", function (e) {
			fetch("http://localhost:3000/trips")
			.then(response => response.json())
			.then(trips => {
				mainContainer.innerHTML = ``
				const newForm = document.createElement("form")
				newForm.className = "new-trip"
				newForm.innerHTML = `
					<label>Destination</label>
					<select name="destination">
						<option value="Tweed">Tweed</option>
						<option value="BDL">BDL</option>
						<option value="LGA">LGA</option>
						<option value="JFK">JFK</option>
						<option value="EWR">EWR</option>
						<option value="Other">Other</option>
					</select>
					<label>Address</label>
					<input type="text" name="address" required>
					<label>Capacity</label>
					<input type="number" name="capacity" required>
					<label>Start</label>
					<input type="datetime-local" name="start_time" required>
					<label>End</label>
					<input type="datetime-local" name="state_time" required>
					<input type="submit">`
				
				const listingsTable = document.createElement("table")
				listingsTable.className = "table"
				listingsTable.innerHTML = `
				<thead>
					<tr>
					<th scope="col">Destination</th>
					<th scope="col">Address</th>
					<th scope="col">Time</th>
					<th scope="col">Capacity</th>
					<th scope="col"></th>
					</tr>
				</thead>
				<tbody>
				</tbody>`

				// let h1Tag = document.createElement("h1")
				// h1Tag.innerText = "Welcome Back User"
				// mainContainer.appendChild(h1Tag)
				mainContainer.appendChild(newForm)
				mainContainer.appendChild(listingsTable)

				listenForJoin()

				let tbody = document.querySelector('tbody')
		
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

	} else {
		const loginButton = document.createElement("div")
		loginButton.id = "loginBtn"
		loginButton.className = "btn btn-outline-primary"
		loginButton.innerText = "Login/Signup"
		toolbar.appendChild(loginButton)
		displayLogin()
	}
})