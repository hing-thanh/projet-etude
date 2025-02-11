document.addEventListener('DOMContentLoaded', () => {
    const billeterieLink = document.querySelector('a.cta-button2[href="billetterie.html"]');

    fetch('http://localhost:3000/check-session', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (billeterieLink) {
            billeterieLink.parentElement.style.display = 'none';
        }
        const navContainer = document.getElementById('nav-connection');
        if (data.success && data.username) {

            if (billeterieLink) {
                billeterieLink.parentElement.style.display = 'block';
            }

            navContainer.innerHTML = `<div class="header-container">
            <span class="username-welcome">Bienvenue, ${data.username} !</span>
            <a href="http://localhost:3000" class="cta-button2">Profil</a>
        </div>`;
        }
    })
    .catch(err => console.error('Erreur vérification de session:', err));
});