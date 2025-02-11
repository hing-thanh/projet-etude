#include <stdio.h>
#include <stdlib.h>
#include "fonctionAjoutUser.h"
#include "fonctionAJOUTarticle.h"
#include "database.h"
#include "editDATABASE.h"

void menuUtilisateur();
void menuArticle();

//pour tester gcc -o main menuGeneral.c fonctionAjoutUser.c fonctionAJOUTarticle.c editDATABASE.c 

int main() {
    int choix;

    while (1) {
        printf("\n--- Menu Principal ---\n");
        printf("1. Gérer les utilisateurs\n");
        printf("2. Gérer les articles\n");
        printf("3. initialiser les fichiers\n");
        printf("4. Quitter\n");
        printf("Votre choix : ");
        scanf("%d", &choix);

        switch (choix) {
            case 1:
                menuUtilisateur();
                break;
            case 2:
                menuArticle();
                break;
            case 3:
                printf("Initialisation des fichiers...\n");
                initialize_header();
                break;
            case 4:
                printf("Au revoir !\n");
                exit(0);
            default:
                printf("Choix invalide. Veuillez réessayer.\n");
        }
    }

    return 0;
}

void menuUtilisateur() {
    int choix;

    while (1) {
        printf("\n===== Menu Principal Utilisateur =====\n");
        printf("1. ajouter un utilisateur\n");
        printf("2. Modifier un utilisateur\n");
        printf("3. Supprimer un utilisateur\n");
        printf("4. Afficher tous les utilisateurs\n");
        printf("5. Rechercher un utilisateur\n");
        printf("6. Retour au menu principal\n");
        printf("Votre choix : ");
        scanf("%d", &choix);

        switch (choix) {
            case 1:
               inputToStorageU();
                break;
            case 2: {
                int taille;
                Utilisateur* utilisateurs = charger_utilisateur(&taille);
                char nom[50], prenom[50];
                printf("Entrez le nom : ");
                scanf("%s", nom);
                printf("Entrez le prénom : ");
                scanf("%s", prenom);
                saveToStorageU(nom, prenom);
                break;
            }
            case 3: {
                char nom[50], prenom[50];
                printf("Entrez le nom : ");
                scanf("%s", nom);
                printf("Entrez le prénom : ");
                scanf("%s", prenom);
                supprimeUtilisateur(prenom, nom);
                break;
            }
            case 4:
                afficher_utilisateur();
                break;
            case 5: {
                int taille;
                Utilisateur* utilisateurs = charger_utilisateur(&taille);
                if (utilisateurs) {
                    rechercherUtilisateur(utilisateurs, taille);
                    free(utilisateurs);
                }
                break;
            }
            case 6:
                return;
            default:
                printf("Choix invalide. Veuillez réessayer.\n");
        }
    }
}

void menuArticle() {
    int choix;

    while (1) {
        printf("\n===== Menu Principal Article =====\n");
        printf("1. Ajouter un article\n");
        printf("2. Modifier un article\n");
        printf("3. Supprimer un article\n");
        printf("4. Afficher tous les articles\n");
        printf("5. Rechercher un article\n");
        printf("6. Retour au menu principal\n");
        printf("Votre choix : ");
        scanf("%d", &choix);

        switch (choix) {
            case 1:
                inputToStorageA();
                break;
            case 2: {
                char titre[50];
                printf("Entrez le titre de l'article à modifier : ");
                getchar(); // Pour consommer le \n restant
                fgets(titre, 50, stdin);
                titre[strcspn(titre, "\n")] = '\0'; // Supprimer le \n
                saveToStorageA(titre);
                break;
            }
            case 3: {
                char titre[50];
                printf("Entrez le titre de l'article à supprimer : ");
                getchar(); // Pour consommer le \n restant
                fgets(titre, 50, stdin);
                titre[strcspn(titre, "\n")] = '\0'; // Supprimer le \n
                supprimeARTICLE(titre);
                break;
            }
            case 4:
                afficher_article();
                break;
            case 5: {
                int taille;
                Article* articles = charger_article(&taille);
                if (articles) {
                    rechercherArticle(articles, taille); // Recherche
                    free(articles);
                } else {
                    printf("Aucun article à rechercher.\n");
                }
                break;
            }
            case 6:
                return;
            default:
                printf("Choix invalide. Veuillez réessayer.\n");
        }
    }
}
