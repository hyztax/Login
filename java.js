document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userId = document.getElementById("username").value.trim();
        if (!userId) return alert("Please enter your user ID.");

        try {
            const db = firebase.firestore();

            // Check if user exists by document ID
            const userDoc = await db.collection("users").doc(userId).get();

            if (!userDoc.exists) {
                alert("User does not exist. Please register first on Velox.");
                return;
            }

            const displayName = userDoc.data().displayName;

            // Save current user in localStorage (optional)
            localStorage.setItem("currentUserId", userId);
            localStorage.setItem("currentDisplayName", displayName);

            // Add user to loggedInUsers collection in Firestore
            await db.collection("loggedInUsers").doc(userId).set({
                displayName: displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Redirect to users.html
            window.location.href = "users.html";
        } catch (error) {
            console.error(error);
            alert("Error checking user. Please try again later.");
        }
    });
});
