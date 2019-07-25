function displayLogin() {

	//Make Login Modal Appear
	loginDiv = document.querySelector('div.login')
	loginDiv.innerHTML = `<div class="login-container">
					    	<div class="login-box">
					      		<h2>Login</h2>
					      		<form class="lg">
					        		<p>Email</p>
					        		<input type="email" placeholder="handsome.dan@yale.edu">
					        		<div class="error">
					        		</div>
					        		<input type="submit" value="Log In">
					      		</form>
					      		<div class="link">
					      			<a href="" class="sign-up">Don't have an account? Sign up here!</a>
					      		</div>
					    	</div>
                          </div>`
    
    //Handles Login Functionality                
	document.querySelector("form.lg").addEventListener("submit", function(e) {
		e.preventDefault()
	
		const email = e.target.children[1].value
	
		fetch("http://localhost:3000/login", {
			method: "POST",
			headers: {
				'Content-Type': "application/json",
			},
			body: JSON.stringify({
				email
			})
		}).then(res => res.json())
		.then(data => {

			//Prompts user if email is invalid
            if (data["error"]) {
                displayLogin()
                console.log(loginDiv.querySelector('div.error'))
                loginDiv.querySelector('div.error').innerHTML = '<h6 class="error">Invalid Email</h6>'
            } else {
                localStorage.setItem("user_id", data.id)
                loginDiv.innerHTML = ""
                document.querySelector("div#loginBtn").remove()
                createProfileBtn()
                createLogoutBtn()
                document.querySelector("div#all").addEventListener("click", function (e) {
                    displayTrips()
                })
                displayProfile(data)
            }
		})
	})

	//Handles clicking on sign up link
	loginDiv.querySelector("a.sign-up").addEventListener('click', function(e) {
		e.preventDefault()

		loginDiv.innerHTML = `<div class="login-container">
								<div class="login-box">
									<h2>Sign Up</h2>
									<form class="signup">
										<p>First Name</p>
										<input type="text" placeholder="Petey" required>
										<p>Last Name</p>
										<input type="text" placeholder="Salovey" required>
										<p>Email</p>
										<input type="email" placeholder="handsome.dan@yale.edu" required>
										<input type="submit" value="Create Account">
									</form>
									<div class="link">
										<a href="" class="go-back">Go Back</a>
									</div>
								</div>
							</div>`

		//Handles creating new user in database
		loginDiv.querySelector("form.signup").addEventListener('submit', function(e) {
			e.preventDefault()

			const first_name = e.target.children[1].value
			const last_name = e.target.children[3].value
			const email = e.target.children[5].value

			fetch("http://localhost:3000/users", {
				method: "POST",
				headers: {
				'Content-Type': "application/json",
				},
				body: JSON.stringify({
					first_name,
					last_name,
					email
				})
			}).then(result => result.json())
			.then(data => {
				//Logs user in once created
				fetch("http://localhost:3000/login", {
					method: "POST",
					headers: {
						'Content-Type': "application/json",
					},
					body: JSON.stringify({
						email: data.email
					})
				}).then(res => res.json())
				.then(data => {
					localStorage.setItem("user_id", data.id)
                    loginDiv.innerHTML = ""
                    document.querySelector("div#loginBtn").remove()
                    createProfileBtn()
                    createLogoutBtn()
                    document.querySelector("div#all").addEventListener("click", function (e) {
                        displayTrips()
                    })
                    displayProfile(data)
			    })
			})
		})

		//Handles clicking on go back link
		loginDiv.querySelector("a.go-back").addEventListener('click', function(e) {
			e.preventDefault()
			displayLogin()
		})

	})
}

//Time formatting
function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
}


//Handles user joining trips
function listenForJoin() {
    document.querySelector("tbody").addEventListener("click", function(e) {
        if (e.target.className === "join") {
            let userId = localStorage.getItem('user_id')
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
                let td = e.target.parentElement
                td.removeChild(e.target)
                td.innerText = "Already Joined!"
            })	
        }
    })
}

