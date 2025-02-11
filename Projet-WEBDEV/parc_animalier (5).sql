-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 19 déc. 2024 à 23:43
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `parc_animalier`
--

-- --------------------------------------------------------

--
-- Structure de la table `animals`
--

DROP TABLE IF EXISTS `animals`;
CREATE TABLE IF NOT EXISTS `animals` (
  `animal_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `enclosure_id` int DEFAULT NULL,
  `biome_id` int DEFAULT NULL,
  PRIMARY KEY (`animal_id`),
  KEY `enclosure_id` (`enclosure_id`),
  KEY `biome_id` (`biome_id`)
) ENGINE=MyISAM AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `animals`
--

INSERT INTO `animals` (`animal_id`, `name`, `description`, `enclosure_id`, `biome_id`) VALUES
(1, 'Cigogne', 'Grand oiseau échassier, souvent associé à la migration et aux zones humides.', 1, 1),
(2, 'Marabout', 'Grand oiseau charognard d’Afrique, reconnaissable par son long bec.', 1, 1),
(3, 'Oryx algazelle', 'Antilope blanche aux longues cornes, adaptée aux environnements désertiques.', 2, 1),
(4, 'Watusi', 'Bovin africain célèbre pour ses longues cornes impressionnantes.', 2, 1),
(5, 'Âne de somalie', 'Espèce rare d’âne, connue pour sa robustesse et ses rayures sur les pattes.', 2, 1),
(6, 'Yack', 'Grand bœuf domestiqué des montagnes, reconnaissable par ses longs poils.', 3, 1),
(7, 'Mouton noir', 'Un mouton à la laine sombre, souvent utilisé pour son caractère rustique.', 3, 1),
(8, 'Bison', 'Mammifère imposant, connu pour sa grande bosse et sa force.', 4, 1),
(9, 'Âne de provence', 'Un âne robuste, souvent utilisé pour le transport dans le sud de la France.', 5, 1),
(10, 'Dromadaire', 'Mammifère à une seule bosse, adapté aux climats désertiques.', 5, 1),
(11, 'Ibis', 'Oiseau aux longues pattes et bec incurvé, souvent vu dans les zones humides.', 6, 1),
(12, 'Tortue', 'Reptile à carapace, connu pour sa lenteur et sa longévité.', 6, 1),
(13, 'Pécari', 'Un animal ressemblant à un sanglier, habitant les régions boisées.', 7, 1),
(14, 'Tamanoir', 'Fourmilier géant, connu pour son long museau et sa langue collante.', 8, 1),
(15, 'Nandou', 'Oiseau coureur d’Amérique du Sud, apparenté à l’autruche.', 8, 1),
(16, 'Flamant rose', 'Oiseau au plumage rose, souvent vu dans des eaux peu profondes sur une seule patte.', 8, 1),
(17, 'Émeu', 'Le deuxième plus grand oiseau vivant, originaire d’Australie.', 9, 1),
(18, 'Wallaby', 'Petit marsupial australien, ressemblant à un kangourou.', 9, 1),
(19, 'Porc-épic', 'Rongeur couvert de piquants défensifs.', 10, 1),
(20, 'Lynx', 'Félin sauvage aux oreilles touffues, habitant les régions forestières.', 11, 1),
(21, 'Serval', 'Félin africain de taille moyenne, reconnaissable par ses longues pattes et ses taches noires.', 12, 1),
(22, 'Chien des buissons', 'Petit carnivore social d’Amérique du Sud, souvent observé en groupes.', 13, 1),
(23, 'Tigre', 'Grand félin rayé, reconnu pour sa puissance et sa discrétion.', 14, 1),
(24, 'Macaque  rabier', 'Animal sans description spécifique.', 15, 2),
(25, 'Cerf', 'Grand herbivore, reconnaissable par ses bois majestueux.', 16, 2),
(26, 'Vautour', 'Oiseau charognard, souvent vu planer à la recherche de nourriture.', 17, 2),
(27, 'Antilope', 'Mammifère herbivore agile, vivant dans les savanes et les plaines.', 18, 2),
(28, 'Daim', 'Cerf de taille moyenne, souvent observé dans les parcs boisés.', 18, 2),
(29, 'Nilgaut', 'Grande antilope d’Asie, reconnaissable par son pelage gris.', 18, 2),
(30, 'Loup d\'Europe', 'Carnivore social, vivant en meutes dans les forêts européennes.', 19, 2),
(31, 'Loutre', 'Petit mammifère semi-aquatique, connu pour son jeu et son habileté à nager.', 20, 3),
(32, 'Binturong', 'Carnivore arboricole d’Asie, parfois appelé “chat-ours”.', 20, 3),
(33, 'Mouflon', 'Mouton sauvage, connu pour ses cornes enroulées.', 21, 3),
(34, 'Tortue', 'Reptile à carapace, connu pour sa lenteur et sa longévité.', 22, 3),
(35, 'Lémurien', 'Primate de Madagascar, connu pour ses grands yeux et sa queue annelée.', 23, 3),
(36, 'Chèvre naine', 'Petite chèvre, souvent gardée dans les fermes et zoos pour son caractère amical.', 24, 3),
(37, 'Panda roux', 'Petit mammifère arboricole, avec une fourrure rougeâtre.', 25, 3),
(38, 'Panthère', 'Félin élégant, souvent confondu avec le léopard.', 26, 3),
(39, 'Grand Hocco', 'Grand oiseau terrestre des forêts tropicales d’Amérique.', 27, 3),
(40, 'Ara Perroquet', 'Grand perroquet coloré des forêts tropicales.', 28, 3),
(41, 'Lion', 'Le roi des animaux, vivant en groupes appelés \"coalitions\".', 29, 4),
(42, 'Hippopotame', 'Grand mammifère semi-aquatique, habitant les rivières et lacs d’Afrique.', 30, 4),
(43, 'Zèbre', 'Équidé rayé, connu pour son pelage noir et blanc distinctif.', 31, 4),
(44, 'Hyène', 'Carnivore social d’Afrique, reconnu pour son rire distinctif.', 32, 4),
(45, 'Loup à crinière', 'Canidé au pelage rougeâtre, vivant en Amérique du Sud.', 33, 4),
(46, 'Girafe', 'Animal le plus grand du monde, au long cou et taches distinctives.', 34, 4),
(47, 'Éléphant', 'Le plus grand mammifère terrestre, avec une trompe distinctive.', 35, 4),
(48, 'Varan de Komodo', 'Le plus grand lézard vivant, capable de chasser des proies imposantes.', 36, 4),
(49, 'Grivet Cercopithèqu', 'Animal sans description spécifique.', 37, 4),
(50, 'Oustiti Gibbon', 'Petit singe au pelage doux, connu pour ses acrobaties.', 38, 4),
(51, 'Oustiti Gibbon', 'Petit singe au pelage doux, connu pour ses acrobaties.', 66, 4),
(52, 'Tamarin Capucin', 'Petit primate, souvent observé en groupes dans les forêts tropicales.', 39, 4),
(53, 'Tamarin Capucin', 'Petit primate, souvent observé en groupes dans les forêts tropicales.', 65, 4),
(54, 'Crocodile nain', 'Le plus petit des crocodiles, habitant les rivières tropicales.', 40, 5),
(55, 'Casoar', 'Oiseau coureur dangereux, reconnaissable par son casque sur la tête.', 41, 5),
(56, 'Guépard', 'Le mammifère terrestre le plus rapide, avec une silhouette élancée.', 42, 5),
(57, 'Gazelle', 'Antilope gracieuse, souvent vue bondissant dans les savanes.', 43, 5),
(58, 'Autruche', 'Le plus grand oiseau vivant, incapable de voler mais excellent coureur.', 43, 5),
(59, 'Tapir', 'Mammifère au long museau, vivant dans les forêts tropicales.', 44, 5),
(60, 'Gnou', 'Antilope robuste des plaines africaines, migratrice par nature.', 45, 5),
(61, 'Oryx beisa', 'Antilope aux longues cornes droites, adaptée aux environnements arides.', 45, 5),
(62, 'Rhinocéros', 'Grand mammifère avec une ou deux cornes sur le nez.', 45, 5),
(63, 'Suricate', 'Petit carnivore vivant en groupes dans les déserts africains.', 46, 5),
(64, 'Fennec', 'Renard des sables, connu pour ses grandes oreilles.', 47, 5),
(65, 'Coati', 'Petit mammifère au long museau, habitant les forêts d’Amérique centrale et du Sud.', 48, 5),
(66, 'Saïmiri', 'Petit singe, souvent appelé “singe écureuil”.', 49, 5),
(67, 'Tortue', 'Reptile à carapace, connu pour sa lenteur et sa longévité.', 50, 6),
(68, 'Python', 'Serpent constricteur de grande taille, souvent trouvé dans les forêts tropicales.', 50, 6),
(69, 'Iguane', 'Grand lézard herbivore, vivant dans des climats chauds.', 50, 6);

-- --------------------------------------------------------

--
-- Structure de la table `biomes`
--

DROP TABLE IF EXISTS `biomes`;
CREATE TABLE IF NOT EXISTS `biomes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `color_code` varchar(7) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `biomes`
--

INSERT INTO `biomes` (`id`, `name`, `color_code`, `description`) VALUES
(1, 'Les Clairières', '#F1DA4C', NULL),
(2, 'Le bois des pins', '#79C256', NULL),
(3, 'Le vallon des cascades', '#47AADE', NULL),
(4, 'Le plateau', '#F08328', NULL),
(5, 'Le belvédère', '#C2B8AF', NULL),
(6, 'La bergerie des reptiles', '#63C52B', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `enclosures`
--

DROP TABLE IF EXISTS `enclosures`;
CREATE TABLE IF NOT EXISTS `enclosures` (
  `enclosure_id` int NOT NULL AUTO_INCREMENT,
  `biome_id` int DEFAULT NULL,
  `position_x` float DEFAULT NULL,
  `position_y` float DEFAULT NULL,
  `neighbor_1_id` int DEFAULT NULL,
  `neighbor_2_id` int DEFAULT NULL,
  `distance_to_neighbor_1` float DEFAULT NULL,
  `distance_to_neighbor_2` float DEFAULT NULL,
  `feeding_schedule` varchar(255) DEFAULT 'Non défini',
  `status` enum('ouvert','en travaux') DEFAULT 'ouvert',
  PRIMARY KEY (`enclosure_id`),
  KEY `biome_id` (`biome_id`),
  KEY `neighbor_1_id` (`neighbor_1_id`),
  KEY `neighbor_2_id` (`neighbor_2_id`)
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `enclosures`
--

INSERT INTO `enclosures` (`enclosure_id`, `biome_id`, `position_x`, `position_y`, `neighbor_1_id`, `neighbor_2_id`, `distance_to_neighbor_1`, `distance_to_neighbor_2`, `feeding_schedule`, `status`) VALUES
(1, 1, 5.21003, 43.624, 30, 31, 50, 50, '18h', 'ouvert'),
(2, 1, 5.21066, 43.6235, 6, 7, 3, 9, 'Non défini', 'ouvert'),
(3, 1, 5.21184, 43.6233, 2, 8, 62, 2, 'Non défini', 'ouvert'),
(4, 1, 5.21395, 43.6226, 10, 5, 43, 32, '18h', 'ouvert'),
(5, 1, 5.2136, 43.6221, 4, 18, 32, 12, 'Non défini', 'ouvert'),
(6, 1, 5.21055, 43.6232, 7, 33, 10, 22, 'Non défini', 'ouvert'),
(7, 1, 5.21185, 43.6228, 6, 8, 12, 21, 'Non défini', 'ouvert'),
(8, 1, 5.21185, 43.6228, 52, 13, 7, 5, 'Non défini', 'ouvert'),
(9, 1, 5.21245, 43.6227, 8, 52, 73, 3, 'Non défini', 'ouvert'),
(10, 1, 5.21278, 43.6228, 9, 4, 3, 50, 'Non défini', 'ouvert'),
(11, 1, 5.20991, 43.623, 12, 33, 12, 63, 'Non défini', 'ouvert'),
(12, 1, 5.21023, 43.6229, 11, 14, 12, 84, 'Non défini', 'ouvert'),
(13, 1, 5.21099, 43.6228, 51, 8, 4, 6, 'Non défini', 'en travaux'),
(14, 1, 5.21117, 43.6224, 17, 53, 4, 2, 'Non défini', 'ouvert'),
(15, 2, 5.20973, 43.6225, 16, 20, 2, 92, '17h', 'ouvert'),
(16, 2, 5.20961, 43.6222, 15, 17, 2, 72, 'Non défini', 'ouvert'),
(17, 2, 5.2108, 43.6221, 53, 16, 50, 72, 'Non défini', 'ouvert'),
(18, 2, 5.21246, 43.622, 5, 19, 43, 7, 'Non défini', 'ouvert'),
(19, 2, 5.21316, 43.6214, 18, 5, 7, 37, 'Non défini', 'ouvert'),
(20, 3, 5.20904, 43.6231, 15, 34, 82, 112, 'Non défini', 'ouvert'),
(21, 3, 5.20813, 43.623, 22, 56, 26, 38, 'Non défini', 'ouvert'),
(22, 3, 5.20755, 43.623, 21, 55, 21, 17, 'Non défini', 'ouvert'),
(23, 3, 5.20704, 43.6233, 24, 25, 3, 13, 'Non défini', 'ouvert'),
(24, 3, 5.20683, 43.6231, 23, 25, 3, 13, 'Non défini', 'ouvert'),
(25, 3, 5.20674, 43.6237, 23, 24, 13, 14, '9h', 'ouvert'),
(26, 3, 5.20557, 43.6261, 27, 28, 4, 13, 'Non défini', 'ouvert'),
(27, 3, 5.20529, 43.6263, 26, 28, 4, 3, 'Non défini', 'ouvert'),
(28, 3, 5.20515, 43.6264, 27, 26, 4, 12, 'Non défini', 'ouvert'),
(29, 4, 5.20943, 43.6251, 30, 41, 17, 47, 'Non défini', 'ouvert'),
(30, 4, 5.20987, 43.6246, 29, 31, 17, 7, 'Non défini', 'ouvert'),
(31, 4, 5.20934, 43.6243, 32, 1, 42, 49, 'Non défini', 'ouvert'),
(32, 4, 5.20868, 43.6242, 34, 35, 13, 18, 'Non défini', 'ouvert'),
(33, 4, 5.20926, 43.6235, 34, 6, 62, 70, 'Non défini', 'ouvert'),
(34, 4, 5.20793, 43.6239, 32, 20, 5, 22, 'Non défini', 'ouvert'),
(35, 4, 5.20753, 43.6242, 36, 34, 24, 3, 'Non défini', 'ouvert'),
(36, 4, 5.20721, 43.6244, 51, 37, 7, 8, 'Non défini', 'ouvert'),
(37, 4, 5.20699, 43.6243, 36, 54, 8, 10, 'Non défini', 'ouvert'),
(38, 4, 5.20678, 43.6247, 51, 39, 6, 4, 'Non défini', 'ouvert'),
(39, 4, 5.20673, 43.6249, 38, 51, 4, 11, 'Non défini', 'ouvert'),
(65, 4, 5.20669, 43.6249, 39, 64, 2, 6, 'Non défini', 'ouvert'),
(40, 5, 5.20933, 43.6256, 41, 42, 12, 10, 'Non défini', 'ouvert'),
(41, 5, 5.20894, 43.6255, 44, 40, 9, 14, 'Non défini', 'ouvert'),
(42, 5, 5.20897, 43.626, 43, 40, 22, 34, 'Non défini', 'ouvert'),
(43, 5, 5.20846, 43.6261, 42, 45, 21, 44, 'Non défini', 'ouvert'),
(44, 5, 5.20835, 43.6253, 41, 49, 26, 32, 'Non défini', 'ouvert'),
(45, 5, 5.20681, 43.6261, 43, 46, 72, 56, 'Non défini', 'ouvert'),
(46, 5, 5.20684, 43.6257, 45, 47, 8, 6, 'Non défini', 'ouvert'),
(47, 5, 5.20694, 43.6258, 46, 48, 7, 7, 'Non défini', 'ouvert'),
(48, 5, 5.2073, 43.6258, 47, 44, 5, 20, 'Non défini', 'ouvert'),
(49, 5, 5.20755, 43.6256, 47, 44, 5, 20, 'Non défini', 'ouvert'),
(50, 6, 5.20422, 43.6261, 55, 56, 1, 3, 'Non défini', 'ouvert'),
(66, 4, 5.20682, 43.6247, 38, 39, 2, 4, 'Non défini', 'ouvert');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enclosure_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `enclosure_id` (`enclosure_id`),
  KEY `user_id` (`user_id`)
) ;

--
-- Déchargement des données de la table `reviews`
--

INSERT INTO `reviews` (`id`, `enclosure_id`, `user_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 8, 5, 'abdul', '2024-12-17 15:25:39'),
(2, 66, 8, 2, 'dsd', '2024-12-17 15:31:59'),
(3, 1, 14, 3, 'dsdsd', '2024-12-19 15:37:33');

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(255) DEFAULT NULL,
  `enclosure_x` float DEFAULT NULL,
  `enclosure_y` float DEFAULT NULL,
  `biome_id` int NOT NULL,
  `description` varchar(255) DEFAULT '8h-18h',
  PRIMARY KEY (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `enclosure_x`, `enclosure_y`, `biome_id`, `description`) VALUES
(1, 'Restaurant', 5.20661, 43.6243, 4, '8h-18h'),
(2, 'Toillettes', 5.2064, 43.6251, 4, '8h-18h'),
(3, 'Petit train', 5.20786, 43.625, 4, '8h-18h'),
(4, 'Petit train', 5.20514, 43.6261, 3, '8h-18h'),
(5, 'Snack', 5.20738, 43.6229, 3, '8h-18h'),
(6, 'Point d\'eau', 5.20824, 43.6227, 3, '8h-18h'),
(7, 'Toillettes', 5.21058, 43.6229, 1, '8h-18h'),
(8, 'Point d\'eau', 5.21209, 43.6225, 1, '8h-18h'),
(9, 'Point d\'eau', 5.21118, 43.6221, 1, '8h-18h'),
(10, 'Point d\'eau', 5.20772, 43.6236, 4, '8h-18h'),
(11, 'Boutique', 5.20436, 43.6261, 6, '8h-18h'),
(12, 'Toillettes', 5.20408, 43.6259, 6, '8h-18h'),
(13, 'Restaurant', 5.20472, 43.6258, 6, '8h-18h'),
(14, 'Café', 5.20419, 43.6258, 6, '8h-18h');

-- --------------------------------------------------------

--
-- Structure de la table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `num_tickets` int NOT NULL,
  `visit_date` date NOT NULL,
  `purchased_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ;

--
-- Déchargement des données de la table `tickets`
--

INSERT INTO `tickets` (`id`, `user_id`, `num_tickets`, `visit_date`, `purchased_at`) VALUES
(1, 8, 7, '2024-12-04', '2024-12-17 14:20:59'),
(2, 8, 15, '2024-11-29', '2024-12-17 14:24:03'),
(3, 8, 2, '2025-01-04', '2024-12-17 14:25:27'),
(4, 8, 4, '2024-12-03', '2024-12-19 12:44:16'),
(5, 16, 2, '0000-00-00', '2024-12-19 13:52:58');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`) VALUES
(5, 'abc', '$2b$10$VoEIOqjEERGs2aHnl6N6t.K8IqARuxu5YNuJVH1h3d3WJDGrAWNBi', 'abc@abc.abc', 'user', '2024-11-29 11:35:06'),
(6, 'abcdef', '$2b$10$GSAku32GsPaNrYUWaQ/8qu3JznF1.FBtEoSmAIm1ihZaApOH1qvhi', 'abcd@abcd.abcd', 'user', '2024-11-29 16:19:13'),
(4, 'abcde', '$2b$10$q/XMIf7XZ0.rGWemEfHwyeYG0AFHbcqaUxrSIjWKuurVfB1qGPeX.', 'abcde@gmail.com', 'user', '2024-11-29 10:28:34'),
(8, 'abdulabdel', '$2b$10$NkAwZmzSNQz7S.5Gzcs3rO5tdoItQ.BsQlAHVyPolVwQ6BsuoF7De', 'abdul.abdel@alKida.bomb', 'admin', '2024-12-06 11:56:56'),
(9, 'thibault', '$2b$10$m3gF/oiTjhDlYObGoZ5Hf.n/I/9pFmnEP4.SIKZk8Z.U3s4Q5pL06', 'thibault@thibault.thibault', 'admin', '2024-12-09 13:07:18'),
(10, 'leo', '$2b$10$gyS5shySQFp.1zbBCWIJauUGgFEZKRMMAfePO6Gnt/oho66NfJlU6', 'leo2310.sorrentino@gmail.com', 'user', '2024-12-09 13:21:20'),
(11, 'tsingtao', '$2b$10$lW1tBXqCW3rYq5Oq2yB/7uGroo7gIPClpEs86/8fLKkP/hJspBRcO', 'tanviet089@gmail.com', 'user', '2024-12-09 13:27:23'),
(12, 'gros zizi', '$2b$10$KPNrCtdu0n8N3.f2V/ffBObdLut/792kCxW8ogtb4yjEvdNVBT.1G', 'zizi@gmail.prout', 'user', '2024-12-09 15:09:52'),
(13, 'asds', '$2b$10$gtXu9XNl7uvUJFSoCkUx8.QRXsQDpPMIGomNgrE2xCK6mM98Qn7g.', 'adslsd@dskds.cd', 'user', '2024-12-14 22:26:58'),
(14, 'thibault.renand', '$2b$10$E0/qgug9y/8ql2qwRfgoqeT7fmeAROOE6vxhIOFV21tatmq/dTcCe', 'THIBAULT.T@T.T', 'user', '2024-12-16 20:24:23'),
(15, 'THIBAULT1', '$2b$10$4FZiwrgcouoXXGTYadvmde7xKv1QZtAZWouhdv8NbGiJZOYt6OU0m', 'T.T@T', 'user', '2024-12-17 07:07:45'),
(16, 'sergzeg', '$2b$10$6vhluScMNrpvuWW2Dd/c8O3SX3nPyyei6KIhRJd52aUyjML/cGmrK', 'S.S@s', 'user', '2024-12-19 13:52:01');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
