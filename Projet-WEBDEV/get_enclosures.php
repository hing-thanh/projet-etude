<?php
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'parc_animalier';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Erreur de connexion à la base de données']));
}

$sql = "
    SELECT 
        enclosures.enclosure_id,
        enclosures.biome_id,
        enclosures.position_x,
        enclosures.position_y,
        enclosures.neighbor_1_id,
        enclosures.neighbor_2_id,
        enclosures.distance_to_neighbor_1,
        enclosures.distance_to_neighbor_2,
        enclosures.feeding_schedule, -- Ajout des horaires de nourrissage
        biomes.name AS biome_name,
        GROUP_CONCAT(animals.animal_id) AS animal_ids,
        GROUP_CONCAT(animals.name) AS animal_names,
        GROUP_CONCAT(animals.description) AS animal_descriptions
    FROM enclosures
    LEFT JOIN animals ON enclosures.enclosure_id = animals.enclosure_id
    LEFT JOIN biomes ON enclosures.biome_id = biomes.id
    GROUP BY enclosures.enclosure_id
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $enclosures = [];

    while ($row = $result->fetch_assoc()) {
        $enclosures[] = [
            'enclosure_id' => $row['enclosure_id'],
            'biome_id' => $row['biome_id'],
            'biome_name' => $row['biome_name'],
            'position_x' => $row['position_x'],
            'position_y' => $row['position_y'],
            'neighbor_1_id' => $row['neighbor_1_id'],
            'neighbor_2_id' => $row['neighbor_2_id'],
            'distance_to_neighbor_1' => $row['distance_to_neighbor_1'],
            'distance_to_neighbor_2' => $row['distance_to_neighbor_2'],
            'feeding_schedule' => $row['feeding_schedule'], // Ajout des horaires
            'animal_ids' => $row['animal_ids'] ? explode(',', $row['animal_ids']) : [],
            'animal_names' => $row['animal_names'] ? explode(',', $row['animal_names']) : [],
            'animal_descriptions' => $row['animal_descriptions'] ? explode(',', $row['animal_descriptions']) : []
        ];
    }

    echo json_encode($enclosures);
} else {
    echo json_encode([]);
}

$conn->close();
?>
