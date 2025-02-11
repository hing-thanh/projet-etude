<?php
header("Content-Type: application/json");

// Connexion à la base de données (root avec mot de passe vide)
try {
    $pdo = new PDO('mysql:host=localhost;dbname=parc_animalier', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur de connexion à la base de données : ' . $e->getMessage()]);
    exit();
}

// Requête pour récupérer les enclos et leurs animaux associés
$enclosuresQuery = "
    SELECT 
        e.enclosure_id,
        e.position_x,
        e.position_y,
        a.name AS animal_name
    FROM enclosures e
    LEFT JOIN animals a ON e.enclosure_id = a.enclosure_id
    ORDER BY e.enclosure_id, a.name
";

// Requête pour récupérer les services
$servicesQuery = "
    SELECT 
        s.service_id,
        s.service_name,
        s.enclosure_x,
        s.enclosure_y,
        s.description AS opening_hours -- Les horaires sont dans la colonne description
    FROM services s
    ORDER BY s.service_name
";

try {
    // Récupération des enclos et animaux
    $enclosuresStmt = $pdo->query($enclosuresQuery);
    $enclosuresData = $enclosuresStmt->fetchAll();

    // Récupération des services
    $servicesStmt = $pdo->query($servicesQuery);
    $servicesData = $servicesStmt->fetchAll();

    // Structuration des données pour les enclos
    $enclosures = [];
    foreach ($enclosuresData as $row) {
        $enclosureId = $row['enclosure_id'];

        if (!isset($enclosures[$enclosureId])) {
            // Inversion des coordonnées x et y pour Leaflet
            $enclosures[$enclosureId] = [
                'enclosure_id' => $row['enclosure_id'],
                'position_x' => $row['position_y'], // Latitude
                'position_y' => $row['position_x'], // Longitude
                'animals' => []
            ];
        }

        if (!empty($row['animal_name'])) {
            $enclosures[$enclosureId]['animals'][] = $row['animal_name'];
        }
    }

    // Structuration des données pour les services
    $services = [];
    foreach ($servicesData as $row) {
        $services[] = [
            'service_id' => $row['service_id'],
            'service_name' => $row['service_name'],
            'position_x' => $row['enclosure_y'], // Latitude (inversée)
            'position_y' => $row['enclosure_x'], // Longitude (inversée)
            'opening_hours' => $row['opening_hours'] // Les horaires proviennent de la colonne description
        ];
    }

    // Résultat final
    $result = [
        'enclosures' => array_values($enclosures),
        'services' => $services
    ];

    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(['error' => 'Erreur lors de la récupération des données : ' . $e->getMessage()]);
    exit();
}
?>
