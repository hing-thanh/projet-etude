document.addEventListener('DOMContentLoaded', () => {
    const biomeList = document.getElementById('biomeList'); // Conteneur des cartes de biomes
    const leaveReviewBtn = document.getElementById('leave-review-btn'); // Bouton pour laisser un avis
    const reviewCard = document.getElementById('review-card'); // Carte pour laisser un avis
    const reviewForm = document.getElementById('review-form'); // Formulaire d'avis
    const enclosureSelect = document.getElementById('enclosure-select'); // Sélecteur pour les enclos

    // Charger les données des enclos depuis le backend
    fetch('get_enclosures.php')
        .then(response => response.json())
        .then(data => {
            if (!data || data.error) {
                console.error('Erreur récupération des données:', data.error || 'Aucune donnée');
                return;
            }

            // Grouper les enclos par biome
            const biomes = {};
            data.forEach(enclosure => {
                const biomeName = enclosure.biome_name || `Biome ${enclosure.biome_id}`;
                if (!biomes[biomeName]) {
                    biomes[biomeName] = {
                        name: biomeName,
                        enclosures: []
                    };
                }
                biomes[biomeName].enclosures.push(enclosure);
            });

            // Fonction pour afficher les biomes
            function renderBiomes() {
                biomeList.innerHTML = '';
                Object.values(biomes).forEach(biome => {
                    const biomeCard = document.createElement('div');
                    biomeCard.classList.add('postcard'); // Appliquer le style postcard
                    biomeCard.classList.add('enslosure-card'); // Classe supplémentaire pour les biomes

                    let enclosuresHtml = '<ul>';
                    biome.enclosures.slice(0, 3).forEach(enclosure => {
                        enclosuresHtml += `
                            <li class="enclosure-item">
                                <strong>Enclos ${enclosure.enclosure_id}</strong> - ${
                            enclosure.animal_names && enclosure.animal_names.length > 0
                                ? enclosure.animal_names.slice(0, 3).join(', ')
                                : 'Aucun animal'
                        }
                            </li>
                        `;
                    });
                    enclosuresHtml += '</ul>';

                    biomeCard.innerHTML = `
                        <div class="postcard-header">
                            <h3>${biome.name}</h3>
                        </div>
                        <div class="postcard-content">
                            <h4>Enclos en prévisualisation :</h4>
                            ${enclosuresHtml}
                        </div>
                    `;

                    // Ajouter un gestionnaire d'événement pour afficher les enclos
                    biomeCard.addEventListener('click', () => renderBiomeDetails(biome));
                    biomeList.appendChild(biomeCard);
                });
            }

            // Fonction pour afficher les détails d'un biome
            function renderBiomeDetails(biome) {
                biomeList.innerHTML = '';

                biome.enclosures.forEach(enclosure => {
                    const enclosureCard = document.createElement('div');
                    enclosureCard.classList.add('postcard'); // Appliquer le style postcard
                    enclosureCard.classList.add('enclosure-card'); // Classe supplémentaire pour les enclos

                    let animalDetailsHtml = '<div class="animal-info">';
                    let carouselHtml = '<div class="carousel">';

                    if (enclosure.animal_names && enclosure.animal_names.length > 0) {
                        enclosure.animal_names.forEach((name, index) => {
                            const description = enclosure.animal_descriptions[index] || 'Pas de description.';
                            const imageName = name.replace(/ /g, '_');
                            carouselHtml += `
                                <div class="carousel-item">
                                    <img src="./images/${imageName}.jpg" alt="${name}" class="animal-image">
                                </div>
                            `;
                            animalDetailsHtml += `
                                <div class="animal-info-item">
                                    <h4>${name}</h4>
                                    <p>${description}</p>
                                </div>
                            `;
                        });
                    } else {
                        carouselHtml += '<div class="carousel-item">Aucun animal dans cet enclos.</div>';
                    }

                    carouselHtml += '</div>';
                    animalDetailsHtml += '</div>';

                    enclosureCard.innerHTML = `
                        <div class="postcard-header">
                            <h3>Enclos ${enclosure.enclosure_id}</h3>
                            <p class="feeding-schedule">Horaires de repas : ${enclosure.feeding_schedule || 'Non définis'}</p>
                        </div>
                        <div class="postcard-content">
                            ${carouselHtml}
                            ${animalDetailsHtml}
                        </div>
                    `;

                    biomeList.appendChild(enclosureCard);
                });

                // Bouton retour aux biomes
                const backButton = document.createElement('button');
                backButton.classList.add('back-button');
                backButton.textContent = 'Retour aux biomes';
                backButton.addEventListener('click', renderBiomes);
                biomeList.appendChild(backButton);
            }

            // Initialiser avec les biomes
            renderBiomes();
        })
        .catch(error => console.error('Erreur chargement biomes:', error));

    // Charger les enclos pour le menu déroulant
    fetch('get_enclosures.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(enclosure => {
                const option = document.createElement('option');
                option.value = enclosure.enclosure_id;
                option.textContent = `Enclos ${enclosure.enclosure_id} (${enclosure.animal_names.join(', ')})`;
                enclosureSelect.appendChild(option);
            });
        });

    // Gestion affichage formulaire d'avis
    leaveReviewBtn.addEventListener('click', () => {
        document.querySelectorAll('.postcard').forEach(card => card.style.display = 'none');
        reviewCard.classList.remove('hidden');
    });

    // Gestion soumission avis
    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const enclosureId = enclosureSelect.value;
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;

        if (!enclosureId || !rating || !comment) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        fetch('http://localhost:3000/submit-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const suggestionBox = document.getElementById("suggestion-box");
    const popupCard = document.getElementById("popup-card");
    const popupClose = document.querySelector(".popup-close");
    const animalImage = document.getElementById("animal-image");
    const animalName = document.getElementById("animal-name");
    const animalDescription = document.getElementById("animal-description");
    const enclosureInfo = document.getElementById("enclosure-info");

    // Fetch suggestions as user types
    searchInput.addEventListener("input", async (e) => {
        const query = e.target.value.trim();
        if (query.length === 0) {
            suggestionBox.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/suggest-animals?name=${query}`);
            if (!response.ok) throw new Error("Failed to fetch suggestions.");

            const suggestions = await response.json();
            suggestionBox.innerHTML = suggestions
                .map((animal) => `<div data-name="${animal.name}">${animal.name}</div>`)
                .join("");

            suggestionBox.querySelectorAll("div").forEach((item) => {
                item.addEventListener("click", () => {
                    fetchAnimalDetails(item.getAttribute("data-name"));
                });
            });
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    });

    // Fetch animal details when selected
    async function fetchAnimalDetails(animalName) {
        try {
            // Fetch animal details from the backend
            const response = await fetch(`http://localhost:3000/search-animal?name=${animalName}`);
            if (!response.ok) throw new Error("Failed to fetch animal details.");
    
            // Parse the JSON response
            const animal = await response.json();
    
            // Ensure elements exist in the DOM
            const animalImage = document.getElementById("animal-name");
            const animalNameElement = document.getElementById("animal-name");
            const animalDescription = document.getElementById("animal-description");
            const enclosureInfo = document.getElementById("enclosure-info");
    
            if (!animalImage || !animalNameElement || !animalDescription || !enclosureInfo) {
                console.error("One or more popup elements are missing!");
                return;
            }
    
            // Update popup content with fetched data
            animalImage.src = animal.image_url || "default-image.jpg"; // Use a default image if not provided
            animalNameElement.textContent = animal.animal_name; // Updated field from backend
            animalDescription.textContent = animal.animal_description; // Updated field from backend
            enclosureInfo.textContent = `Enclosure ID: ${animal.enclosure_id}, Biome ID: ${animal.biome_id}, Feeding Schedule: ${animal.feeding_schedule}, Status: ${animal.status}`;
    
            // Show the popup
            togglePopup(true);
        } catch (error) {
            console.error("Error fetching animal details:", error);
        }
    }
    

    // Show or hide popup
    function togglePopup(show) {
        popupCard.classList.toggle("hidden", !show);
    }

    // Close popup on click
    popupClose.addEventListener("click", () => togglePopup(false));

    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
        if (!popupCard.contains(e.target) && e.target !== searchInput) {
            togglePopup(false);
        }
    });
});
async function loadEnclosuresUnderConstruction() {
    try {
        const response = await fetch('http://localhost:3000/enclosures-under-construction');
        if (!response.ok) throw new Error('Failed to fetch enclosures under construction.');

        const enclosures = await response.json();

        const enclosuresList = document.getElementById('enclosures-list');
        if (!enclosuresList) {
            console.error("Element #enclosures-list not found!");
            return;
        }

        enclosuresList.innerHTML = ''; // Clear existing list

        enclosures.forEach(enclosure => {
            const listItem = document.createElement('li');

            const enclosureInfo = document.createElement('p');
            enclosureInfo.textContent = `Enclosure ID: ${enclosure.enclosure_id}, Feeding Schedule: ${enclosure.feeding_schedule}`;

            const animalsList = document.createElement('ul');
            animalsList.style.marginLeft = '20px';
            enclosure.animals.forEach(animal => {
                const animalItem = document.createElement('li');
                animalItem.textContent = animal;
                animalsList.appendChild(animalItem);
            });

            listItem.appendChild(enclosureInfo);
            listItem.appendChild(animalsList);
            enclosuresList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading enclosures under construction:', error);
    }
}

// Call the function after the page loads
document.addEventListener('DOMContentLoaded', loadEnclosuresUnderConstruction);


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

