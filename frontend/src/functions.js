//Handles displaying different 'pages'
function displayLogin() {

	//Make Login Modal Appear
	loginDiv = document.querySelector('div.login')
	loginDiv.innerHTML = `<div class="login-container">
					    	<div class="login-box">
					      		<h2>Login</h2>
					      		<form class="lg">
					        		<p>Email</p>
                                    <input type="email" placeholder="handsome.dan@yale.edu" required>
                                    <p>Password</p>
                                    <input type="password" placeholder="woofwoof123" required>
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
        const password = e.target.children[3].value
	
		fetch("http://localhost:3000/login", {
			method: "POST",
			headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
			},
			body: JSON.stringify({
                email,
                password
			})
		}).then(res => res.json())
		.then(data => {

			//Prompts user if email is invalid
            if (data["error"]) {
                displayLogin()
                console.log(data)
                // console.log(loginDiv.querySelector('div.error'))
                loginDiv.querySelector('div.error').innerHTML = '<h6 class="error">Invalid Email and/or Password</h6>'
            } else {
                localStorage.setItem("user_id", data.id)
                loginDiv.innerHTML = ""
                document.querySelector("div#loginBtn").remove()
                createProfileBtn()
                createLogoutBtn()

                //Display Home
                document.querySelector("div#home").addEventListener("click", function (e) {
                    displayHome()
                })

                //Display Trips
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
                                        <p>Phone Number</p>
                                        <input type="tel" placeholder="1234567890">
                                        <p>Password</p>
                                        <input type="password" placeholder="woofwoof123" required>
                                        <p>Password Confirmation</p>
                                        <input type="password" placeholder="woofwoof123" required>
                                        <div class="error">
					        		    </div>
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
            const phone = e.target.children[7].value
            const password = e.target.children[9].value
            const password_confirmation = e.target.children[11].value

			fetch("http://localhost:3000/users", {
				method: "POST",
				headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
				},
				body: JSON.stringify({
					first_name,
					last_name,
                    email,
                    phone,
                    password,
                    password_confirmation
				})
			}).then(result => result.json())
			.then(user => {
                if (user["errors"]) {
                    // console.log(user)
                    // console.log(loginDiv.querySelector('div.error'))
                    loginDiv.querySelector('div.error').innerHTML = ``
                    user["errors"].forEach(error => {
                        loginDiv.querySelector('div.error').innerHTML += `<h6 class="error">${error}</h6>`
                    });
                } else {
                    localStorage.setItem("user_id", user.id)
                    loginDiv.innerHTML = ""
                    document.querySelector("div#loginBtn").remove()
                    createProfileBtn()
                    createLogoutBtn()
    
                    //Display Home
                    document.querySelector("div#home").addEventListener("click", function (e) {
                        displayHome()
                    })
    
                    //Display Trips
                    document.querySelector("div#all").addEventListener("click", function (e) {
                        displayTrips()
                    })
                    displayProfile(user)
                }
			})
		})

		//Handles clicking on go back link
		loginDiv.querySelector("a.go-back").addEventListener('click', function(e) {
			e.preventDefault()
			displayLogin()
		})

	})
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
                    <option value="BDL">Bradley International Airport (BDL)</option>
                    <option value="LGA">LaGuardia Airport (LGA)</option>
                    <option value="JFK">John F. Kennedy International Airport (JFK)</option>
                    <option value="EWR">Newark Liberty International Airport (EWR)</option>
                    <option value="HVN">Tweed New Haven Airport (HVN)</option>
                    <option value="Trader Joe's">Trader Joe's (Orange, CT)</option>
                    <option value="Costco">Costco (Milford, CT)</option>
                    <option value="Stop & Shop">Stop & Shop (New Haven, CT)</option>
                    <option value="Yale Bowl">Yale Bowl</option>
                    <option value="Lighthouse Point Park">Lighthouse Point Park</option>
                    <option value="Connecticut Post Mall">Connecticut Post Mall (Milford, CT)</option>
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

function displayProfile(user) {
    mainContainer.innerHTML = `<div class="profile-container">
                                <h2>Welcome back, ${user.first_name} ${user.last_name}</h2>
                                <h3>Current Trips</h3>
                                <div class="current"></div>
                                <h3>Past Trips</h3>
                                <div class="past"></div>
                               </div>`

    const current = document.querySelector('div.current')
    const past = document.querySelector('div.past')

    let today = new Date();
    let date = today.getFullYear()+'-'+appendLeadingZeroes(today.getMonth()+1)+'-'+appendLeadingZeroes(today.getDate());
    let time = appendLeadingZeroes(today.getHours()) + ":" + appendLeadingZeroes(today.getMinutes()) + ":" + appendLeadingZeroes(today.getSeconds());
    let dateTime =  date+'T'+time;

    console.log(dateTime)

    userId = localStorage.getItem('user_id')
    fetch(`http://localhost:3000/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        // const trips = user.trips
        for (let trip of user.trips) {
            console.log(trip.usertrips.find(function(ut) {
                return ut["user_id"] === userId
            }))

            if (trip.end_time > dateTime) {
                current.innerHTML += `<div class="flip-card">
                                  <div class="flip-card-inner">
                                    <div class="flip-card-front">
                                      <h4>${trip.destination}</h4>
                                      <p>${trip.address}</p>
                                      <p>${formatDate(trip.start_time)}</p>
                                      <p>${formatDate(trip.end_time)}</p>
                                    </div>
                                    <div class="flip-card-back">
                                      <h4>Passengers</h4>
                                      <ul>${displayPassengers(trip.users)}</ul>
                                      <button class="unjoin" data-id="${trip.id}">Unjoin Trip</button>
                                    </div>
                                  </div>
                                </div>`

                                listenUnjoin()
            } else {
                past.innerHTML += `<div class="flip-card">
                                  <div class="flip-card-inner">
                                    <div class="flip-card-front">
                                      <h4>${trip.destination}</h4>
                                      <p>${trip.address}</p>
                                      <p>${formatDate(trip.start_time)}</p>
                                      <p>${formatDate(trip.end_time)}</p>
                                    </div>
                                    <div class="flip-card-back">
                                      <h4>Passengers</h4>
                                      <ul>${displayPassengers(trip.users)}</ul>
                                    </div>
                                  </div>
                                </div>`
            }
        }
    })
}

