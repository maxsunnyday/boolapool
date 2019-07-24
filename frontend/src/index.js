const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

const toolbar = document.querySelector("div.btn-toolbar")

document.addEventListener('DOMContentLoaded', function(){

	displayHome()
	//Login method
	if (localStorage.getItem('user_id')) {
		let userId = localStorage.getItem('user_id')
		const profileBtn = document.createElement("div")
		profileBtn.id = "profile"
		profileBtn.className = "btn btn-outline-primary"
		profileBtn.innerText = "Profile"
		toolbar.appendChild(profileBtn)

		listenProfileBtn()

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
			displayTrips()
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
					<td>Already Joined!</td>`

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