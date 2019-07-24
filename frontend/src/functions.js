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
			localStorage.setItem("user_id", data.id)
			loginDiv.innerHTML = ""
			// displayHomePage(data)
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

// function displayHomePage(user) {
// 	const button = document.createElement('button')
// 	button.id ="logout"
// 	button.innerText="Logout"
// 	console.log(button)
// 	buttonDiv.append(button)
  
// 	// Logout functionality
// 	const logoutButton = document.querySelector('button#logout')
// 	console.log(logoutButton)
// 	logoutButton.addEventListener('click', function(e){
// 		localStorage.removeItem('user_id')
// 		displayLogin()
// 	})
// }

function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
}