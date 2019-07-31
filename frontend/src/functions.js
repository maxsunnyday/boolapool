function displayHome() {
    mainContainer.innerHTML = `<div class="home-text">
            <h1>Welcome to BoolaPool!</h1>
            <h3>Connect with students who, like you, have places to be!</h3>
            <br>
            <br>
            <form class="search">
                <select>
                    <option value="" disabled selected>Where do you want to go? (from Yale)</option>
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
        displayTripsFromYale(searchQuery)
    })
    listenLogin()
}

function displayProfile(user) {
    mainContainer.innerHTML = `<div class="profile-container">
                                <div class="profile-greeting">
                                    <h2>Welcome back, ${user.first_name}!</h2>
                                </div>
                                <div class="profile-current-trips">
                                    <div class="profile-subhead-text">Current Trips</div>
                                    <div class="current"></div>
                                </div>
                                <div class="profile-past-trips">
                                    <div class="profile-subhead-text">Past Trips</div>
                                    <div class="past"></div>
                                </div>
                               </div>
                               <div class="modal fade" id="unjoinModal" tabindex="-1" role="dialog" aria-labelledby="unjoinModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="joinModalLabel">Unjoin Confirmation</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure? Press 'Ok' to unjoin this trip and notify other members by email.
                                            </div>
                                            <div class="modal-footer">
                                                <button id="confirm-unjoin" type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Nevermind</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`

    const current = document.querySelector('div.current')
    const past = document.querySelector('div.past')

    let today = new Date();
    let date = today.getFullYear()+'-'+appendLeadingZeroes(today.getMonth()+1)+'-'+appendLeadingZeroes(today.getDate());
    let time = appendLeadingZeroes(today.getHours()) + ":" + appendLeadingZeroes(today.getMinutes()) + ":" + appendLeadingZeroes(today.getSeconds());
    let dateTime =  date+'T'+time;

    userId = localStorage.getItem('user_id')
    fetch(`http://localhost:3000/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        // const trips = user.trips
        for (let trip of user.trips) {

            if (trip.end_time > dateTime) {
                let usertrip = trip.usertrips.find(function(ut) {
                    return ut.user_id == userId
                })

                if (trip.usertrips.length === 1) {
                    current.innerHTML += `<div class="flip-card">
                                  <div class="flip-card-inner">
                                    <div class="flip-card-front">
                                        <div class="flip-card-front-head">
                                            ${trip.destination}
                                        </div>
                                        <div class="flip-card-front-subhead">
                                            ${trip.address}
                                        </div>
                                        <div class="flip-card-front-details">
                                            <p>From: ${formatDate(trip.start_time)}</p>
                                            <p>To: ${formatDate(trip.end_time)}</p>
                                        </div>
                                    </div>
                                    <div class="flip-card-back">
                                        <div class="flip-card-back-head">
                                            Passengers
                                        </div>
                                        <div class="flip-card-back-subhead">
                                            ${trip.users.length}/${trip.capacity}
                                        </div>
                                        <div class="flip-card-back-details"
                                            <ul>${displayPassengers(trip.users)}</ul>
                                        </div>
                                        <button class="unjoin" data-id="${usertrip.id}" data-toggle="modal" data-target="#unjoinModal" data-trip="${trip.id}">Unjoin Trip</button>
                                    </div>
                                  </div>
                                </div>`
                } else {
                    current.innerHTML += `<div class="flip-card">
                                  <div class="flip-card-inner">
                                    <div class="flip-card-front">
                                        <div class="flip-card-front-head">
                                            ${trip.destination}
                                        </div>
                                        <div class="flip-card-front-subhead">
                                            ${trip.address}
                                        </div>
                                        <div class="flip-card-front-details">
                                            <p>From: ${formatDate(trip.start_time)}</p>
                                            <p>To: ${formatDate(trip.end_time)}</p>
                                        </div>
                                    </div>
                                    <div class="flip-card-back">
                                        <div class="flip-card-back-head">
                                            Passengers
                                        </div>
                                        <div class="flip-card-back-subhead">
                                            ${trip.users.length}/${trip.capacity}
                                        </div>
                                        <div class="flip-card-back-details"
                                            <ul>${displayPassengers(trip.users)}</ul>
                                        </div>
                                        <button class="unjoin" data-id="${usertrip.id}" data-toggle="modal" data-target="#unjoinModal">Unjoin Trip</button>
                                    </div>
                                  </div>
                                </div>`
                }
            } else {
                past.innerHTML += `<div class="flip-card">
                                  <div class="flip-card-inner">
                                    <div class="flip-card-front">
                                        <div class="flip-card-front-head">
                                            ${trip.destination}
                                        </div>
                                        <div class="flip-card-front-subhead">
                                            ${trip.address}
                                        </div>
                                        <div class="flip-card-front-details">
                                            <p>From: ${formatDate(trip.start_time)}</p>
                                            <p>To: ${formatDate(trip.end_time)}</p>
                                        </div>
                                    </div>
                                    <div class="flip-card-back">
                                        <div class="flip-card-back-head">
                                            Passengers
                                        </div>
                                        <div class="flip-card-back-subhead">
                                            ${trip.users.length}/${trip.capacity}
                                        </div>
                                        <div class="flip-card-back-details"
                                            <ul>${displayPassengers(trip.users)}</ul>
                                        </div>
                                    </div>
                                  </div>
                                </div>`
            }
        }
        listenUnjoin()
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
function displayTripsFromYale(search="") {
    let userId = localStorage.getItem('user_id')
    fetch("http://localhost:3000/trips")
    .then(response => response.json())
    .then(trips => {
        mainContainer.innerHTML = ``

        //Form for creating new trip
        const newForm = document.createElement("form")
        newForm.className = "new-trip-from-yale"
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
        <div class="modal fade" id="joinModal" tabindex="-1" role="dialog" aria-labelledby="joinModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="joinModalLabel">Trip Confirmation</h5>
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
            if (trip.origin === "Yale" || trip.origin == "") {
                let tr = document.createElement("tr")

                //Handles join logic
                let join = false
                for (const user of trip.users) {
                    if (user.id == userId) {
                        join = true
                    }
                }

                if (join) {
                    tr.innerHTML = `<td id="tdx">${trip.destination}</td>
                    <td id="tdx">${trip.address}</td>
                    <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                    <td id="tdx">${trip.users.length}/${trip.capacity}</td>
                    <td id="tdx">Already Joined!</td>`
                } else if (trip.users.length === trip.capacity) {
                    tr.innerHTML = `<td id="tdx">${trip.destination}</td>
                    <td id="tdx">${trip.address}</td>
                    <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                    <td id="tdx">${trip.users.length}/${trip.capacity}</td>
                    <td id="tdx">Full</td>`
                } else {
                    tr.innerHTML = `<td id="tdx">${trip.destination}</td>
                    <td id="tdx">${trip.address}</td>
                    <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                    <td id="tdx">${trip.users.length}/${trip.capacity}</td>
                    <td id="tdx"><button class="join" data-id=${trip.id} data-toggle="modal" data-target="#joinModal">Join!</button></td>`
                }

                tbody.appendChild(tr)
            }
        }
    })
    listenNewTripFromYale()
}

