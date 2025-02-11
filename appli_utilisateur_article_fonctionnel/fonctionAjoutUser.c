#include "database.h"
#include "fonctionAjoutUser.h"
#include "editDATABASE.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>





Utilisateur saisi_Utilisateur() {

    Utilisateur new_Utilisateur;

    // Demande les données à l'utilisateur pour remplir la structure


    printf("Entrez nom : ");
    scanf(" %[^\n]", new_Utilisateur.nom);
   

    printf("Entrez prenom : ");
    scanf(" %[^\n]", new_Utilisateur.prenom);   

    printf("Entrez mail : ");
    scanf(" %[^\n]", new_Utilisateur.email);   
    Header header;
  FILE *fichier_user = fopen("utilisateur.dat", "r+b");
    fread(&header, sizeof(Header), 1, fichier_user);
    new_Utilisateur.id_users=header.nbRecords;
    fclose(fichier_user);
    return new_Utilisateur;
}


void inputToStorageU(void){
	Utilisateur newUtilisateur = saisi_Utilisateur();
	add_Utilisateur(&newUtilisateur);
}

void add_Utilisateur(Utilisateur *U){
	char *filename="utilisateur.dat";
	FILE *fichier_utilisateur = fopen(filename, "rb");
	Header header;
    	fread(&header, sizeof(Header), 1, fichier_utilisateur);
    	int taille = header.nbRecords;
    fclose(fichier_utilisateur); // Fermez avant de réouvrir
	
	 fichier_utilisateur = fopen(filename, "ab"); 				
	
	
	if (!fichier_utilisateur) {												
        	perror("Erreur lors de l'ouverture du fichier utilisateur");
        	exit(EXIT_FAILURE);
    	}
    	
    	fwrite(U, sizeof(Utilisateur), 1, fichier_utilisateur);
		//écriture dans le fichier
    	fclose(fichier_utilisateur);
    	update_header(filename, taille+1);
}




Utilisateur* charger_utilisateur(int *taille) {
/*
*	Fonction qui permet d'importer les articles depuis un fichier
*
*	Il faut passer en paramettre l'adresse memoire d'une variable
*	qui stockera la taille du tableau, utile pour la suite
*/

    FILE *fichier_utilisateur = fopen("utilisateur.dat", "rb");	
    if (!fichier_utilisateur) {							
        perror("Erreur lors de l'ouverture du fichier utilisateur");
        *taille = 0;
        return NULL;
    }


    Header header;
    fread(&header, sizeof(Header), 1,fichier_utilisateur);
    *taille = header.nbRecords;
    
	fseek(fichier_utilisateur, sizeof(header), SEEK_SET);	//nombre de block, "taille réelle" du tableau
    
    if (*taille == 0) {
        fclose(fichier_utilisateur);
        return NULL; 									
    }

    Utilisateur *U = malloc(*taille * sizeof(Utilisateur));	// Allocation dynamique du tableau
    if (!U) {
        perror("Erreur d'allocation memoire");
        fclose(fichier_utilisateur);
        *taille = 0;
        return NULL;
    }

    fread(U, sizeof(Utilisateur), *taille, fichier_utilisateur);		//Lecture dans le fichier
    fclose(fichier_utilisateur);

    return U;
}



void supprimeUtilisateur(const char *prenom,const char *nom) {
    FILE *fichier_utilisateur = fopen("utilisateur.dat", "r+b");
    if (!fichier_utilisateur) {
        perror("Erreur lors de l'ouverture du fichier utilisateur");
        return;
    }

    Header header;
    fread(&header, sizeof(Header), 1, fichier_utilisateur);

    Utilisateur U;
    int position = -1;

    // Rechercher articles par titre
    for (int i = 0; i < header.nbRecords; i++) {
        fread(&U, sizeof(Utilisateur), 1, fichier_utilisateur);
        if (strcmp(U.nom, nom) == 0 && strcmp(U.prenom, prenom) == 0) {
            position = i;
            break;
        }
    }

    if (position == -1) {
        printf("Aucun utilisateur trouve enregistre sous %s %s.\n",nom,prenom);
    } else if (U.status == '*') {
        printf("l'utilisateur %s %s est deja supprime .\n", nom,prenom);
    } else {
        U.status = '*';
        fseek(fichier_utilisateur, header.lengthHeader + position * header.lengthRecord, SEEK_SET);
        fwrite(&U, sizeof(Utilisateur), 1, fichier_utilisateur);
        printf("l'utilisateur %s %s a ete supprime\n", nom,prenom);
    }

    fclose(fichier_utilisateur);
}



