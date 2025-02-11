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


document.addEventListener('DOMContentLoaded', function () {
    const adultInput = document.querySelector('.ticket-type-grid .ticket-type-card:nth-child(1) .quantity-input');
    const childInput = document.querySelector('.ticket-type-grid .ticket-type-card:nth-child(2) .quantity-input');
    const babyInput = document.querySelector('.ticket-type-grid .ticket-type-card:nth-child(3) .quantity-input');
    const adultsTotal = document.getElementById('adults-total');
    const childrenTotal = document.getElementById('children-total');
    const grandTotal = document.getElementById('grand-total');
    const ticketForm = document.querySelector('.ticket-form');

    let userId = null;

    // Étape 1 : Vérification de la session utilisateur via le backend Node.js
    fetch('http://localhost:3000/check-session', {
        method: 'GET',
        credentials: 'include' // Inclure les cookies de session
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.username) {
            console.log(`Utilisateur connecté : ${data.username}`);
            userId = data.username; // Ici, remplacez par user_id si la route le renvoie
        } else {
            alert('Vous devez être connecté pour réserver des billets.');
            window.location.href = 'http://localhost:3000';
        }
    })
    .catch(err => {
        console.error('Erreur de session :', err);
        alert('Erreur de session. Veuillez réessayer plus tard.');
    });

    // Mise à jour des totaux
    function calculateTotal() {
        const adultPrice = 22;
        const childPrice = 15;
        const babyPrice = 0;

        const adultsTotalValue = parseInt(adultInput.value) * adultPrice;
        const childrenTotalValue = parseInt(childInput.value) * childPrice;
        const babiesTotalValue = parseInt(babyInput.value) * babyPrice;

        adultsTotal.textContent = `${adultsTotalValue}€`;
        childrenTotal.textContent = `${childrenTotalValue}€`;
        grandTotal.textContent = `${adultsTotalValue + childrenTotalValue + babiesTotalValue}€`;
    }

    // Soumission de la réservation
    ticketForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const visitDate = document.getElementById('visit-date').value;
        const totalTickets =
            parseInt(adultInput.value) + 
            parseInt(childInput.value) + 
            parseInt(babyInput.value);

        if (!userId) {
            alert('Erreur : Utilisateur non connecté.');
            return;
        }

        if (totalTickets === 0 || !visitDate) {
            alert('Veuillez sélectionner au moins un billet et une date.');
            return;
        }

        // Envoi de la réservation au backend
        fetch('http://localhost:3000/submit-reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Permet d'envoyer les cookies de session
            body: JSON.stringify({
                user_id: userId, 
                visit_date: visitDate,
                num_tickets: totalTickets
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Réservation réussie !');
                window.location.reload();
            } else {
                alert('Erreur : ' + data.message);
            }
        })
        .catch(err => {
            console.error('Erreur de réservation :', err);
            alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        });
    });

    // Gestion des boutons de quantité
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.quantity-input');
            input.value = Math.min(10, parseInt(input.value) + 1);
            calculateTotal();
        });
    });

    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.quantity-input');
            input.value = Math.max(0, parseInt(input.value) - 1);
            calculateTotal();
        });
    });

    calculateTotal();
});
