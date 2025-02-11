<?php
// Paramètres de connexion à la base de données
$servername = "localhost";  // à adapter si nécessaire
$username = "root";         // votre nom d'utilisateur MySQL
$password = "";             // votre mot de passe MySQL
$dbname = "parc_animalier"; // le nom de votre base de données

// Créer une connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

// Requête pour récupérer les informations des enclos, des animaux et des biomes
$sql = "
    SELECT
        enclosures.enclosure_id,
        enclosures.position_x,
        enclosures.position_y,
        biomes.name AS biome_name,
        biomes.description AS biome_description,
        biomes.color_code AS biome_color_code,
        animals.name AS animal_name,
        animals.description AS animal_description
    FROM enclosures
    LEFT JOIN animals ON enclosures.enclosure_id = animals.enclosure_id
    LEFT JOIN biomes ON enclosures.biome_id = biomes.id
";
$result = $conn->query($sql);

// Tableau pour stocker les données des enclos
$enclosures = array();

if ($result->num_rows > 0) {
    // Sortie des données de chaque ligne
    while ($row = $result->fetch_assoc()) {
        $enclosure_id = $row['enclosure_id'];

        // Si l'enclos n'existe pas encore dans le tableau, l'initialiser
        if (!isset($enclosures[$enclosure_id])) {
            $enclosures[$enclosure_id] = [
                'enclosure_id' => $enclosure_id,
                'position_x' => $row['position_x'],
                'position_y' => $row['position_y'],
                'biome_name' => $row['biome_name'],
                'biome_description' => $row['biome_description'],
                'biome_color_code' => $row['biome_color_code'],
                'animals' => []
            ];
        }

        // Ajouter l'animal à l'enclos
        if (!empty($row['animal_name'])) {
            $enclosures[$enclosure_id]['animals'][] = [
                'name' => $row['animal_name'],
                'description' => $row['animal_description']
            ];
        }
    }
} else {
    echo json_encode(['error' => 'Aucun enclos trouvé']);
    exit();
}

// Renvoyer les données au format JSON
echo json_encode(array_values($enclosures));

// Fermer la connexion à la base de données
$conn->close();
?>
