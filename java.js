document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userId = document.getElementById("username").value.trim();
        if (!userId) return alert("Please enter your User ID.");

        try {
            // Initialize Firebase if not already done
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey: "AIzaSyBXb9OhOEOo4gXNIv2WcCNmXfnm1x7R2EM",
                    authDomain: "velox-c39ad.firebaseapp.com",
                    projectId: "velox-c39ad"
                });
            }

            // Authenticate anonymously first
            await firebase.auth().signInAnonymously();

            const db = firebase.firestore();

            // Check if user exists by document ID
            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists) {
                alert("User does not exist. Please register first on Velox.");
                return;
            }

            const displayName = userDoc.data().displayName;

            // Save in localStorage
            localStorage.setItem("currentUserId", userId);
            localStorage.setItem("currentDisplayName", displayName);

            // Add user to loggedInUsers collection
            await db.collection("loggedInUsers").doc(userId).set({
                displayName: displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Redirect
            window.location.href = `users.html?userId=${encodeURIComponent(userId)}&displayName=${encodeURIComponent(displayName)}`;

        } catch (error) {
            console.error("Firestore / Auth Error:", error);
            alert("Error checking user. Please try again later.");
        }
    });
});
