document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('nav-connection');
    const billeterieLink = document.querySelector('a.cta-button2[href="billetterie.html"]');

    // Étape 1 : Vérification de la session
    fetch('http://localhost:3000/check-session', {
        method: 'GET',
        credentials: 'include' // Nécessaire pour inclure les cookies de session
    })
    .then(response => response.json())
    .then(data => {
        console.log('Réponse de /check-session :', data);

        if (data.success && data.username) {
            // Mise à jour du bouton Connexion -> Profil
            navContainer.innerHTML = `
                <a href="/profile.html" class="cta-button2">Profil</a>
                <span>Bienvenue, ${data.username}!</span>
            `;

            // Étape 2 : Récupération de user_id via PHP
            fetch('getUserId.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${encodeURIComponent(data.username)}`
            })
            .then(response => response.json())
            .then(userData => {
                if (userData.success) {
                    console.log("user_id récupéré :", userData.user_id);

                    // Stockage temporaire pour une autre fonctionnalité
                    localStorage.setItem('user_id', userData.user_id);

                    // Exemple : Attacher une action à la billetterie
                    if (billeterieLink) {
                        billeterieLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            alert(`Redirection avec user_id: ${userData.user_id}`);
                            // Redirection possible avec un paramètre GET
                            window.location.href = `billetterie.html?user_id=${userData.user_id}`;
                        });
                    }
                } else {
                    console.error("Erreur : ", userData.message);
                }
            })
            .catch(err => console.error("Erreur récupération user_id :", err));
        } else {
            // Si utilisateur non connecté, bouton par défaut
            navContainer.innerHTML = `<a href="/login.html" class="cta-button2">Connexion</a>`;
        }
    })
    .catch(err => console.error('Erreur lors de la vérification de session :', err));
});
