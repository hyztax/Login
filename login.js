document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("loginForm");

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBXb9OhOEOo4gXNIv2WcCNmXfnm1x7R2EM",
        authDomain: "velox-c39ad.firebaseapp.com",
        projectId: "velox-c39ad",
        storageBucket: "velox-c39ad.appspot.com",
        messagingSenderId: "404832661601",
        appId: "1:404832661601:web:9ad221c8bfb459410bba20",
        measurementId: "G-X8W755KRF6"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Sign in anonymously
    try {
        await auth.signInAnonymously();
    } catch (err) {
        console.error("Anonymous Auth error:", err);
        alert("Failed to authenticate. Try again later.");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userId = document.getElementById("username").value.trim();
        if (!userId) return alert("Please enter your user ID.");

        try {
            // Check if user exists in "users" collection
            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists) {
                alert("User does not exist. Please register first on Velox.");
                return;
            }

            const displayName = userDoc.data().displayName;

            // Save to localStorage
            localStorage.setItem("currentUserId", userId);
            localStorage.setItem("currentDisplayName", displayName);

            // Add to loggedInUsers collection
            await db.collection("loggedInUsers").doc(userId).set({
                displayName: displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Redirect with username & displayName in URL
            window.location.href = `users.html?userId=${encodeURIComponent(userId)}&displayName=${encodeURIComponent(displayName)}`;
        } catch (err) {
            console.error("Firestore error:", err);
            alert("Error checking user. Please try again later.");
        }
    });
});