//Handles displaying user profile
function displayProfile(user) {
    mainContainer.innerHTML = `<h2>Welcome back, ${user.first_name} ${user.last_name}</h2>
                                <h3>Current Trips</h3>
                                <ul class="current"></ul>
                                <h3>Past Trips</h3>
                                <ul class="past"></ul>`

    const current = document.querySelector('ul.current')
    const past = document.querySelector('ul.past')

    let today = new Date();
    let date = today.getFullYear()+'-'+appendLeadingZeroes(today.getMonth()+1)+'-'+appendLeadingZeroes(today.getDate());
    let time = appendLeadingZeroes(today.getHours()) + ":" + appendLeadingZeroes(today.getMinutes()) + ":" + appendLeadingZeroes(today.getSeconds());
    let dateTime =  date+'T'+time;
    console.log(dateTime)

    userId = localStorage.getItem('user_id')
    fetch(`http://localhost:3000/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        const trips = user.trips
        for (let trip of user.trips) {
            if (trip.end_time > dateTime) {
                current.innerHTML += `<li>${trip.destination}</li>`
            } else {
                past.innerHTML += `<li>${trip.destination}</li>`
            }
        }
    })
}

//Handles listening to navbar button click
function listenProfileBtn() {
    document.querySelector("nav").addEventListener("click", function (e) {
        if (e.target.id === "profile") {
            let userId = localStorage.getItem('user_id')
            fetch(`${BASE_URL}/users/${userId}`)
            .then(res => res.json())
            .then(user => {
                displayProfile(user)
            })
        }
    })
}

//Handles displaying all trips
function displayTrips(search="") {
    let userId = localStorage.getItem('user_id')
    fetch("http://localhost:3000/trips")
    .then(response => response.json())
    .then(trips => {
        mainContainer.innerHTML = ``

        //Form for creating new trip
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
        
        //Table for existing trips
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

        mainContainer.appendChild(newForm)
        mainContainer.appendChild(listingsTable)

        listenForJoin()

        let tbody = document.querySelector('tbody')

        if (search != "") {
            trips = trips.filter(trip => {
                return trip.destination === search
            })
        }

        //Populate trips table
        for (let trip of trips) {
            let start = new Date(trip.start_time)
            let end = new Date(trip.end_time)

            let start_formatted = start.getUTCFullYear() + "-" + appendLeadingZeroes(start.getUTCMonth() + 1) + "-" + appendLeadingZeroes(start.getUTCDate()) + " " + appendLeadingZeroes(start.getUTCHours()) + ":" + appendLeadingZeroes(start.getUTCMinutes())
            let end_formatted = end.getUTCFullYear() + "-" + appendLeadingZeroes(end.getUTCMonth() + 1) + "-" + appendLeadingZeroes(end.getUTCDate()) + " " + appendLeadingZeroes(end.getUTCHours()) + ":" + appendLeadingZeroes(end.getUTCMinutes())
            
            let tr = document.createElement("tr")

            //Handles join logic
            let join = false
            for (const user of trip.users) {
                if (user.id == userId) {
                    join = true
                }
            }

            if (join) {
                tr.innerHTML = `<td>${trip.destination}</td>
                <td>${trip.address}</td>
                <td>${start_formatted} - ${end_formatted}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td>Already Joined!</td>`
            } else if (trip.users.length === trip.capacity) {
                tr.innerHTML = `<td>${trip.destination}</td>
                <td>${trip.address}</td>
                <td>${start_formatted} - ${end_formatted}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td>Full</td>`
            } else {
                tr.innerHTML = `<td>${trip.destination}</td>
                <td>${trip.address}</td>
                <td>${start_formatted} - ${end_formatted}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td><button class="join" data-id=${trip.id}>Join!</button></td>`
            }

            tbody.appendChild(tr)
        }
    })
    listenNewTrip()
}

function createLoginBtn() {
    const loginButton = document.createElement("div")
    loginButton.id = "loginBtn"
    loginButton.className = "btn btn-outline-primary"
    loginButton.innerText = "Login/Signup"
    toolbar.appendChild(loginButton)
}

function listenNewTrip() {
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
}

function createLogoutBtn() {
    const logoutButton = document.createElement("div")
    logoutButton.id = "logout"
    logoutButton.className = "btn btn-outline-danger"
    logoutButton.innerText = "Logout"
    toolbar.appendChild(logoutButton)
    
    // Logout functionality
    logoutButton.addEventListener('click', function(e){
        localStorage.removeItem('user_id')
        document.querySelector("div#logout").remove()
        document.querySelector("div#profile").remove()
        createLoginBtn()
        displayHome()
        displayLogin()
    })
}

function createProfileBtn() {
    const profileBtn = document.createElement("div")
    profileBtn.id = "profile"
    profileBtn.className = "btn btn-outline-primary"
    profileBtn.innerText = "Profile"
    toolbar.appendChild(profileBtn)

    listenProfileBtn()
}

function displayHome() {
	mainContainer.innerHTML = `<div class="home-text">
			<h1>Welcome to BoolaPool!</h1>
			<h3>Connect with students who, like you, have places to be!</h3>
			<br>
			<br>
            <form class="search">
    			<select>
    				<option value="" disabled selected>Where do you want to go?</option>
    				<option value="Tweed">Tweed</option>
                    <option value="BDL">BDL</option>
                    <option value="LGA">LGA</option>
                    <option value="JFK">JFK</option>
                    <option value="EWR">EWR</option>
                    <option value="Other">Other</option>
    			</select>
                <input type="submit">
            </form>
		</div>`

    document.querySelector('form.search').addEventListener('submit', function(e){
        e.preventDefault()

        searchQuery = e.target.children[0].value 
        displayTrips(searchQuery)
    })
}