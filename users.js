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

  // Initialize Firebase if not done already
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  // Show success message if displayName in URL
const params = new URLSearchParams(window.location.search);
const displayName = params.get("displayName");
if (displayName) {
  const successMessage = document.getElementById("success-message");
  successMessage.style.display = "block";
  successMessage.querySelector(".message-title").innerHTML =
    'You have successfully claimed the role <span style="color: rgb(99, 13, 13);">[tester]</span>!';
}


  // Populate logged-in users list
  const usersList = document.getElementById("usersList");

  try {
    db.collection("loggedInUsers")
      .orderBy("timestamp")
      .onSnapshot(snapshot => {
        usersList.innerHTML = ""; // Clear list
        snapshot.docs.forEach(doc => {
          const li = document.createElement("li");
          li.textContent = doc.data().displayName || doc.id;
          usersList.appendChild(li);
        });
      });
  } catch (error) {
    console.error("Failed to fetch logged-in users:", error);
    usersList.innerHTML = "<li>Failed to load users</li>";
  }
});
