// main.js

// Fonction pour vérifier la session avec optimisation pour éviter les boucles de redirection
function checkSession(redirectIfLoggedOut = false) {
    fetch('/check-session', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const currentPage = window.location.pathname;
            if (data.success) {
                console.log(`Utilisateur connecté : ${data.username}`);
                if (redirectIfLoggedOut && currentPage === '/index.html') {
                    window.location.href = 'dashboard.html';
                }
            } else {
                if (redirectIfLoggedOut && currentPage === '/dashboard.html') {
                    window.location.href = 'index.html';
                }
            }
        })
        .catch(error => console.error('Erreur lors de la vérification de la session :', error));
}
