// Get references to your HTML elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");

// Deployed backend URL (must include https:// and endpoint)
const BACKEND_URL = "https://login-production-3b5c.up.railway.app/checkDiscordMember";


// Listen for the form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent default form submission

  const discordId = usernameInput.value.trim();
  if (!discordId) return alert("Please enter your Discord ID!");

  try {
    // Send request to your backend
    const res = await fetch(`${BACKEND_URL}?discordId=${discordId}`);
    const data = await res.json();

    if (res.ok) {
      if (data.isMember) {
        alert("✅ You are in the server! Role claimed successfully.");
      } else {
        alert("❌ You are not in the server.");
      }
    } else {
      alert("Error: " + (data.message || "Something went wrong."));
    }
  } catch (err) {
    console.error(err);
    alert("Failed to connect to the backend. Try again later.");
  }
});
