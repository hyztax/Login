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
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Sign in anonymously so Firestore rules allow reads
  try {
    await auth.signInAnonymously();
  } catch (err) {
    console.error("Anonymous Auth error:", err);
    alert("Failed to authenticate. Try again later.");
    return;
  }

  // Show success message if username in URL
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  if (username) {
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";
    successMessage.querySelector(".message-title").textContent =
      `You have successfully claimed the role, ${username}!`;
  }

  // Populate logged-in users list with displayName
  const usersList = document.getElementById("usersList");

  db.collection("loggedInUsers")
    .orderBy("timestamp")
    .onSnapshot(async snapshot => {
      usersList.innerHTML = "";

      for (const doc of snapshot.docs) {
        const li = document.createElement("li");

        // Get displayName from the "users" collection
        try {
          const userDoc = await db.collection("users").doc(doc.id).get();
          li.textContent = userDoc.exists
            ? userDoc.data().displayName
            : doc.id;
        } catch (err) {
          console.error("Error fetching displayName:", err);
          li.textContent = doc.id;
        }

        usersList.appendChild(li);
      }
    });
});
