const BASE_URL = "http://localhost:3000"

const mainContainer = document.querySelector("main")

const toolbar = document.querySelector("div.btn-toolbar")

document.addEventListener('DOMContentLoaded', function(){
	//Navbar Listeners
	document.addEventListener("click", function(e) {
		if (e.target.id === "all_destination" && e.target.tagName === "DIV") {
			displayTripsFromYale()
		} else if (e.target.id === "all_origin" && e.target.tagName === "DIV") {
			displayTripsToYale()
		} else if (e.target.id === "home" && e.target.tagName === "DIV") {
			displayHome()
		}
	})

	//Home Search Listener
	document.addEventListener("click", listenSwitch)
	document.addEventListener("submit", listenSearch)

	//Login Listeners
	document.addEventListener("submit", listenLogin)
	document.addEventListener("click", listenSignup)
	document.addEventListener("click", listenClose)

	//NewTrip listeners
	document.addEventListener("change", listenAddress)
	document.addEventListener("click", listenNewTripBtn)
	document.addEventListener("submit", listenNewTripFromYale)
	document.addEventListener("submit", listenNewTripToYale)
	document.addEventListener("click", listenForJoin)
	document.addEventListener("click", listenUnjoin)

	//Profile Listener
	document.addEventListener("click", listenProfileBtn)

	//Logout Listner
	document.addEventListener("click", listenLogoutBtn)

	displayHome()
	//Login method
	if (localStorage.getItem('user_id')) {
		let userId = localStorage.getItem('user_id')
		createProfileBtn()
		createLogoutBtn()

	} else {
		createLoginBtn()
	}
})