function displayPassengers(users) {
    let userList = ""
    for (let user of users) {
        userList += `<li>${user.first_name} ${user.last_name} (${user.email})</li>`
    }
    return userList
}

//Handles displaying all trips, making new ones, and join logic
function displayTrips(search="") {
    let userId = localStorage.getItem('user_id')
    let today = new Date();
    let date = today.getFullYear()+'-'+appendLeadingZeroes(today.getMonth()+1)+'-'+appendLeadingZeroes(today.getDate());
    let time = appendLeadingZeroes(today.getHours()) + ":" + appendLeadingZeroes(today.getMinutes());
    let dateTime =  date+'T'+time;
    fetch("http://localhost:3000/trips")
    .then(response => response.json())
    .then(trips => {
        mainContainer.innerHTML = ``

        //Form for creating new trip
        const newForm = document.createElement("form")
        newForm.className = "new-trip"
        newForm.innerHTML = `
            <label>Destination</label>
                <select>
                    <option value="" disabled selected>Where do you want to go?</option>
                    <option value="BDL" data-address="Schoephoester Rd, Windsor Locks, CT 06096">Bradley International Airport (BDL)</option>
                    <option value="JFK" data-address="Queens, NY 11430">John F. Kennedy International Airport (JFK)</option>
                    <option value="LGA" data-address="Queens, NY 11371">LaGuardia Airport (LGA)</option>
                    <option value="HVN" data-address="155 Burr St, New Haven, CT 06512">Tweed New Haven Airport (HVN)</option>
                    <option value="Trader Joe's" data-address="560 Boston Post Rd, Orange, CT 06477">Trader Joe's (Orange, CT)</option>
                    <option value="Costco" data-address="1718 Boston Post Rd, Orange, CT 06460">Costco (Milford, CT)</option>
                    <option value="Stop & Shop" data-address="150 Whalley Ave, New Haven, CT 06515">Stop & Shop (New Haven, CT)</option>
                    <option value="Yale Bowl" data-address="81 Central Ave, New Haven, CT 06515">Yale Bowl</option>
                    <option value="Lighthouse Point Park" data-address="2 Lighthouse Rd, New Haven, CT 06512">Lighthouse Point Park</option>
                    <option value="Connecticut Post Mall" data-address="1201 Boston Post Rd, Milford, CT 06460">Connecticut Post Mall (Milford, CT)</option>
                    <option value="Other">Other</option>
                </select>
            <label>Address</label>
            <input type="text" name="address" required>
            <label>Capacity</label>
            <input type="number" name="capacity" min="2" max="6"required>
            <label>Departure Time Range</label>
            <input type="text" name="datetimes" placeholder="" required>
            <!--
            <label>Start</label>
            <input type="datetime-local" name="start_time" min="${dateTime}" required>
            <label>End</label>
            <input type="datetime-local" name="end_time" min="${dateTime}" required>
            -->
            <input type="submit">`

        newForm.querySelector('select').addEventListener("change", function(e){
            const select = e.target
            const selectedInput = select.options[select.selectedIndex]
            const selectedAddress = selectedInput.getAttribute('data-address')

            const addressInput = e.target.nextElementSibling.nextElementSibling
            addressInput.value = selectedAddress
        })
        

        $(function() {
            $('input[name="datetimes"]').daterangepicker({
            timePicker: true,
            maxSpan: {
                "days": 7
            },
            opens: "center",
            minDate: moment().startOf('date'),
            // startDate: moment().startOf('hour'),
            // endDate: moment().startOf('hour').add(32, 'hour'),
            locale: {
                format: 'MM/DD/YYYY hh:mm A'
            }
            });
        });
        
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
        </tbody>
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Trip Confirmation</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Press 'Ok' to join this trip and notify other members by email.
              </div>
              <div class="modal-footer">
                <button id="confirm-join" type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Nevermind</button>
              </div>
            </div>
          </div>
        </div>`

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
                <td>${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td>Already Joined!</td>`
            } else if (trip.users.length === trip.capacity) {
                tr.innerHTML = `<td>${trip.destination}</td>
                <td>${trip.address}</td>
                <td>${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td>Full</td>`
            } else {
                tr.innerHTML = `<td>${trip.destination}</td>
                <td>${trip.address}</td>
                <td>${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td><button class="join" data-id=${trip.id} data-toggle="modal" data-target="#exampleModal">Join!</button></td>`
            }

            tbody.appendChild(tr)
        }
    })
    listenNewTrip()
}

