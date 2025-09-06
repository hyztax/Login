document.addEventListener("DOMContentLoaded", async () => {
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
  const db = firebase.firestore();

  const successMessage = document.getElementById("success-message");
  successMessage.style.display = "block";
  successMessage.querySelector(".message-title").textContent =
    `You have successfully claimed the role [tester]`;

  const usersList = document.getElementById("usersList");

  // Get current user from localStorage
  const currentDisplayName = localStorage.getItem("currentDisplayName");

  // Render the current user immediately
  if (currentDisplayName) {
    const li = document.createElement("li");
    li.textContent = currentDisplayName;
    usersList.appendChild(li);
  }

  // Listen to loggedInUsers collection and render all users
  db.collection("loggedInUsers")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      // Clear all except current user
      usersList.innerHTML = "";
      if (currentDisplayName) {
        const li = document.createElement("li");
        li.textContent = currentDisplayName;
        usersList.appendChild(li);
      }

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.displayName && data.displayName !== currentDisplayName) {
          const li = document.createElement("li");
          li.textContent = data.displayName;
          usersList.appendChild(li);
        }
      });
    });
});
