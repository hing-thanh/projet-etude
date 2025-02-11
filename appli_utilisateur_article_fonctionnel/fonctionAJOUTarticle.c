#include "database.h"
#include "fonctionAJOUTarticle.h"
#include "editDATABASE.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>



void inputToStorageA(void){
	Article newArticle = saisi_Article();
	add_article(&newArticle);
}

Article saisi_Article(void) {
    char *filename="article.dat";
    Article new_Article;

    // Demande les données à l'utilisateur pour remplir la structure


    printf("Entrez le titre de l'article : ");
    scanf(" %[^\n]", new_Article.titre);
   

    printf("Entrez le genre de l'article : ");
    scanf(" %[^\n]", new_Article.genre);   

    printf("Entrez le prix de l'article : ");
    scanf(" %d", &new_Article.prix);

    new_Article.disponible=0;

    Header header;
    FILE *fichier_article = fopen(filename, "rb");

    	fread(&header, sizeof(Header), 1, fichier_article);
        new_Article.id_article=header.nbRecords;
        fclose(fichier_article);
    return new_Article;
}




void add_article(Article *A){
	char *filename="article.dat";
	FILE *fichier_article = fopen(filename, "rb");
	Header header;
    	fread(&header, sizeof(Header), 1, fichier_article);
    	int taille = header.nbRecords;
    fclose(fichier_article); // Fermez avant de réouvrir
	
	 fichier_article = fopen(filename, "ab"); 				
	
	
	if (!fichier_article) {												
        	perror("Erreur lors de l'ouverture du fichier article");
        	exit(EXIT_FAILURE);
    	}
    	
    	fwrite(A, sizeof(Article), 1, fichier_article);
		//écriture dans le fichier
    	fclose(fichier_article);
    	update_header(filename, taille+1);
}




Article* charger_article(int *taille) {
/*
*	Fonction qui permet d'importer les articles depuis un fichier
*
*	Il faut passer en paramettre l'adresse memoire d'une variable
*	qui stockera la taille du tableau, utile pour la suite
*/

    FILE *fichier_article = fopen("article.dat", "rb");	
    if (!fichier_article) {							
        perror("Erreur lors de l'ouverture du fichier articles");
        *taille = 0;
        return NULL;
    }


    Header header;
    fread(&header, sizeof(Header), 1,fichier_article);
    *taille = header.nbRecords;
    
	fseek(fichier_article, sizeof(header), SEEK_SET);	//nombre de block, "taille réelle" du tableau
    
    if (*taille == 0) {
        fclose(fichier_article);
        return NULL; 									
    }

    Article *A = malloc(*taille * sizeof(Article));	// Allocation dynamique du tableau
    if (!A) {
        perror("Erreur d'allocation memoire");
        fclose(fichier_article);
        *taille = 0;
        return NULL;
    }

    fread(A, sizeof(Article), *taille, fichier_article);		//Lecture dans le fichier
    fclose(fichier_article);

    return A;
}



void supprimeARTICLE(const char *titre) {
    FILE *fichier_article = fopen("article.dat", "r+b");
    if (!fichier_article) {
        perror("Erreur lors de l'ouverture du fichier articles");
        return;
    }

    Header header;
    fread(&header, sizeof(Header), 1, fichier_article);

    Article A;
    int position = -1;

    // Rechercher articles par titre
    for (int i = 0; i < header.nbRecords; i++) {
        fread(&A, sizeof(Article), 1, fichier_article);
        if (strcmp(A.titre, titre) == 0) {
            position = i;
            break;
        }
    }

    if (position == -1) {
        printf("Aucune article trouve avec le titre %s.\n",titre);
    } else if (A.status == '*') {
        printf("L'article avec pour titre %s est dejà supprimee.\n", titre);
    } else {
        A.status = '*';
        fseek(fichier_article, header.lengthHeader + position * header.lengthRecord, SEEK_SET);
        fwrite(&A, sizeof(Article), 1, fichier_article);
        printf("l'article avec pour titre %s a ete supprime avec succès.\n", titre);
    }

    fclose(fichier_article);
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




// fonction qui va utiliser modification et sauvegarder les changements
void saveToStorageA(const char* titre) {
   int taille;
   Article *articles = charger_article(&taille);
   if (!articles) {
    printf("Erreur lors du chargement des articles.\n");
    return;
   }

   if (taille == 0) {
    printf("Aucun article disponible à modifier.\n");
    free(articles);
    return;
    }

    if (modif_Article(articles, titre, taille)) {
    printf("Modification reussie pour l'article : %s\n", titre);

    FILE *fichier_article = fopen("article.dat", "r+b");
    if (!fichier_article) {
        perror("Erreur lors de l'ouverture du fichier article.dat");
        free(articles);
        return;
    }

    Header header;
    if (fread(&header, sizeof(Header), 1, fichier_article) != 1) {
        printf("Erreur lors de la lecture de l'en-tête.\n");
        fclose(fichier_article);
        free(articles);
        return;
    }

    fseek(fichier_article, sizeof(Header), SEEK_SET);
    if (fwrite(articles, sizeof(Article), taille, fichier_article) != taille) {
        printf("Erreur lors de la sauvegarde des articles.\n");
    } else {
        printf("Les modifications ont ete sauvegardees avec succès.\n");
    }
    fclose(fichier_article);
    }

    free(articles);
}


void afficher_article() {
    FILE *f = fopen("article.dat", "rb");
    if (f == NULL) {
        perror("Erreur lors de l'ouverture du fichier article.dat");
        return;
    }

    fseek(f, sizeof(Header), SEEK_SET);
    Article A;
    printf("\n--- Liste des article ---\n");
    while (fread(&A, sizeof(Article), 1, f)) {
        if (A.status != '*') { 
            printf("ID: %d ,titre: %s, genre: %s, prix: %d\n",A.id_article,A.titre,A.genre,A.prix);
        }
    }

    fclose(f);
}

// Recherche dans le tableau des articles par titre 
void rechercherArticle(Article A[], int taille) {
    char TITRERecherche[MAX_LENGTH];
    char TITRETemp[MAX_LENGTH];
    int trouve = 0;

    printf("Entrez le titre de l'article à rechercher : ");

    scanf("%s", TITRERecherche);

    for (int i = 0; i < taille; i++) {
        strcpy(TITRETemp, A[i].titre);
        printf("%c",A[i].status);

        if (strcmp(TITRETemp, TITRERecherche) == 0 && A[i].status !='*') {
            printf("\narticle trouve :\n");
            printf("titre: %s\n", A[i].titre);
            printf("genre: %s\n", A[i].genre);
            printf("prix: %d\n", A[i].prix);
           A[i].disponible == 0 ? printf("disponible\n") : printf("indisponible\n");
            trouve = 1;
        }
    }

    if (!trouve) {
        printf("Erreur : aucun article trouve.\n");
    }
}