function listenNewTrip() {
    //Create new Trip
    let userId = localStorage.getItem('user_id')
    document.addEventListener('submit', function(e){
        if (e.target.className === "new-trip") {
            e.preventDefault()

            let tbody = document.querySelector('tbody')
            // let start = moment(e.target.children[7].value.split(" - ")[0]).format()
            // let end = moment(e.target.children[7].value.split(" - ")[1]).format()
            // console.log(start)
            // console.log(end)
            // console.log(moment(start).isBefore(moment(end)))

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
                    start_time: moment.parseZone(e.target.children[7].value.split(" - ")[0], 'MM/DD/YYYY hh:mm a').format(),
                    end_time: moment.parseZone(e.target.children[7].value.split(" - ")[1], 'MM/DD/YYYY hh:mm a').format(),
                    user_id: userId
                })
            }).then(response => response.json())
            .then(trip => {

                let tr = document.createElement("tr")

                tr.innerHTML = `<td>${trip.destination}</td>
                <td>${trip.address}</td>
                <td>${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                <td>${trip.users.length}/${trip.capacity}</td>
                <td>Already Joined!</td>`

                tbody.appendChild(tr)
            })
        }
    })
}

function listenForJoin() {
    document.querySelector("tbody").addEventListener("click", function(e) {
        if (e.target.className === "join") {
            const button = e.target
            const td = e.target.parentElement
            const tripId = e.target.dataset.id
            const tripCapacity = e.target.parentElement.previousElementSibling

            document.querySelector("div.modal-footer").addEventListener("click", function(e) {
                if (e.target.id === "confirm-join") {
                    let userId = localStorage.getItem('user_id')
                    fetch(BASE_URL + "/usertrips", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            trip_id: tripId
                        })
                    }).then(response => response.json())
                    .then(usertrip => {
                        console.log(usertrip)
                        let number = parseInt(tripCapacity.innerText.split("/")[0], 10)
                        number += 1
                        tripCapacity.innerText = `${number}/${tripCapacity.innerText.split("/")[1]}`
                        td.removeChild(button)
                        td.innerText = "Already Joined!"
                    })
                }
            })
        }
    })
}

// function listenUnjoin() {
//     document.querySelector("button.unjoin").addEventListener("click", function(e) {
//         if (e.target.className === "unjoin") {
//             const button = e.target
//             const tripId = e.target.dataset.id
//             let userId = localStorage.getItem('user_id')
//             fetch(BASE_URL + `/usertrips/${tripId}`, {
//                 method: "DELETE",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     user_id: userId
//                 })
//             }).then(response => response.json())
//             .then(usertrip => {
//                 console.log(usertrip)
//             })
//         }
//     })
// }


//Handles adding buttons depending on login/logout status
function createProfileBtn() {
    const profileBtn = document.createElement("div")
    profileBtn.id = "profile"
    profileBtn.className = "btn btn-outline"
    profileBtn.innerText = "Profile"
    toolbar.appendChild(profileBtn)

    listenProfileBtn()
}

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

function createLoginBtn() {
    const loginButton = document.createElement("div")
    loginButton.id = "loginBtn"
    loginButton.className = "btn btn-outline"
    loginButton.innerText = "Login/Signup"
    toolbar.appendChild(loginButton)
}

function createLogoutBtn() {
    const logoutButton = document.createElement("div")
    logoutButton.id = "logout"
    logoutButton.className = "btn btn-outline"
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


//Date and Time formatting
function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
}

function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const split = date.split("T")
    const [dateArr, time] = split

    const splitdate = dateArr.split("-")
    const [year, month, day] = splitdate

    const result = months[+month - 1] + " " + day + ", " + year + ", " + time.slice(0,5)
    return result
}

// function convertDate(date) {
//     //  7/26 12:00 AM
//     const Arr = date.split(" ")
//     const monthArr = Arr[0].split("/")
//     const timeArr = Arr[1].split(":")
//     const month = appendLeadingZeroes(monthArr[0])
//     const day = appendLeadingZeroes(monthArr[1])
//     let HH = timeArr[0]
//     if (Arr[2] = "PM") {
//         HH += 
//     }


//     const hh = appendLeadingZeroes(timeArr[1])
// }