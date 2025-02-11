document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/check-session', {
        method: 'GET',
        credentials: 'include' // Inclure les cookies de session
    })
    .then(response => response.json())
    .then(data => {
        console.log('Réponse reçue du backend :', data);

        const navContainer = document.getElementById('nav-connection');
        
        if (data.success && data.user) {
            // Si l'utilisateur est connecté, changer en bouton "Profil"
            navContainer.innerHTML = `
                <a href="/profile.html" class="cta-button2">Profil</a>
            `;
        } else {
            // Sinon, laisser "Connexion"
            navContainer.innerHTML = `
                <a href="/login.html" class="cta-button2">Connexion</a>
            `;
        }
    })
    .catch(err => console.error('Erreur lors de la vérification de session :', err));
});
