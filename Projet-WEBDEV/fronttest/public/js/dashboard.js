// dashboard.js

// Vérification si l'utilisateur est connecté
window.addEventListener('DOMContentLoaded', () => checkSession(false));

// Vérification si l'utilisateur est connecté et récupération des données
document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la récupération des données utilisateur');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const { username, email } = data.user;
                document.getElementById('username').textContent = username;
                document.getElementById('email').textContent = email;
            } else {
                alert('Impossible de charger les informations utilisateur');
                window.location.href = '/index.html'; // Redirection si non connecté
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            alert('Erreur lors du chargement du profil');
        });
});

// Gestion de la déconnexion
document.getElementById('logout-button').addEventListener('click', () => {
    fetch('/logout', { method: 'GET' })
        .then(response => {
            if (response.ok) {
                window.location.href = '/index.html';
            }
        })
        .catch(err => console.error('Erreur lors de la déconnexion:', err));
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la récupération des données utilisateur');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const { username, email, role } = data.user;
                document.getElementById('username').textContent = username;
                document.getElementById('email').textContent = email;

                // Ajouter un bouton pour les administrateurs
                if (role === 'admin') {
                    const adminButton = document.createElement('a');
                    adminButton.href = 'http://localhost/Projet-WEBDEV/admin.html';
                    adminButton.textContent = 'Page Admin';
                    adminButton.className = 'bouton';
                    document.querySelector('.profile-container').appendChild(adminButton);
                }
            } else {
                alert('Impossible de charger les informations utilisateur');
                window.location.href = '/index.html'; // Redirection si non connecté
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données utilisateur:', error);
            alert('Erreur lors du chargement du profil');
        });
});
async function checkSession() {
    try {
        const response = await fetch('/check-session', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Erreur lors de la vérification de la session');
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors de la vérification de la session :', error);
        return { success: false };
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const sessionData = await checkSession();

    if (sessionData.success) {
        console.log('Utilisateur connecté :', sessionData.username);

        // Vérification si utilisateur est admin
        if (sessionData.role === 'admin') {
            const adminButton = document.createElement('a');
            adminButton.href = 'http://localhost/Projet-WEBDEV/admin.html';
            adminButton.textContent = 'Page Admin';
            adminButton.className = 'bouton';
            document.querySelector('.profile-container').appendChild(adminButton);
        }
    } else {
        console.error('Utilisateur non connecté');
        window.location.href = '/index.html';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/check-admin', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.role === 'admin') {
            // Create the admin button dynamically
            const adminButton = document.createElement('button');
            adminButton.innerText = 'Admin Panel';
            adminButton.classList.add('admin-button'); // Add a class for styling
            adminButton.addEventListener('click', () => {
                window.location.href = 'http://localhost/Projet-WEBDEV/admin.html';
            });

            // Append the button to the dashboard
            document.querySelector('.dashboard-buttons').appendChild(adminButton);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la vérification du rôle admin:', error);
    });
});
