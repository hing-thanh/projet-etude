#include "database.h"
#include "fonctionAJOUTarticle.h"
#include "editDATABASE.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>



void inputToStorageC(void){
	Location newLocation  = saisi_Location ();
	add_location(&newLocation );
}

Location saisi_Location(void) {
    Location new_Location;
    Article article;
    Utilisateur user;
    Header header_article, header_user;

    char titre[50], prenom[50], nom[50];

    // Demande les données à l'utilisateur pour remplir la structure
    printf("Entrez la date de debut de la location  : ");
    scanf(" %[^]", new_Location.date_debut);
    printf("Entrez la date de retour de la location  : ");
    scanf(" %[^]", new_Location.date_retour);
    printf("Entrez le titre de l'article  : ");
    scanf(" %[^]", titre);
    printf("Entrez le prenom du client  : ");
    scanf(" %[^]", prenom);
    printf("Entrez le nom du client  : ");
    scanf(" %[^]", nom);

    // Ouvrir les fichiers articles et utilisateurs
    FILE *fichier_article = fopen("article.dat", "rb");
    FILE *fichier_user = fopen("user.dat", "rb");

    if (!fichier_article || !fichier_user) {
        printf("Erreur lors de l'ouverture des fichiers.\n");
        if (fichier_article) fclose(fichier_article);
        if (fichier_user) fclose(fichier_user);
        exit(EXIT_FAILURE);
    }

    // Lire les en-têtes des fichiers
    fread(&header_article, sizeof(Header), 1, fichier_article);
    fread(&header_user, sizeof(Header), 1, fichier_user);

    // Chercher le titre correspondant dans les articles
    for (int i = 0; i < header_article.nbRecords; i++) {
        fread(&article, sizeof(Article), 1, fichier_article);
        if (strcmp(article.titre, titre) == 0) {
            new_Location.id_article = article.id_article;
            break;
        }
    }

    // Chercher le prénom et le nom correspondant dans les utilisateurs
    for (int i = 0; i < header_user.nbRecords; i++) {
        fread(&user, sizeof(Utilisateur), 1, fichier_user);
        if (strcmp(user.prenom, prenom) == 0 && strcmp(user.nom, nom) == 0) {
            new_Location.id_users = user.id_users;
            break;
        }
    }

    // Fermer les fichiers
    fclose(fichier_article);
    fclose(fichier_user);

    // Générer un nouvel ID pour la location
    FILE *fichier_location = fopen("location.dat", "rb");
    if (fichier_location) {
        Header header_location;
        fread(&header_location, sizeof(Header), 1, fichier_location);
        new_Location.id_loc = header_location.nbRecords + 1;
        fclose(fichier_location);
    } else {
        puts("erreur dans l'id de la location");
    }

    return new_Location;
}




void add_location(Location  *L){
	char *filename="location.dat";
	FILE *fichier_location  = fopen(filename, "rb");
	Header header;
    	fread(&header, sizeof(Header), 1, fichier_location );
    	int taille = header.nbRecords;
    fclose(fichier_location ); // Fermez avant de réouvrir
	
	 fichier_location  = fopen(filename, "ab"); 				
	
	
	if (!fichier_location ) {												
        	perror("Erreur lors de l'ouverture du fichier Location ");
        	exit(EXIT_FAILURE);
    	}
    	
    	fwrite(L, sizeof(Location ), 1, fichier_location );
		//écriture dans le fichier
    	fclose(fichier_location );
    	update_header(filename, taille+1);
}




Location* charger_location(int *taille) {
/*
*	Fonction qui permet d'importer les locations depuis un fichier
*
*	Il faut passer en paramettre l'adresse memoire d'une variable
*	qui stockera la taille du tableau, utile pour la suite
*/

    FILE *fichier_location = fopen("location.dat", "rb");	
    if (!fichier_location) {							
        perror("Erreur lors de l'ouverture du fichier location");
        *taille = 0;
        return NULL;
    }

    Header header;
    fread(&header, sizeof(Header), 1,fichier_location);
    *taille = header.nbRecords;
    
	fseek(fichier_location, sizeof(header), SEEK_SET);	//nombre de block, "taille réelle" du tableau
    
    if (*taille == 0) {
        fclose(fichier_location);
        return NULL; 									
    }

    Location *L = malloc(*taille * sizeof(Location));	// Allocation dynamique du tableau
    if (!L) {
        perror("Erreur d'allocation mémoire");
        fclose(fichier_location);
        *taille = 0;
        return NULL;
    }

    fread(L, sizeof(Location), *taille, fichier_location);		//Lecture dans le fichier
    fclose(fichier_location);

    return L;
}



void supprimeLocation(const char *titre,int *taille,const char *prenom,const char *nom) {
    FILE *fichier_location = fopen("location.dat", "r+b");
    if (!fichier_location) {
        perror("Erreur lors de l'ouverture du fichier locations");
        return;
    }

    Header header;
    fread(&header, sizeof(Header), 1, fichier_location);

    Location L;
    Article *A;
    Utilisateur *U;
    int position = -1;

    
    rechercherId_par_Nom_Article(A,taille,titre);
    rechercherId_par_Nom_users(U,taille,prenom,nom);


    if (position == -1) {
        printf("Aucune location trouvé avec le titre %s.\n",titre);
    } else if (L.status == '*') {
        printf("La location avec pour titre %s est déjà supprimée.\n", titre);
    } else {
        L.status = '*';
        fseek(fichier_location, header.lengthHeader + position * header.lengthRecord, SEEK_SET);
        fwrite(&L, sizeof(Location), 1, fichier_location);
        printf("la locationavec pour titre %s a été supprimé avec succès.\n", titre);
    }

    fclose(fichier_location);
}



