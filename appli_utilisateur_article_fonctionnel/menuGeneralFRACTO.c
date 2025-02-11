#include <stdio.h>
#include <stdlib.h>
#include "fonctionAjoutUser.h"
#include "fonctionAJOUTarticle.h"
#include "database.h"
#include "editDATABASE.h"

// Déclaration des fonctions
void afficherMenuPrincipal();
void traiterChoixPrincipal(int choix);
void afficherMenuUtilisateur();
void traiterChoixUtilisateur(int choix);
void afficherMenuArticle();
void traiterChoixArticle(int choix);
void modifierUtilisateur();
void supprimerUtilisateur();
void rechercherUtilisateurs();
void modifierArticle();
void supprimerArticle();
void rechercherArticles();

int main() {
    int choix;

    while (1) {
        afficherMenuPrincipal();
        scanf("%d", &choix);
        traiterChoixPrincipal(choix);
    }

    return 0;
}

// Menu principal
void afficherMenuPrincipal() {
    printf("\n--- Menu Principal ---\n");
    printf("1. Gérer les utilisateurs\n");
    printf("2. Gérer les articles\n");
    printf("3. Initialiser les fichiers\n");
    printf("4. Quitter\n");
    printf("Votre choix : ");
}

void traiterChoixPrincipal(int choix) {
    switch (choix) {
        case 1:
            afficherMenuUtilisateur();
            break;
        case 2:
            afficherMenuArticle();
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

// Menu utilisateur
void afficherMenuUtilisateur() {
    int choix;
    while (1) {
        printf("\n===== Menu Principal Utilisateur =====\n");
        printf("1. Ajouter un utilisateur\n");
        printf("2. Modifier un utilisateur\n");
        printf("3. Supprimer un utilisateur\n");
        printf("4. Afficher tous les utilisateurs\n");
        printf("5. Rechercher un utilisateur\n");
        printf("6. Retour au menu principal\n");
        printf("Votre choix : ");
        scanf("%d", &choix);

        if (choix == 6) return;
        traiterChoixUtilisateur(choix);
    }
}

void traiterChoixUtilisateur(int choix) {
    switch (choix) {
        case 1:
            inputToStorageU();
            break;
        case 2:
            modifierUtilisateur();
            break;
        case 3:
            supprimerUtilisateur();
            break;
        case 4:
            afficher_utilisateur();
            break;
        case 5:
            rechercherUtilisateurs();
            break;
        default:
            printf("Choix invalide. Veuillez réessayer.\n");
    }
}

void modifierUtilisateur() {
    char nom[50], prenom[50];
    printf("Entrez le nom : ");
    scanf("%s", nom);
    printf("Entrez le prénom : ");
    scanf("%s", prenom);
    saveToStorageU(nom, prenom);
}

void supprimerUtilisateur() {
    char nom[50], prenom[50];
    printf("Entrez le nom : ");
    scanf("%s", nom);
    printf("Entrez le prénom : ");
    scanf("%s", prenom);
    supprimeUtilisateur(prenom, nom);
}

void rechercherUtilisateurs() {
    int taille;
    Utilisateur* utilisateurs = charger_utilisateur(&taille);
    if (utilisateurs) {
        rechercherUtilisateur(utilisateurs, taille);
        free(utilisateurs);
    } else {
        printf("Aucun utilisateur à rechercher.\n");
    }
}

// Menu article
void afficherMenuArticle() {
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

        if (choix == 6) return;
        traiterChoixArticle(choix);
    }
}

void traiterChoixArticle(int choix) {
    switch (choix) {
        case 1:
            inputToStorageA();
            break;
        case 2:
            modifierArticle();
            break;
        case 3:
            supprimerArticle();
            break;
        case 4:
            afficher_article();
            break;
        case 5:
            rechercherArticles();
            break;
        default:
            printf("Choix invalide. Veuillez réessayer.\n");
    }
}

void modifierArticle() {
    char titre[50];
    printf("Entrez le titre de l'article à modifier : ");
    getchar(); // Consommer le \n restant
    fgets(titre, 50, stdin);
    titre[strcspn(titre, "\n")] = '\0'; // Supprimer le \n
    saveToStorageA(titre);
}

void supprimerArticle() {
    char titre[50];
    printf("Entrez le titre de l'article à supprimer : ");
    getchar(); // Consommer le \n restant
    fgets(titre, 50, stdin);
    titre[strcspn(titre, "\n")] = '\0'; // Supprimer le \n
    supprimeARTICLE(titre);
}

void rechercherArticles() {
    int taille;
    Article* articles = charger_article(&taille);
    if (articles) {
        rechercherArticle(articles, taille);
        free(articles);
    } else {
        printf("Aucun article à rechercher.\n");
    }
}
