// const buttonDiv = document.querySelector('div.button')
function displayLogin() {
	// buttonDiv.innerHTML = ""
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
            if (data["error"]) {
                displayLogin()
                console.log(loginDiv.querySelector('div.error'))
                loginDiv.querySelector('div.error').innerHTML = '<h6 class="error">Invalid Email</h6>'
            } else {
                localStorage.setItem("user_id", data.id)
                loginDiv.innerHTML = ""
                displayProfile(data)
            }
		})
	})
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
                    displayProfile(data)
			    })
			})
		})

		loginDiv.querySelector("a.go-back").addEventListener('click', function(e) {
			e.preventDefault()
			displayLogin()
		})

	})
}

function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
}

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

function displayProfile(user) {
    mainContainer.innerHTML = `<h2>Welcome back, ${user.first_name} ${user.last_name}</h2>`
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

function displayTrips() {
    let userId = localStorage.getItem('user_id')
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
        // console.log(tbody)
    })
}