int modif_Article(Article A[], const char* titre, int size) {

    for (int i = 0; i < size; i++) {
        if (strcmp(A[i].titre, titre) == 0 && A[i].status !='*') {
            printf("Modification des informations de l'article avec pour tire %s:\n", titre);

            char new_value[30];
            int nouveau_prix;

            // Modifier le genre
            printf("genre actuel: %s, Nouveau genre: ", A[i].genre);
            do {
                if (fgets(new_value, 30, stdin)) {
                    new_value[strcspn(new_value, "\n")] = '\0'; // Supprimer le \n
                }
            } while (strlen(new_value) == 0);
            strncpy(A[i].genre, new_value, 30);

        // Modifier le prix
          printf("Prix actuel: %d, Nouveau prix: ", A[i].prix);
          fgets(new_value, 30, stdin);
          nouveau_prix = atoi(new_value); // Convertit la chaîne en entier
          A[i].prix = nouveau_prix;

            return 1; // Succès
        }
    }
    return 0; // Échec : titre non trouvée ou déjà supprimée
}




// Sauvegarder les modifications
void saveToStorageC(const char* titre) {
    int size;
    Article* A = charger_article(&size);
    if (modif_Article(A ,titre, size)) {
        FILE *fichier_article = fopen("article.dat", "r+b");
        if (!fichier_article) {
            perror("Erreur lors de l'ouverture du fichier article");
            return;
        }

        Header header;
        fread(&header, sizeof(Header), 1, fichier_article);

        int position = -1;

        // Recherche article par titre
        Article A;
        for (int i = 0; i < header.nbRecords; i++) {
            fread(&A, sizeof(Article), 1, fichier_article);
            if (strcmp(A.titre, titre) == 0) {
                position = i;
                break;
            }
        }

        if (position == -1) {
            printf("Aucun article trouvé avec ce titre %s.\n", titre);
            fclose(fichier_article);
            return;
        }

        fseek(fichier_article, header.lengthHeader + position * header.lengthRecord, SEEK_SET);
        fwrite(&A, sizeof(Article), 1, fichier_article);
        printf("article avec pour titre %s sauvegardée avec succès.\n", titre);

        fclose(fichier_article);
    } else {
        printf("Modification de l'article avec pour titre %s a échouée.\n", titre);
    }
}


void afficher_article() {
    FILE *f = fopen("location.dat", "rb");
    if (f == NULL) {
        perror("Erreur lors de l'ouverture du fichier location.dat");
        return;
    }

    fseek(f, sizeof(Header), SEEK_SET);
    Location L;
    printf("\n--- Liste des Location ---\n");
    while (fread(&L, sizeof(Location), 1, f)) {
        if (L.status != '*') { 
            printf("date de debut : %s, date de retour : %s ",L.date_debut,L.date_retour);
        }
    }
   fclose(f);
}



  int rechercherId_par_Nom_Article(Article A[], int taille, char titre) {
    char TITRETemp[MAX_LENGTH];
    int trouve = 0;

    for (int i = 0; i < taille; i++) {
        strcpy(TITRETemp, A[i].titre);
        printf("%c",A[i].status);

        if (strcmp(TITRETemp, titre) == 0 && A[i].status !='*') {
           
           A[i].disponible == 0 ? printf("disponible\n") : printf("indisponible\n");
            trouve = 1;
            return (A[i].id_article);
        }
    }

    if (!trouve) {
        printf("Erreur : aucun article trouvé.\n");
    }
}


// Recherche dans le tableau les locations 
void rechercherLocation(Location L[], int taille,Article A[],Utilisateur U[] ) {
    char dateRecherche[10];
    int trouve = 0;
    char nomRecherche[50];
     char prenomRecherche[50];
     char titreRecherche[50];

    printf("Entrez la date de debut de la location à rechercher : ");

    scanf("%s", dateRecherche);
    puts("donnez nom de la personne à chercher");
    scanf("%s",nomRecherche);
    puts("donnez prenom de la personne à chercher");                                       
    scanf("%s",prenomRecherche);
    puts("donnez titre article à chercher");
    scanf("%s",titreRecherche);
    int id_article_recherche=rechercherId_par_Nom_Article(A,taille,titreRecherche);

    for (int i = 0; i < taille; i++) {

        if (strcmp(L[i].date_debut, dateRecherche) == 0 && L[i].status !='*' && strcmp(A[i].titre, titreRecherche) == 0 &&  strcmp(U[i].nom, nomRecherche) == 0 &&  strcmp(U[i].prenom, prenomRecherche) == 0) {
            printf("\narticle trouvé :\n");
            printf("titre: %s\n", A[i].titre);
            printf("genre: %s\n", A[i].genre);
            printf("prix: %d\n", A[i].prix);
            printf("prenom: %d\n", U[i].prenom);
            printf("nom: %d\n", U[i].nom);
            printf("date debut: %d\n", L[i].date_debut);
            printf("date retour : %d\n", L[i].date_retour);
            A[i].disponible == 0 ? printf("disponible\n") : printf("indisponible\n");
            trouve = 1;
        }
    }

    if (!trouve) {
        printf("Erreur : aucun article trouvé.\n");
    }
}