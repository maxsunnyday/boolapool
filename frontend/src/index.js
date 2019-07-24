const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

const toolbar = document.querySelector("div.btn-toolbar")

document.addEventListener('DOMContentLoaded', function(){

	displayHome()
	//Login method
	if (localStorage.getItem('user_id')) {
		let userId = localStorage.getItem('user_id')
		createProfileBtn()
		createLogoutBtn()
		
		//Display Trips
		document.querySelector("div#all").addEventListener("click", function (e) {
			displayTrips()
		})

	} else {
		createLoginBtn()
		displayLogin()
	}
})