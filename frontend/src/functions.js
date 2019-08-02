//Handles displaying Home and Profile
function displayHome() {
    mainContainer.innerHTML = `<div class="home-text">
            <h1>Welcome to BoolaPool!</h1>
            <h3>Connect with students who, like you, have places to be!</h3>
            <br>
            <br>
            <form class="search">
                <button class="switch">From Yale</button>
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
                <input type="submit" value="Search">
            </form>
        </div>`
}

function listenSwitch(e) {
    if (e.target.className === "switch") {
        e.preventDefault()

        if (e.target.innerText === "To Yale") {
            e.target.innerText = "From Yale"
            e.target.nextElementSibling.options[0].innerText = "Where do you want to go?"
        } else {
            e.target.innerText = "To Yale"
            e.target.nextElementSibling.options[0].innerText = "Where are you coming from?"
        }
    }
}

function listenSearch(e) {
    if (e.target.className === "search" && e.target.tagName === "FORM") {
        e.preventDefault()
        searchQuery = e.target.children[1].value
        console.log(searchQuery)

        if (e.target.children[0].innerText === "From Yale") { 
            displayTripsFromYale(searchQuery)
        } else {
            displayTripsToYale(searchQuery)
        }
        
    }
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
                                    <div class="flip-card-front" id="${cardColor(trip)}">
                                        <div class="flip-card-front-head">
                                            ${trip.origin} → ${trip.destination}
                                        </div>
                                        <div class="flip-card-front-subhead">
                                            ${trip.address}
                                        </div>
                                        <div class="flip-card-front-details">
                                            <p>From: ${formatDate(trip.start_time)} EST</p>
                                            <p>To: ${formatDate(trip.end_time)} EST</p>
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
                                    <div class="flip-card-front" id="${cardColor(trip)}">
                                        <div class="flip-card-front-head">
                                            ${trip.origin} → ${trip.destination}
                                        </div>
                                        <div class="flip-card-front-subhead">
                                            ${trip.address}
                                        </div>
                                        <div class="flip-card-front-details">
                                            <p>From: ${formatDate(trip.start_time)} EST</p>
                                            <p>To: ${formatDate(trip.end_time)} EST</p>
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
                                    <div class="flip-card-front" id="${cardColor(trip)}">
                                        <div class="flip-card-front-head">
                                            ${trip.origin} → ${trip.destination}
                                        </div>
                                        <div class="flip-card-front-subhead">
                                            ${trip.address}
                                        </div>
                                        <div class="flip-card-front-details">
                                            <p>From: ${formatDate(trip.start_time)} EST</p>
                                            <p>To: ${formatDate(trip.end_time)} EST</p>
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
    })
}

