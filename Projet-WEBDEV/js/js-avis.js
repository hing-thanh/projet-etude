// panneau deroulant
document.addEventListener('DOMContentLoaded', () => {
    const servicesLink = document.querySelector('nav ul li a[href="services.html"]');
    const servicesDropdown = document.createElement('div');
    servicesDropdown.classList.add('services-dropdown');
    
    servicesDropdown.innerHTML = `
        <ul>
            <li><a href="billetterie.html">Billetterie</a></li>
            <li><a href="recherche.html">Pour vous reperer</a></li>
        </ul>
    `;
    
    servicesLink.parentElement.appendChild(servicesDropdown);
});



document.addEventListener('DOMContentLoaded', () => {
    const leaveReviewBtn = document.getElementById('leave-review-btn');
    const reviewCard = document.getElementById('review-card');
    const reviewForm = document.getElementById('review-form');
    const enclosureSelect = document.getElementById('enclosure-select');

    // Étape 1 : Charger les enclos pour le volet déroulant
    fetch('get_enclosures.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Erreur récupération des enclos:', data.error);
                return;
            }

            // Ajouter les enclos dans le menu déroulant
            data.forEach(enclosure => {
                const option = document.createElement('option');
                option.value = enclosure.enclosure_id;
                option.textContent = `Enclos ${enclosure.enclosure_id} (${enclosure.animals.map(a => a.name).join(', ')})`;
                enclosureSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur chargement enclos:', error));

    // Étape 2 : Gérer l'affichage du formulaire
    leaveReviewBtn.addEventListener('click', () => {
        document.querySelectorAll('.enclosure-card').forEach(card => card.style.display = 'none');
        reviewCard.classList.remove('hidden');
    });

    // Étape 3 : Soumettre le formulaire d'avis
    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const enclosureId = enclosureSelect.value;
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;

        fetch('http://localhost:3000/submit-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Nécessaire pour la session
            body: JSON.stringify({ enclosure_id: enclosureId, rating, comment })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Avis soumis avec succès !');
                window.location.reload();
            } else {
                alert('Erreur : ' + data.message);
            }
        })
        .catch(error => console.error('Erreur soumission avis:', error));
    });
});
