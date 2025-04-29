// Simulating stored user data (In a real-world scenario, this would be done via API)
const userDatabase = {
    username: "Guest",
    passwordHash: "$2a$10$K.VW4E6TLbQ06WhUn15M6eK5uWV1kUbXFEoZ/J4Pr6YmPH3fU9Uti", // Hashed "Admin"
    profilePicture: "https://via.placeholder.com/150",
    email: "guest@example.com",
    phone: "(123) 456-7890",
    address: "123 Main Street, Springfield"
};

// Function to handle the login process
function handleLogin(event) {
    event.preventDefault();

    // Get the username and password from the form
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    // Simulating user validation with bcrypt
    if (usernameInput === userDatabase.username) {
        // Compare the entered password with the hashed password
        bcrypt.compare(passwordInput, userDatabase.passwordHash, function (err, result) {
            if (result) {
                // User is authenticated, redirect to profile page
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("username", userDatabase.username);
                localStorage.setItem("profilePicture", userDatabase.profilePicture);
                localStorage.setItem("email", userDatabase.email);
                localStorage.setItem("phone", userDatabase.phone);
                localStorage.setItem("address", userDatabase.address);

                // Redirect to profile page
                window.location.href = "profile.html"; // Make sure profile.html exists
            } else {
                // Display error message if password is incorrect
                alert("Incorrect password. Please try again.");
            }
        });
    } else {
        // Display error message if username is incorrect
        alert("Incorrect username. Please try again.");
    }
}

// Attach event listener to the login form
document.getElementById("login-form").addEventListener("submit", handleLogin);
