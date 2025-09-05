// java.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        if (!username) return alert("Please enter a username.");

        try {
            const db = firebase.firestore();

            // Check if user exists in Firestore
            const userDoc = await db.collection("users").doc(username).get();

            if (userDoc.exists) {
                // Save current user in localStorage
                localStorage.setItem("currentUser", username);

                // Add to logged-in users list in localStorage
                let loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];
                if (!loggedInUsers.includes(username)) {
                    loggedInUsers.push(username);
                    localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
                }

                // Redirect to users.html
                window.location.href = "users.html";
            } else {
                alert("User does not exist. Please register first on Velox.");
            }
        } catch (error) {
            console.error(error);
            alert("Error checking user. Please try again later.");
        }
    });
});
