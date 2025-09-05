document.addEventListener("DOMContentLoaded", async () => {
  // Firebase config
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

  try {
    await auth.signInAnonymously();
  } catch (err) {
    console.error("Anonymous Auth error:", err);
    alert("Failed to authenticate. Try again later.");
    return;
  }

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredName = document.getElementById("username").value.trim();
    if (!enteredName) return alert("Please enter your display name.");

    try {
      // Query users collection for displayName match
      const usersSnapshot = await db.collection("users").where("displayName", "==", enteredName).get();

      if (usersSnapshot.empty) {
        alert("No user found with that display name. Please register first.");
        return;
      }

      // There should be only one match
      const userDoc = usersSnapshot.docs[0];
      const userId = userDoc.id;
      const displayName = userDoc.data().displayName;

      // Save in localStorage
      localStorage.setItem("currentUserId", userId);
      localStorage.setItem("currentDisplayName", displayName);

      // Add to logged-in users collection
      await db.collection("loggedInUsers").doc(userId).set({
        displayName: displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Redirect with username & displayName in URL
      window.location.href = `users.html?userId=${encodeURIComponent(userId)}&displayName=${encodeURIComponent(displayName)}`;
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Failed to check username. Try again later.");
    }
  });
});