function cardColor(trip) {
    if (trip.origin === "Yale") {
        return "yale-origin"
    } else {
        return "other-origin"
    }
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

        const btnContainer = document.createElement("div")
        btnContainer.className = "btn-container"

        const newTripBtn = document.createElement("button")
        newTripBtn.className = "toggleNewTrip"
        newTripBtn.innerText = "Create New Trip From Yale"
        btnContainer.appendChild(newTripBtn)

        $(function() {
            $('input[name="datetimes"]').daterangepicker({
            timePicker: true,
            maxSpan: {
                "days": 14
            },
            opens: "center",
            startDate: moment().startOf('hour').add(3, 'hour'),
            endDate: moment().startOf('hour').add(5, 'hour'),
            minDate: moment().startOf('min'),
            locale: {
                format: 'MM/DD/YYYY hh:mm A'
            }
            });
        });
        
        //Table for existing trips
        const tableContainer = document.createElement("div")
        tableContainer.className = "table-container"

        const listingsTable = document.createElement("table")
        listingsTable.className = "table"
        listingsTable.innerHTML = `
        <thead>
            <tr>
            <th scope="col">Destination</th>
            <th scope="col">Address</th>
            <th scope="col">Time (EST 24:00)</th>
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
                <button type="button" id="x-close" class="close" data-dismiss="modal" aria-label="Close">
                  <span id="x-close" aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Press 'Ok' to join and notify other members of this trip.
              </div>
              <div class="modal-footer">
                <button id="confirm-join" type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
                <button type="button" id="nevermind" class="btn btn-secondary" data-dismiss="modal">Nevermind</button>
              </div>
            </div>
          </div>
        </div>`

        tableContainer.appendChild(listingsTable)

        mainContainer.appendChild(btnContainer)
        mainContainer.appendChild(tableContainer)

        let tbody = document.querySelector('tbody')

        if (search != "") {
            trips = trips.filter(trip => {
                return trip.destination === search
            })
        }

        let today = new Date();
        let date = today.getFullYear()+'-'+appendLeadingZeroes(today.getMonth()+1)+'-'+appendLeadingZeroes(today.getDate());
        let time = appendLeadingZeroes(today.getHours()) + ":" + appendLeadingZeroes(today.getMinutes()) + ":" + appendLeadingZeroes(today.getSeconds());
        let dateTime =  date+'T'+time;

        //Populate trips table
        for (let trip of trips) {
            if (trip.end_time > dateTime) {  
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
                        <td id="tdx"><button class="join" data-id=${trip.id}>Join!</button></td>`
                    }

                    tbody.appendChild(tr)
                }
            }
        }

        const newTripModal = document.createElement("div")
        newTripModal.className = "new-trip-modal"
        newTripModal.innerHTML = `  <div class="modal fade" id="newTripModal" tabindex="-1" role="dialog" aria-labelledby="newTripModalLabel" aria-hidden="true">
                                      <div class="modal-dialog" role="document" style="width: 600px; top: 5%;">
                                        <div class="modal-content">
                                          <div class="modal-header lightened">
                                            <h5 class="modal-title" id="newTripModalLabel">Create New Trip</h5>
                                            <button type="button" class="close" id="close" data-dismiss="modal" aria-label="Close">
                                              <span aria-hidden="true">&times;</span>
                                            </button>
                                          </div>
                                          <div class="modal-body whitened">
                                            <form class="new-trip-from-yale">
                                                <select class="select-address" required>
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
                                                <label>Address: </label>
                                                <input type="text" name="address" required>
                                                <label>Capacity: </label>
                                                <input type="number" name="capacity" min="2" max="6"required>
                                                <label>Departure Time Range: </label>
                                                <input class="datetime" type="text" name="datetimes" placeholder="" required>
                                                <br>
                                                <input type="submit">
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>`

        mainContainer.appendChild(newTripModal)
    })
}

function displayTripsToYale(search="") {
    let userId = localStorage.getItem('user_id')
    fetch("http://localhost:3000/trips")
    .then(response => response.json())
    .then(trips => {
        mainContainer.innerHTML = ``

        const btnContainer = document.createElement("div")
        btnContainer.className = "btn-container"

        const newTripBtn = document.createElement("button")
        newTripBtn.className = "toggleNewTrip"
        newTripBtn.innerText = "Create New Trip To Yale"
        btnContainer.appendChild(newTripBtn)
        
        $(function() {
            $('input[name="datetimes"]').daterangepicker({
            timePicker: true,
            maxSpan: {
                "days": 14
            },
            opens: "center",
            startDate: moment().startOf('hour').add(3, 'hour'),
            endDate: moment().startOf('hour').add(5, 'hour'),
            minDate: moment().startOf('min'),
            locale: {
                format: 'MM/DD/YYYY hh:mm A'
            }
            });
        });
        
        //Table for existing trips
        const tableContainer = document.createElement("div")
        tableContainer.className = "table-container"
        const listingsTable = document.createElement("table")
        listingsTable.className = "table"
        listingsTable.innerHTML = `
        <thead>
            <tr>
            <th scope="col">Origin</th>
            <th scope="col">Address</th>
            <th scope="col">Time (EST 24:00)</th>
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
                <button type="button" id="x-close" class="close" data-dismiss="modal" aria-label="Close">
                  <span id="x-close" aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Press 'Ok' to join and notify other members of this trip.
              </div>
              <div class="modal-footer">
                <button id="confirm-join" type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
                <button type="button" id="nevermind" class="btn btn-secondary" data-dismiss="modal">Nevermind</button>
              </div>
            </div>
          </div>
        </div>`
        tableContainer.appendChild(listingsTable)

        mainContainer.appendChild(btnContainer)
        mainContainer.appendChild(tableContainer)

        let tbody = document.querySelector('tbody')

        if (search != "") {
            trips = trips.filter(trip => {
                return trip.origin === search
            })
        }

        let today = new Date();
        let date = today.getFullYear()+'-'+appendLeadingZeroes(today.getMonth()+1)+'-'+appendLeadingZeroes(today.getDate());
        let time = appendLeadingZeroes(today.getHours()) + ":" + appendLeadingZeroes(today.getMinutes()) + ":" + appendLeadingZeroes(today.getSeconds());
        let dateTime =  date+'T'+time;

        //Populate trips table
        for (let trip of trips) {
            if (trip.end_time > dateTime) {  
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
                        <td id="tdx"><button class="join" data-id=${trip.id}>Join!</button></td>`
                    }

                    tbody.appendChild(tr)
                }
            }
        }

        const newTripModal = document.createElement("div")
        newTripModal.className = "new-trip-modal"
        newTripModal.innerHTML = `  <div class="modal fade" id="newTripModal" tabindex="-1" role="dialog" aria-labelledby="newTripModalLabel" aria-hidden="true">
                                      <div class="modal-dialog" role="document" style="width: 600px; top: 5%;">
                                        <div class="modal-content">
                                          <div class="modal-header lightened">
                                            <h5 class="modal-title" id="newTripModalLabel">Create New Trip</h5>
                                            <button type="button" class="close" id="close" data-dismiss="modal" aria-label="Close">
                                              <span aria-hidden="true">&times;</span>
                                            </button>
                                          </div>
                                          <div class="modal-body whitened">
                                            <form class="new-trip-to-yale">
                                                <select class="select-address" required>
                                                    <option value="" disabled selected>Where are you coming from?</option>
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
                                                <label>Address: </label>
                                                <input type="text" name="address" required>
                                                <label>Capacity: </label>
                                                <input type="number" name="capacity" min="2" max="6"required>
                                                <label>Departure Time Range: </label>
                                                <input class="datetime" type="text" name="datetimes" placeholder="" required>
                                                <br>
                                                <input type="submit">
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>`

        mainContainer.appendChild(newTripModal)
    })
}

