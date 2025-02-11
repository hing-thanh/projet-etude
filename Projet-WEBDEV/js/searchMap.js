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

document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map");

    // Ajouter la couche OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const markers = {};
    const markerBounds = [];
    let selectedMarker = null; // Marqueur actuellement sélectionné
    let currentPolyline = null; // Ligne actuelle représentant l'itinéraire
    const visitedPoints = new Set(); // Points déjà visités

    // Éléments DOM
    const enclosureDropdown = document.getElementById("enclosure-dropdown");
    const serviceDropdown = document.getElementById("service-dropdown");
    const startPointDropdown = document.getElementById("start-point");
    const endPointDropdown = document.getElementById("end-point");
    const searchContainer = document.getElementById("search-container");
    const routeContainer = document.getElementById("route-container");
    const addPointBtn = document.getElementById("add-point-btn");
    const createRouteBtn = document.getElementById("create-route-btn");
    const enableRouteBtn = document.getElementById("enable-route-btn");
    const returnToMapBtn = document.getElementById("return-to-map-btn");
    const routeList = document.getElementById("route-list");
    const routeFields = document.getElementById("route-fields");
    let intermediatePoints = []; // Liste des points intermédiaires
    // Fonction pour générer des points intermédiaires artificiels
    // Fonction pour interpoler des points entre deux coordonnées
    function interpolatePoints(start, end, maxDistance) {
        const distance = calculateDistance(start[0], start[1], end[0], end[1]);
        const MAX_STEPS = 10; // Limite arbitraire pour éviter trop de points
    
        if (distance <= maxDistance) {
            return [start, end];
        }
    
        const steps = Math.min(Math.ceil(distance / maxDistance), MAX_STEPS); // Limite le nombre d'étapes
        const points = [];
    
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            points.push([
                start[0] + t * (end[0] - start[0]),
                start[1] + t * (end[1] - start[1]),
            ]);
        }
    
        return points;
    }
    function generateIntermediatePoints(start, end, maxStepDistance) {
        const points = [start];
        let currentPoint = start;
    
        while (calculateDistance(currentPoint[0], currentPoint[1], end[0], end[1]) > maxStepDistance) {
            const t = maxStepDistance / calculateDistance(currentPoint[0], currentPoint[1], end[0], end[1]);
            const nextPoint = [
                currentPoint[0] + t * (end[0] - currentPoint[0]),
                currentPoint[1] + t * (end[1] - currentPoint[1]),
            ];
            points.push(nextPoint);
            currentPoint = nextPoint;
        }
    
        points.push(end);
        return points;
    }
    

    // Fonction pour mettre en évidence un marqueur
    function highlightMarker(marker, description) {
        if (selectedMarker) {
            selectedMarker.setIcon(L.icon({
                iconUrl: 'images/marker-icon.png', // Icône par défaut
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'images/marker-shadow.png',
                shadowSize: [41, 41]
            }));
            selectedMarker.closePopup(); // Fermer l'info-bulle du marqueur précédent
        }

        if (marker) {
            marker.setIcon(L.icon({
                iconUrl: 'images/marker-icon-red.png', // Icône rouge pour sélection
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'images/marker-shadow.png',
                shadowSize: [41, 41]
            }));
            marker.bindPopup(description).openPopup(); // Afficher l'info-bulle
        }

        selectedMarker = marker;
    }

    // Charger les données depuis le backend
    fetch("get_dropdown_data.php")
        .then((response) => response.json())
        .then((data) => {
            // Ajouter les enclos à la carte et aux volets déroulants
            data.enclosures.forEach((enclosure) => {
                const description = `Enclos #${enclosure.enclosure_id} : ${enclosure.animals.join(", ")}`;
                const marker = L.marker([enclosure.position_x, enclosure.position_y]).addTo(map);
                markers[`enclosure-${enclosure.enclosure_id}`] = {
                    marker,
                    coords: [enclosure.position_x, enclosure.position_y],
                    name: description,
                };
                markerBounds.push([enclosure.position_x, enclosure.position_y]);

                marker.on("click", () => {
                    highlightMarker(marker, description);
                    enclosureDropdown.value = `enclosure-${enclosure.enclosure_id}`;
                });

                const option = document.createElement("option");
                option.value = `enclosure-${enclosure.enclosure_id}`;
                option.textContent = description;
                enclosureDropdown.appendChild(option);
                startPointDropdown.appendChild(option.cloneNode(true));
                endPointDropdown.appendChild(option.cloneNode(true));
            });

            // Ajouter les services à la carte et aux volets déroulants
            data.services.forEach((service) => {
                const description = `${service.service_name} (Horaires : ${service.opening_hours})`;
                const marker = L.marker([service.position_x, service.position_y]).addTo(map);
                markers[`service-${service.service_id}`] = {
                    marker,
                    coords: [service.position_x, service.position_y],
                    name: description,
                };
                markerBounds.push([service.position_x, service.position_y]);

                marker.on("click", () => {
                    highlightMarker(marker, description);
                    serviceDropdown.value = `service-${service.service_id}`;
                });

                const option = document.createElement("option");
                option.value = `service-${service.service_id}`;
                option.textContent = description;
                serviceDropdown.appendChild(option);
                startPointDropdown.appendChild(option.cloneNode(true));
                endPointDropdown.appendChild(option.cloneNode(true));
            });

            map.fitBounds(markerBounds, { padding: [50, 50] });
        });
    // Synchronisation : sélection dans les volets déroulants
    enclosureDropdown.addEventListener("change", (event) => {
        const selectedId = event.target.value;
        if (markers[selectedId]) {
            const { marker, coords, name } = markers[selectedId];
            highlightMarker(marker, name);
            map.setView(coords, 18); // Centre la carte sur le marqueur sélectionné
        }
    });

    serviceDropdown.addEventListener("change", (event) => {
        const selectedId = event.target.value;
        if (markers[selectedId]) {
            const { marker, coords, name } = markers[selectedId];
            highlightMarker(marker, name);
            map.setView(coords, 18); // Centre la carte sur le marqueur sélectionné
        }
    });
    // Bouton "Créer votre itinéraire personnalisé"
    enableRouteBtn.addEventListener("click", () => {
        searchContainer.style.display = "none";
        routeContainer.style.display = "block";
    });

    // Bouton "Retour à la carte"
    returnToMapBtn.addEventListener("click", () => {
        routeContainer.style.display = "none";
        searchContainer.style.display = "block";

        if (currentPolyline) {
            map.removeLayer(currentPolyline);
            currentPolyline = null;
        }

        startPointDropdown.value = "";
        endPointDropdown.value = "";
        routeList.innerHTML = "";
        intermediatePoints = [];
        routeFields.innerHTML = "";
        visitedPoints.clear();
    });

    // Ajouter un point intermédiaire
    addPointBtn.addEventListener("click", () => {
        const field = document.createElement("div");
        field.className = "route-field";
        const label = document.createElement("label");
        label.textContent = `Point intermédiaire ${intermediatePoints.length + 1}`;
        const select = document.createElement("select");
        select.className = "search-bar";
        select.innerHTML = startPointDropdown.innerHTML;
        field.appendChild(label);
        field.appendChild(select);
        routeFields.appendChild(field);
        intermediatePoints.push(select);
    });

    // Bouton "Créer votre itinéraire"
    createRouteBtn.addEventListener("click", () => {
        const startPoint = startPointDropdown.value;
        const endPoint = endPointDropdown.value;
    
        if (!startPoint || !endPoint) {
            routeList.innerHTML = `<li>Veuillez sélectionner un point de départ et un point d'arrivée.</li>`;
            return;
        }
    
        const waypoints = [
            startPoint,
            ...intermediatePoints.map((select) => select.value),
            endPoint,
        ]
            .map((id) => markers[id]?.coords)
            .filter((coords) => coords && !visitedPoints.has(coords.join(","))); // Exclure les doublons
    
        console.log("Waypoints sélectionnés :", waypoints);
    
        if (waypoints.length < 2) {
            routeList.innerHTML = `<li>Veuillez sélectionner au moins deux points valides.</li>`;
            return;
        }
    
        // Suivi des points définis manuellement
        const manualPoints = new Set();
        waypoints.forEach((coords) => {
            if (coords) manualPoints.add(coords.join(","));
        });
    
        console.log("Points manuels :", manualPoints);
    
        // Générer le tracé enrichi avec enclos intermédiaires
        const extendedWaypoints = [];
        for (let i = 0; i < waypoints.length - 1; i++) {
            const segmentStart = waypoints[i];
            const segmentEnd = waypoints[i + 1];
        
            const segmentLength = calculateDistance(segmentStart[0], segmentStart[1], segmentEnd[0], segmentEnd[1]);
            let interpolatedSegment;
        
            // Forcer l'ajout de points intermédiaires pour les segments longs
            if (segmentLength > 200) {
                interpolatedSegment = generateIntermediatePoints(segmentStart, segmentEnd, 100);
            } else {
                interpolatedSegment = [segmentStart, segmentEnd];
            }
        
            // Ajouter les sous-segments et détecter les enclos proches
            for (let j = 0; j < interpolatedSegment.length - 1; j++) {
                const subSegmentStart = interpolatedSegment[j];
                const subSegmentEnd = interpolatedSegment[j + 1];
        
                const nearbyEnclosures = Object.values(markers)
                    .filter((m) => {
                        const coordsKey = m.coords.join(",");
                        return (
                            !visitedPoints.has(coordsKey) &&
                            calculateDistance(subSegmentStart[0], subSegmentStart[1], m.coords[0], m.coords[1]) < 100 &&
                            calculateDistance(subSegmentEnd[0], subSegmentEnd[1], m.coords[0], m.coords[1]) < 100
                        );
                    })
                    .map((m) => {
                        visitedPoints.add(m.coords.join(","));
                        return m.coords;
                    });
        
                // Ajouter les points du sous-segment et les enclos détectés
                if (!visitedPoints.has(subSegmentStart.join(","))) {
                    extendedWaypoints.push(subSegmentStart);
                }
                extendedWaypoints.push(...nearbyEnclosures);
            }
        }
        
        extendedWaypoints.push(waypoints[waypoints.length - 1]); // Ajouter le dernier point
    
        // Vérifier le résultat final
        console.log("Points finaux de l'itinéraire :", extendedWaypoints);
    
        // Marquer tous les points comme visités
        extendedWaypoints.forEach((coords) => visitedPoints.add(coords.join(",")));
    
        if (currentPolyline) {
            map.removeLayer(currentPolyline);
        }
    
        currentPolyline = L.polyline(extendedWaypoints, { color: "blue" }).addTo(map);
        map.fitBounds(currentPolyline.getBounds());
    
        routeList.innerHTML = "";
        extendedWaypoints.forEach((coords, index) => {
            const markerName = Object.values(markers).find(
                (m) => m.coords[0] === coords[0] && m.coords[1] === coords[1]
            )?.name || `Point ${index + 1}`;
            routeList.insertAdjacentHTML("beforeend", `<li>${markerName}</li>`);
        });
    });
    


    // Calcul de la distance entre deux points (Haversine)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Rayon de la Terre en mètres
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance en mètres
    }
});
///////////////////