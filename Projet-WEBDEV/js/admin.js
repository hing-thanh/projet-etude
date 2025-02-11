document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est admin via /check-admin
    fetch('http://localhost:3000/check-admin', {
        method: 'GET',
        credentials: 'include' // Inclure les cookies pour les sessions
    })
        .then(response => response.json())
        .then(data => {
            const welcomeMessage = document.getElementById('welcome-message');

            if (data.success && data.role === 'admin') {
                console.log('Administrateur connecté :', data.username);
                if (welcomeMessage) {
                    welcomeMessage.textContent = `Bienvenue, Administrateur ${data.username}`;
                }
                setupAdminFeatures();
            } else {
                console.warn('Accès interdit.');
                alert("Accès refusé. Vous devez être administrateur.");
                window.location.href = 'acceuil.html';
            }
        })
        .catch(err => {
            console.error('Erreur lors de la vérification de l\'administration :', err);
            alert("Erreur serveur. Veuillez réessayer.");
            window.location.href = 'acceuil.html';
        });
});

function setupAdminFeatures() {
    // Charger les enclos pour les panneaux déroulants et afficher leurs détails
    fetch('http://localhost:3000/admin/enclosure-details', {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateEnclosureDropdown(data.enclosures);
            } else {
                alert('Erreur lors du chargement des enclos.');
            }
        })
        .catch(err => console.error('Erreur lors de la récupération des enclos :', err));

    // Charger les animaux pour les déplacer
    fetch('http://localhost:3000/admin/animal-details', {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateAnimalDropdown(data.animals);
            } else {
                alert('Erreur lors du chargement des animaux.');
            }
        })
        .catch(err => console.error('Erreur lors de la récupération des animaux :', err));

    setupForms();
}

function setupForms() {
    // Formulaire pour mettre à jour les horaires de nourrissage
    const feedingScheduleForm = document.getElementById('feeding-schedule-form');
    feedingScheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const enclosure_id = document.getElementById('feeding-enclosure-select').value;
        const feeding_schedule = document.getElementById('feeding-schedule').value;

        fetch('http://localhost:3000/admin/update-feeding-schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ enclosure_id, feeding_schedule })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(err => console.error('Erreur mise à jour horaires :', err));
    });

    // Formulaire pour mettre à jour le statut de l'enclos
    const updateEnclosureStatusForm = document.getElementById('update-enclosure-status-form');
    updateEnclosureStatusForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const enclosure_id = document.getElementById('status-enclosure-select').value;
        const status = document.getElementById('enclosure-status').value;

        fetch('http://localhost:3000/admin/update-enclosure-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ enclosure_id, status })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(err => console.error('Erreur mise à jour statut :', err));
    });

    // Déplacer un animal
    const moveAnimalForm = document.getElementById('move-animal-form');
    moveAnimalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const animal_id = document.getElementById('animal-select').value;
        const new_enclosure_id = document.getElementById('move-enclosure-select').value;

        fetch('http://localhost:3000/admin/move-animal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ animal_id, new_enclosure_id })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(err => console.error('Erreur déplacement animal :', err));
    });
}

function populateEnclosureDropdown(enclosures) {
    const feedingDropdown = document.getElementById('feeding-enclosure-select');
    const statusDropdown = document.getElementById('status-enclosure-select');
    const moveDropdown = document.getElementById('move-enclosure-select');
    const enclosureDetailsDropdown = document.getElementById('enclosure-select');

    enclosures.forEach(enclosure => {
        const option = document.createElement('option');
        option.value = enclosure.enclosure_id;
        option.textContent = `Enclos ${enclosure.enclosure_id} - ${enclosure.status}`;

        feedingDropdown.appendChild(option.cloneNode(true));
        statusDropdown.appendChild(option.cloneNode(true));
        moveDropdown.appendChild(option.cloneNode(true));
        enclosureDetailsDropdown.appendChild(option.cloneNode(true));
    });

    // Ajouter un écouteur pour afficher les détails d'un enclos
    enclosureDetailsDropdown.addEventListener('change', (e) => {
        const selectedEnclosure = enclosures.find(enc => enc.enclosure_id == e.target.value);
        displayEnclosureDetails(selectedEnclosure);
    });
}

function populateAnimalDropdown(animals) {
    const animalDropdown = document.getElementById('animal-select');
    animals.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.animal_id;
        option.textContent = `${animal.name} (ID: ${animal.animal_id})`;
        animalDropdown.appendChild(option);
    });
}

function displayEnclosureDetails(enclosure) {
    const detailsSection = document.getElementById('enclosure-details');

    // Vérifier si enclosure est défini
    if (!enclosure) {
        detailsSection.innerHTML = '<p>Aucun détail disponible pour cet enclos.</p>';
        return;
    }

    const animalNames = enclosure.animal_names && enclosure.animal_names.length > 0
        ? enclosure.animal_names.join(', ')
        : 'Aucun animal';

    detailsSection.innerHTML = `
        <h3>Détails de l'enclos ${enclosure.enclosure_id}</h3>
        <p><strong>Statut :</strong> ${enclosure.status || 'Inconnu'}</p>
        <p><strong>Horaires de nourrissage :</strong> ${enclosure.feeding_schedule || 'Non défini'}</p>
        <p><strong>Animaux :</strong> ${animalNames}</p>
    `;
}
