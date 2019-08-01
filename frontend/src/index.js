const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

const toolbar = document.querySelector("div.btn-toolbar")

document.addEventListener('DOMContentLoaded', function(){
	document.addEventListener("submit", listenNewTripFromYale)
	document.addEventListener("submit", listenNewTripToYale)
	document.addEventListener("click", listenForJoin)
	document.addEventListener("click", listenUnjoin)
	document.addEventListener("click", function(e) {
		if (e.target.id === "all_destination" && e.target.tagName === "DIV") {
			displayTripsFromYale()
		} else if (e.target.id === "all_origin" && e.target.tagName === "DIV") {
			displayTripsToYale()
		} else if (e.target.id === "home" && e.target.tagName === "DIV") {
			displayHome()
		}
	})

	document.addEventListener("click", listenProfileBtn)
	document.addEventListener("click", listenClose)
	document.addEventListener("click", listenSignup)
	document.addEventListener("submit", listenLogin)
	document.addEventListener("submit", listenSearch)
	document.addEventListener("click", listenLogoutBtn)
	document.addEventListener("change", listenAddress)

	displayHome()
	//Login method
	if (localStorage.getItem('user_id')) {
		let userId = localStorage.getItem('user_id')
		createProfileBtn()
		createLogoutBtn()
		
		// //Display Home
		// document.querySelector("div#home").addEventListener("click", function (e) {
		// 	displayHome()
		// })

		// //Display Trips From Yale
		// document.querySelector("div#all_destination").addEventListener("click", function (e) {
		// 	displayTripsFromYale()
		// })

		// //Display Trips From Yale
		// document.querySelector("div#all_origin").addEventListener("click", function (e) {
		// 	displayTripsToYale()
		// })

	} else {
		createLoginBtn()
	}
})