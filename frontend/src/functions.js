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
		console.log(email)
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
            } else {
                localStorage.setItem("user_id", data.id)
			    loginDiv.innerHTML = ""
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
										<input type="text" placeholder="Petey">
										<p>Last Name</p>
										<input type="text" placeholder="Salovey">
										<p>Email</p>
										<input type="email" placeholder="handsome.dan@yale.edu">
										<input type="submit" value="Create Account">
									</form>
									<div class="link">
										<a href="" class="go-back">Go Back</a>
									</div>
								</div>
							</div>`
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
            })	
        }
    })
}