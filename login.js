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

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredId = document.getElementById("username").value.trim();
    if (!enteredId) return alert("Please enter your user ID.");

    try {
      // Check the document by ID
      const userDoc = await db.collection("users").doc(enteredId).get();

      if (!userDoc.exists) {
        alert("No user found with that ID. Please register first.");
        return;
      }

      const displayName = userDoc.data().displayName;

      // Save in localStorage
      localStorage.setItem("currentUserId", enteredId);
      localStorage.setItem("currentDisplayName", displayName);

      // Redirect with ID and displayName in URL
      window.location.href = `users.html?userId=${encodeURIComponent(enteredId)}&displayName=${encodeURIComponent(displayName)}`;
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Failed to check user. Try again later.");
    }
  });
});
