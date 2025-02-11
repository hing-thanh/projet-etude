#ifndef DATABASE_H
#define DATABASE_H

#define MAX_LENGTH 100

// Structure de l'en-tête
typedef struct {
    short lastUpdateYear;      // Année de dernière mise à jour
    short lastUpdateMonth;     // Mois de dernière mise à jour
    short lastUpdateDay;       // Jour de dernière mise à jour
    int nbRecords;             // Nombre d'enregistrements dans le fichier
    short lengthHeader;        // Taille de l'en-tête
    short lengthRecord;        // Taille de l'enregistrement
} Header;

typedef struct {
   char status;
   int id_article;               // Identifiant unique
   char titre[50];       // Titre de l'article
   char genre[30];       // Genre (Action, Comédie, etc.)
   int disponible;      // 1 = disponible, 0 = non disponible
   int prix;
} Article;


 
 // Structure pour les utilisateurs

typedef struct {
   char status;
   int id_users;               // Identifiant unique
   char nom[50];
   char prenom[50];         // Nom de l'utilisateur
   char email[50];       // Email unique
} Utilisateur;

 

// Structure pour les locations
typedef struct {
    char status;
    int id_loc;               // Identifiant unique
    int id_users;   // Référence à l'utilisateur
    int id_article;       // Référence à l'article
    char date_debut[10];  // Date de début (format JJ/MM/AAAA)
    char date_retour[10]; // Date de retour prévu
    int prix;
} Location;


#endif
