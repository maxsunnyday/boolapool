function displayLogin() {
	mainContainer.innerHTML = `
	<form class="login">
		<input type="email" name="email"/>
		<input type="submit"/>
	</form>`

	mainContainer.querySelector("form.login").addEventListener("submit", function(e) {
		e.preventDefault()
		const email = e.target[0].value
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
			displayHomePage(data)
		})
	})
}

function displayHomePage(user) {
	mainContainer.innerHTML += `<h1>Welcome Back ${user.first_name}</h1>
	<button id="logout">Logout</button>`
  
	// Logout functionality
	const logoutButton = document.getElementById('logout')
	logoutButton.addEventListener('click', function(e){
		localStorage.removeItem('user_id')
		displayLogin()
	})
}

function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
}