function displayTripsToYale(search="") {
    let userId = localStorage.getItem('user_id')
    fetch("http://localhost:3000/trips")
    .then(response => response.json())
    .then(trips => {
        mainContainer.innerHTML = ``

        //Form for creating new trip
        const newForm = document.createElement("form")
        newForm.className = "new-trip-to-yale"
        newForm.innerHTML = `
            <label>Origin</label>
                <select>
                    <option value="" disabled selected>Where do you need a ride from?</option>
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
            <th scope="col">Origin</th>
            <th scope="col">Address</th>
            <th scope="col">Time</th>
            <th scope="col">Capacity</th>
            <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        <div class="modal fade" id="joinModal" tabindex="-1" role="dialog" aria-labelledby="joinModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="joinModalLabel">Trip Confirmation</h5>
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
                return trip.origin === search
            })
        }

        //Populate trips table
        for (let trip of trips) {
            if (trip.destination === "Yale" || trip.destination == "") {
                let tr = document.createElement("tr")

                //Handles join logic
                let join = false
                for (const user of trip.users) {
                    if (user.id == userId) {
                        join = true
                    }
                }

                if (join) {
                    tr.innerHTML = `<td id="tdx">${trip.origin}</td>
                    <td id="tdx">${trip.address}</td>
                    <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                    <td id="tdx">${trip.users.length}/${trip.capacity}</td>
                    <td id="tdx">Already Joined!</td>`
                } else if (trip.users.length === trip.capacity) {
                    tr.innerHTML = `<td id="tdx">${trip.origin}</td>
                    <td id="tdx">${trip.address}</td>
                    <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                    <td id="tdx">${trip.users.length}/${trip.capacity}</td>
                    <td id="tdx">Full</td>`
                } else {
                    tr.innerHTML = `<td id="tdx">${trip.origin}</td>
                    <td id="tdx">${trip.address}</td>
                    <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
                    <td id="tdx">${trip.users.length}/${trip.capacity}</td>
                    <td id="tdx"><button class="join" data-id=${trip.id} data-toggle="modal" data-target="#joinModal">Join!</button></td>`
                }

                tbody.appendChild(tr)
            }
        }
    })
    listenNewTripToYale()
}

function listenNewTripFromYale() {
    //Create new Trip
    document.addEventListener('submit', function(e){
        if (e.target.className === "new-trip-from-yale") {
            e.preventDefault()

            let userId = localStorage.getItem('user_id')

            let tbody = document.querySelector('tbody')

            // if (e.target.children[0].value === "Destination") {
            //     let origin = "Yale"
            //     let destination = e.target.children[1].value
            // } else {
            //     let origin = e.target.children[1].value
            //     let destination = "Yale"
            // }

            fetch("http://localhost:3000/trips", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    destination: e.target.children[1].value,
                    origin: "Yale",
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

function listenNewTripToYale() {
    //Create new Trip
    document.addEventListener('submit', function(e){
        if (e.target.className === "new-trip-to-yale") {
            e.preventDefault()

            let userId = localStorage.getItem('user_id')

            let tbody = document.querySelector('tbody')

            // if (e.target.children[0].value === "Destination") {
            //     let origin = "Yale"
            //     let destination = e.target.children[1].value
            // } else {
            //     let origin = e.target.children[1].value
            //     let destination = "Yale"
            // }

            fetch("http://localhost:3000/trips", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    destination: "Yale",
                    origin: e.target.children[1].value,
                    address: e.target.children[3].value,
                    capacity: e.target.children[5].value,
                    start_time: moment.parseZone(e.target.children[7].value.split(" - ")[0], 'MM/DD/YYYY hh:mm a').format(),
                    end_time: moment.parseZone(e.target.children[7].value.split(" - ")[1], 'MM/DD/YYYY hh:mm a').format(),
                    user_id: userId
                })
            }).then(response => response.json())
            .then(trip => {

                let tr = document.createElement("tr")

                tr.innerHTML = `<td>${trip.origin}</td>
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

function listenUnjoin() {
    document.querySelector("div.current").addEventListener("click", function(e) {
        if (e.target.className === "unjoin" && e.target.dataset.trip) {
            const usertripId = e.target.dataset.id
            const tripId = e.target.dataset.trip
            const flipcard = e.target.parentElement.parentElement.parentElement
            document.querySelector("div.modal-footer").addEventListener("click", function(e) {
                if (e.target.id === "confirm-unjoin") {
                    fetch(BASE_URL + `/usertrips/${usertripId}`, {
                        method: "DELETE"
                    }).then(data => {
                        fetch(BASE_URL + `/trips/${tripId}`, {
                            method: "DELETE"
                        }).then(data => {
                            flipcard.remove()
                        })
                    })
                }
            })
        } else if (e.target.className === "unjoin") {
            const usertripId = e.target.dataset.id
            const flipcard = e.target.parentElement.parentElement.parentElement
            document.querySelector("div.modal-footer").addEventListener("click", function(e) {
                if (e.target.id === "confirm-unjoin") {
                    fetch(BASE_URL + `/usertrips/${usertripId}`, {
                        method: "DELETE"
                    }).then(data => {
                        flipcard.remove()
                    })
                }
            })
        }
    })
}


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
    loginButton.innerText = "Login"
    loginButton.dataset.toggle = "modal"
    loginButton.dataset.target = "#loginModal"
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



function listenLogin() {
    const loginModal = document.querySelector("div#loginModal")
    const loginForm = loginModal.querySelector("form.lg")
    const signup = loginModal.querySelector("div.signup-link")
    //Handles Login Functionality                
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault()
    
        $(function() {
            $('#loginModal').modal('toggle'); 
        })

        const email = e.target.children[1].value
        const password = e.target.children[4].value
    
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
                console.log(data)
                loginForm.querySelector('div.error').innerHTML = '<h6 class="error">Invalid Email and/or Password</h6>'
            } else {
                loginForm.reset()
                localStorage.setItem("user_id", data.id)
                document.querySelector("div#loginBtn").remove()
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

                //Display Trips To Yale
                document.querySelector("div#all_origin").addEventListener("click", function (e) {
                    displayTripsToYale()
                })

                displayProfile(data)
            }
        })
    })

    //Handles clicking on sign up link
    signup.querySelector("a.sign-up").addEventListener('click', function(e) {
        e.preventDefault()
        signup.parentElement.parentElement.innerHTML = 


        //Handles creating new user in database
        loginModal.querySelector("form.su").addEventListener('submit', function(e) {
            e.preventDefault()

            const first_name = e.target.children[1].value
            const last_name = e.target.children[4].value
            const email = e.target.children[7].value
            const phone = e.target.children[10].value
            const password = e.target.children[13].value
            const password_confirmation = e.target.children[16].value

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
                    loginModal.querySelector('div.error').innerHTML = ``
                    user["errors"].forEach(error => {
                        loginModal.querySelector('div.error').innerHTML += `<h6 class="error">${error}</h6>`
                    });
                } else {
                    localStorage.setItem("user_id", user.id)
                    document.querySelector("div#loginBtn").remove()
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

                    //Display Trips To Yale
                    document.querySelector("div#all_origin").addEventListener("click", function (e) {
                        displayTripsToYale()
                    })

                    $(function() {
                        $('#loginModal').modal('toggle'); 
                    })

                    displayProfile(user)
                }
            })
        })

        //Handles clicking on go back link
        loginModal.querySelector("a.go-back").addEventListener('click', function(e) {
            e.preventDefault()
            resetLogin()
        })

    })
}