int modif_Utilisateur(Utilisateur U[], const char* nom,const char* prenom, int size) {

    for (int i = 0; i < size; i++) {
        if (strcmp(U[i].nom, nom) == 0 && U[i].status !='*' && strcmp(U[i].prenom, prenom) == 0) {
            printf("Modification des informations de l'utilisateur avec pour infos %s %s:\n", nom,prenom);

            char new_value[50];
            

            // Modifier le mail
            printf("mail actuel: %s, Nouveau mail: ", U[i].email);
            do {
                if (fgets(new_value, 50, stdin)) {
                    new_value[strcspn(new_value, "\n")] = '\0'; // Supprimer le \n
                }
            } while (strlen(new_value) == 0);
            strncpy(U[i].email, new_value, 30);
            return 1;
       
        }
    }
    return 0; // Échec : titre non trouvée ou déjà supprimée
}




void saveToStorageU(const char* nom, const char* prenom) {
    int taille;
    Utilisateur* utilisateurs = charger_utilisateur(&taille); // Charger les utilisateurs depuis le fichier

    if (!utilisateurs) {
        printf("Erreur lors du chargement des utilisateurs.\n");
        return;
    }

    // Appliquer les modifications à l'utilisateur
    if (modif_Utilisateur(utilisateurs, nom, prenom, taille)) {
        printf("Modification reussie pour l'utilisateur : %s %s\n", nom, prenom);

        FILE *fichier_utilisateur = fopen("utilisateur.dat", "r+b");
        if (!fichier_utilisateur) {
            perror("Erreur lors de l'ouverture du fichier utilisateur.dat");
            free(utilisateurs);
            return;
        }

        // Sauvegarder tous les utilisateurs dans le fichier
        fseek(fichier_utilisateur, sizeof(Header), SEEK_SET);
        if (fwrite(utilisateurs, sizeof(Utilisateur), taille, fichier_utilisateur) != (size_t)taille) {
            printf("Erreur lors de la sauvegarde des utilisateurs dans le fichier.\n");
        } else {
            printf("Les modifications ont ete sauvegardees avec succès.\n");
        }

        fclose(fichier_utilisateur);
    } else {
        printf("Modification echouee pour l'utilisateur : %s %s\n", nom, prenom);
    }

    free(utilisateurs); // Libérer la mémoire allouée
}



void afficher_utilisateur() {
    FILE *f = fopen("utilisateur.dat", "rb");
    if (f == NULL) {
        perror("Erreur lors de l'ouverture du fichier utilisateur.dat");
        return;
    }

    fseek(f, sizeof(Header), SEEK_SET);
    Utilisateur U;
    printf("\n--- Liste des utilisateur ---\n");
    while (fread(&U, sizeof(Utilisateur), 1, f)) {
        if (U.status != '*') { 
            printf("Id:%d Nom: %s, Prenom: %s, Email: %s\n",U.id_users, U.nom, U.prenom, U.email);
        }
    }

    fclose(f);
}

// Recherche dans le tableau des articles par titre 
void rechercherUtilisateur(Utilisateur U[], int taille) {
    char NOMrecherche[50];
    char NOMtemp[50];
    char PRENOMrecherche[50];
    char PRENOMtemp[50];
    int trouve = 0;

    printf("Entrez le nom de la personne à rechercher : ");

    scanf("%s", NOMrecherche);
    printf("Entrez le prenom de la personne à rechercher : ");

    scanf("%s", PRENOMrecherche);

    for (int i = 0; i < taille; i++) {
        strcpy(NOMtemp, U[i].nom);
        printf("%c",U[i].status);
        strcpy(PRENOMtemp, U[i].prenom);
        printf("%c",U[i].status);

        if (strcmp(NOMtemp, NOMrecherche) == 0 && strcmp(PRENOMtemp, PRENOMrecherche) == 0&& U[i].status !='*') {
            printf("\n utilisateur trouve :\n");
            printf("nom: %s\n", U[i].nom);
            printf("prenom: %s\n", U[i].prenom);
            printf("email: %s\n", U[i].email);
             trouve = 1;
        }
    }

    if (!trouve) {
        printf("Erreur : aucun utilisateur trouve.\n");
    }
}
