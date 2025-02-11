#include "database.h"
#include "editDATABASE.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>

/*------------------------------------------------Entête-----------------------------------------------*/

void initialize_header(void) {
    // Structure de l'en-tête
    Header header;
    time_t t = time(NULL);
    struct tm *tm = localtime(&t);

    // Remplir l'en-tête avec des valeurs par défaut
    header.lastUpdateYear = tm->tm_year + 1900;
    header.lastUpdateMonth = tm->tm_mon + 1;
    header.lastUpdateDay = tm->tm_mday;
    header.nbRecords = 0;
    header.lengthHeader = sizeof(Header);

    char *files[] = {"article.dat", "utilisateur.dat", "location.dat"};
    size_t record_sizes[] = {sizeof(Article), sizeof(Utilisateur), sizeof(Location)};

    for (int i = 0; i < 3; ++i) {
        FILE *file = fopen(files[i], "rb");
        if (file) {
            // Le fichier existe, pas besoin de le recréer
            fclose(file);
            continue;
        }

        // Créer le fichier et initialiser l'en-tête
        file = fopen(files[i], "wb");
        if (!file) {
            perror("Erreur lors de la création du fichier");
            continue;
        }

        header.lengthRecord = record_sizes[i];
        fwrite(&header, sizeof(Header), 1, file);
        fclose(file);
    }
}



void update_header(char *filename, int nbRecords){
    
    FILE *file = fopen(filename, "r+b");

    if (!file) {
        perror("Erreur d'ouverture du fichier");
        return;
    }

    // Lire l'en-tête
    Header header;
    fread(&header, sizeof(Header), 1, file);
    
    // Mettre à jour l'en-tête
    time_t t = time(NULL);
    struct tm *tm = localtime(&t);

    header.lastUpdateYear = tm->tm_year + 1900; // Année actuelle
    header.lastUpdateMonth = tm->tm_mon + 1;    // Mois actuel
    header.lastUpdateDay = tm->tm_mday;         // Jour actuel
    header.nbRecords = nbRecords;               // Mettre à jour le nombre d'enregistrements

    // Revenir au début du fichier pour écrire l'en-tête
    fseek(file, 0, SEEK_SET);

    // Réécrire l'en-tête mis à jour
    fwrite(&header, sizeof(Header), 1, file);

    fclose(file);
}


