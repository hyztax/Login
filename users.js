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

  // Function to render a user in the list
  const renderUser = (name) => {
    const li = document.createElement("li");
    li.textContent = name;
    usersList.appendChild(li);
  };

  // Get current user from localStorage
  const currentDisplayName = localStorage.getItem("currentDisplayName");

  // Render current user first
  if (currentDisplayName) {
    renderUser(currentDisplayName);
  }

  // Listen to loggedInUsers and render all users except current
  db.collection("loggedInUsers")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      // Clear list first
      usersList.innerHTML = "";

      // Render current user first
      if (currentDisplayName) renderUser(currentDisplayName);

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.displayName && data.displayName !== currentDisplayName) {
          renderUser(data.displayName);
        }
      });
    });
});
