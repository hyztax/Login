document.addEventListener("DOMContentLoaded", function() {
    const dots = document.getElementById("dots");
    let dotCount = 0;
    const maxDots = 3;

    // Animate dots for "Redirecting..."
    setInterval(() => {
        dotCount = (dotCount + 1) % (maxDots + 1);
        dots.textContent = ".".repeat(dotCount);
    }, 500);

    // After 2 seconds, redirect to a new site
    setTimeout(() => {
        window.location.href = "https://www.roblox.com";
    }, 3000);
});
