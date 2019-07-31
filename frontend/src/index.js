const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

const toolbar = document.querySelector("div.btn-toolbar")

document.addEventListener('DOMContentLoaded', function(){
	document.addEventListener("submit", listenNewTripFromYale)
	document.addEventListener("submit", listenNewTripToYale)
	displayHome()
	//Login method
	if (localStorage.getItem('user_id')) {
		let userId = localStorage.getItem('user_id')
		createProfileBtn()
		createLogoutBtn()
		
		//Display Home
		document.querySelector("div#home").addEventListener("click", function (e) {
			displayHome()
		})

		//Display Trips From Yale
		document.querySelector("div#all_destination").addEventListener("click", function (e) {
			displayTripsFromYale()
		})

		//Display Trips From Yale
		document.querySelector("div#all_origin").addEventListener("click", function (e) {
			displayTripsToYale()
		})

	} else {
		createLoginBtn()
	}
})