function resetLogin() {
    const loginModal = document.querySelector('div#loginModal')
    loginModal.innerHTML = `      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Login</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="lg">
                Email
                <br>
                <input type="email" placeholder="handsome.dan@yale.edu" required>
                <br>
                Password
                <br>
                <input type="password" placeholder="woofwoof123" required>
                <div class="error">
                </div>
                <input type="submit" value="Log In">
            </form>
            <div class="signup-link">
                <a href="" class="sign-up">Don't have an account? Sign up here!</a>
            </div>
          </div>
        </div>
      </div>`
}

function ani() {
    fetch("http://localhost:3000/users").then(result => result.json()).then(users => {
        const emails = users.map(user => user.email)
        console.log(emails)
        const content = document.querySelector("div.modal-content")
        document.querySelector("div.modal-dialog").classList.add("anim")
        document.querySelector("div.modal-body").classList.add("whiten")
        content.classList.add("lighten")
        document.querySelector("form.lg").classList.add("disappear")
        document.querySelector("div.signup-link").classList.add("disappear")

        setTimeout(function() {
            content.innerHTML =  `<div class="modal-header">
                                    <h5 class="modal-title" id="SignupModalLabel">Signup</h5>
                                    <button type="button" class="close" id="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body whitened">
                                    <form class="su">
                                        <div class="name-field">
                                            First Name
                                            <br>
                                            <input type="text" placeholder="Petey" required>
                                        </div>
                                        <div class="name-field">
                                            Last Name
                                            <br>
                                            <input type="text" placeholder="Salovey" required>
                                        </div>
                                        <br>
                                        Email
                                        <br>
                                        <input type="email" placeholder="handsome.dan@yale.edu" required>
                                        <div class="subtext">NOTE: You will receive trip updates at this email address</div>
                                        <div class="error">
                                            <div class="filler"></div>
                                            <div class="next-link">
                                                <input type="submit" value="Next">
                                            </div>
                                        </div>
                                    </form>
                                </div>`
            content.classList.add("lightened")
            form = document.querySelector('form.su')

            form.classList.add("appear")
            document.querySelector('div.modal-header').classList.add("appear-head")

            listenClose()

            form.addEventListener("submit", function(e) {
                e.preventDefault()
                first_name = form.children[0].children[1].value
                last_name = form.children[1].children[1].value
                email = form.children[4].value

                if (emails.includes(email)) {
                    form.querySelector("div.filler").innerText = "That email is already taken!"
                } else {
                    form.classList.replace("appear", "disappear")
                    setTimeout(function() {
                        form.innerHTML = `<div class="subtext">BoolaPool can provide fast text updates whenever members create, join, or unjoin trips. Would you like to receive text notifications?</div>
                                          <div class="check">
                                            <input type="checkbox" name="yes" value="yes">
                                            <div class="cbtext"> Yes, please send me text notifications</div>
                                          </div>
                                          <input type="tel" name="tel" placeholder="1234567890" disabled>
                                          <div class="error">
                                            <div class="filler2"></div>
                                            <div class="next-link">
                                                <input type="submit" value="Next">
                                            </div>
                                          </div>`
                        form.classList.replace("disappear", "appear")

                        form.querySelector('input[name="yes"]').addEventListener("change", function(e) {
                            form.querySelector('input[name="tel"]').disabled = !form.querySelector('input[name="tel"]').disabled
                        })

                        listenClose()

                        form.addEventListener("submit", function(e) {
                            e.preventDefault()
                            phone = form.children[2].value
                            console.log(phone)
                            if ((phone != "") && (isNaN(phone) || phone.length != 10)) {
                                form.querySelector("div.filler2").innerText = "Invalid phone number (ex: 2915042210)"
                            } else {
                                form.classList.replace("appear", "disappear")
                                setTimeout(function() {
                                    form.innerHTML = `<div class="filler"></div>
                                                    Password
                                                    <br>
                                                    <input type="password" placeholder="woofwoof123" required>
                                                    <br>
                                                    Password Confirmation
                                                    <br>
                                                    <input type="password" placeholder="woofwoof123" required>
                                                    <div class="filler3"></div>
                                                    <input type="submit" value="Create Account">`
                                    form.classList.replace("disappear", "appear")

                                    listenClose()

                                    form.addEventListener("submit", function(e) {
                                        e.preventDefault()
                                        password = form.children[2].value
                                        password_confirmation = form.children[5].value

                                        if (password !== password_confirmation) {
                                            form.querySelector('div.filler3').innerText = "Passwords do not match!"
                                        }
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
                                                loginModal.querySelector('div.error').innerHTML = ``
                                                user["errors"].forEach(error => {
                                                    loginModal.querySelector('div.error').innerHTML += `<h6 class="error">${error}</h6>`
                                                });
                                            } else {
                                                localStorage.setItem("user_id", user.id)
                                                document.querySelector("div#loginBtn").remove()
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

                                                //Display Trips To Yale
                                                document.querySelector("div#all_origin").addEventListener("click", function (e) {
                                                    displayTripsToYale()
                                                })

                                                $(function() {
                                                    $('#loginModal').modal('toggle'); 
                                                })

                                                displayProfile(user)
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    }, 1000)
                }
            })
        }, 1000)
    })
}

function listenClose() {
    document.querySelector("button#close").addEventListener('click', function(e) {
        console.log("reset")
        resetLogin()
    })
}