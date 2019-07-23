// const buttonDiv = document.querySelector('div.button')
function displayLogin() {
	// buttonDiv.innerHTML = ""
	loginDiv = document.querySelector('div')
	loginDiv.innerHTML = `<div class="login-container">
					    	<div class="login-box">
					      		<h2>Login</h2>
					      		<form class="lg">
					        		<p>Email</p>
					        		<input type="email" placeholder="handsome.dan@yale.edu">
					        		<input type="submit" value="Log In">
					      		</form>
					      		<h6>Don't have an account?</h6>
					      		<button>Sign Up!</button>
					    	</div>
					      </div>`
	console.log(document.querySelector('form.lg'))
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