// index.js

// Vérification si l'utilisateur est déjà connecté
window.addEventListener('DOMContentLoaded', () => checkSession(true));

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const signupData = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email')
    };

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById('showLoginForm').click();
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('showSignupForm').addEventListener('click', function () {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
});

document.getElementById('showLoginForm').addEventListener('click', function () {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
});