function listenNewTripBtn(e) {
    if (e.target.className === "toggleNewTrip") {
        if (localStorage.getItem('user_id')) {
            $(function() {
                $('#newTripModal').modal('toggle'); 
            })
        } else {
            $(function() {
                $('#loginModal').modal('toggle'); 
            })
        }
    }
}

function listenAddress(e) {
    if (e.target.className === "select-address") {
  
        const select = e.target
        const selectedInput = select.options[select.selectedIndex]
        const selectedAddress = selectedInput.getAttribute('data-address')

        const addressInput = e.target.nextElementSibling.nextElementSibling
        addressInput.value = selectedAddress
    }
}

function listenNewTripFromYale(e) {
    //Create new Trip
    if (e.target.className === "new-trip-from-yale") {
        e.preventDefault()

        let userId = localStorage.getItem('user_id')
        let tbody = document.querySelector('tbody')

        fetch("http://localhost:3000/trips", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                destination: e.target.children[0].value,
                origin: "Yale",
                address: e.target.children[2].value,
                capacity: e.target.children[4].value,
                start_time: moment.parseZone(e.target.children[6].value.split(" - ")[0], 'MM/DD/YYYY hh:mm a').format(),
                end_time: moment.parseZone(e.target.children[6].value.split(" - ")[1], 'MM/DD/YYYY hh:mm a').format(),
                user_id: userId
            })
        }).then(response => response.json())
        .then(trip => {
            $(function() {
                $('#newTripModal').modal('toggle'); 
            })

            let tr = document.createElement("tr")

            tr.innerHTML = `<td id="tdx">${trip.destination}</td>
            <td id="tdx">${trip.address}</td>
            <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
            <td id="tdx">${trip.users.length}/${trip.capacity}</td>
            <td id="tdx">Already Joined!</td>`

            tbody.appendChild(tr)
        })
    }
}

function listenNewTripToYale(e) {
    //Create new Trip
    if (e.target.className ==="new-trip-to-yale") {
        e.preventDefault()

        let userId = localStorage.getItem('user_id')
        let tbody = document.querySelector('tbody')

        fetch("http://localhost:3000/trips", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                destination: "Yale",
                origin: e.target.children[0].value,
                address: e.target.children[2].value,
                capacity: e.target.children[4].value,
                start_time: moment.parseZone(e.target.children[6].value.split(" - ")[0], 'MM/DD/YYYY hh:mm a').format(),
                end_time: moment.parseZone(e.target.children[6].value.split(" - ")[1], 'MM/DD/YYYY hh:mm a').format(),
                user_id: userId
            })
        }).then(response => response.json())
        .then(trip => {
            $(function() {
                $('#newTripModal').modal('toggle'); 
            })

            let tr = document.createElement("tr")

            tr.innerHTML = `<td id="tdx">${trip.origin}</td>
            <td id="tdx">${trip.address}</td>
            <td id="tdx">${formatDate(trip.start_time)} - ${formatDate(trip.end_time)}</td>
            <td id="tdx">${trip.users.length}/${trip.capacity}</td>
            <td id="tdx">Already Joined!</td>`

            tbody.appendChild(tr)
        })
    }
}

