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