function listenForJoin(e) {
    if (e.target.className === "join" && e.target.tagName === "BUTTON") {
        if (localStorage.getItem('user_id')) {
            $(function() {
                $('#joinModal').modal('toggle'); 
            })

            const button = e.target
            const td = e.target.parentElement
            const tripId = e.target.dataset.id
            const tripCapacity = e.target.parentElement.previousElementSibling

            document.querySelector("#confirm-join").addEventListener("click", function(e) {
                    console.log("test")
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

                        resetJoinModal()
                    })
            })

            document.querySelector('#x-close').addEventListener('click', function(e){
                resetJoinModal()
                    $(function() {
                        $('#joinModal').modal('toggle'); 
                    })
            })

            document.querySelector('#nevermind').addEventListener('click', function(e){
                resetJoinModal()
                    $(function() {
                        $('#joinModal').modal('toggle'); 
                    })
            })
        } else {
            $(function() {
                $('#loginModal').modal('toggle'); 
            })
        }
    }
}

function resetJoinModal() {
    const table = document.querySelector('table.table')
    
    table.children[2].innerHTML = ""
    table.children[2].innerHTML = `
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="joinModalLabel">Trip Confirmation</h5>
                <button type="button" id="x-close" class="close" aria-label="Close">
                    <span id="x-close" aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Press 'Ok' to join this trip and notify other members by email.
            </div>
            <div class="modal-footer">
                <button id="confirm-join" type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
                <button type="button" id="nevermind" class="btn btn-secondary">Nevermind</button>
            </div>
        </div>
    </div>`
}

function listenUnjoin(e) {
    if (e.target.className === "unjoin" && e.target.tagName === "BUTTON" && e.target.dataset.trip) {
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
    } else if (e.target.className === "unjoin" && e.target.tagName === "BUTTON") {
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
}

function resetUnjoinModal() {
    
}


//Handles login sequence
function listenLogin(e) {
    if (e.target.className === "lg") {
        //Handles Login Functionality                
        e.preventDefault()

        const loginModal = document.querySelector("div#loginModal")
        const loginForm = loginModal.querySelector("form.lg")

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
                $(function() {
                    $('#loginModal').modal('toggle'); 
                })
                loginForm.reset()
                localStorage.setItem("user_id", data.id)
                document.querySelector("div#loginBtn").remove()
                createProfileBtn()
                createLogoutBtn()

                displayProfile(data)
            }
        })
    }
}

function listenSignup(e) {
    if (e.target.className === "sign-up") {
        e.preventDefault()
        fetch("http://localhost:3000/users").then(result => result.json()).then(users => {
            const emails = users.map(user => user.email)
            const content = document.querySelector("div.modal-content")

            document.querySelector("div.modal-dialog").classList.add("anim")
            document.querySelector("div.modal-body").classList.add("whiten")
            content.classList.add("lighten")
            document.querySelector("form.lg").classList.add("disappear")
            document.querySelector("div.signup-link").classList.add("disappear")

            setTimeout(function() {
                content.innerHTML =  `<div class="modal-header">
                                        <h5 class="modal-title" id="SignupModalLabel">Signup</h5>
                                        <button type="button" class="close" id="close" aria-label="Close">
                                        <span class="closeReset" aria-hidden="true">&times;</span>
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

                            form.addEventListener("submit", function(e) {
                                e.preventDefault()
                                phone = form.children[2].value
        
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

                                                    $(function() {
                                                        $('#loginModal').modal('toggle'); 
                                                    })
                                                    setTimeout(resetLogin, 1000)
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

function listenClose(e) {
    if (e.target.className === "closeReset") {
        $(function() {
            $('#loginModal').modal('toggle'); 
        })
        setTimeout(function() {
            resetLogin()
        }, 1000)
    }
}


//Handles adding buttons depending on login/logout status
function createProfileBtn() {
    const profileBtn = document.createElement("div")
    profileBtn.id = "profile"
    profileBtn.className = "btn btn-outline"
    profileBtn.innerText = "Profile"
    toolbar.appendChild(profileBtn)
}

function listenProfileBtn(e) {
    if (e.target.id === "profile") {
        let userId = localStorage.getItem('user_id')
        fetch(`${BASE_URL}/users/${userId}`)
        .then(res => res.json())
        .then(user => {
            displayProfile(user)
        })
    }
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
}

function listenLogoutBtn(e) {
    // Logout functionality
    if (e.target.id === "logout") {
        localStorage.removeItem('user_id')
        document.querySelector("div#logout").remove()
        document.querySelector("div#profile").remove()
        createLoginBtn()
        displayHome()
    }
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