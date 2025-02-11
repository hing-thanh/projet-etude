#ifndef UTILISATEUR_H
#define UTILISATEUR_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "database.h"

// Constantes

// Prototypes des fonctions
void inputToStorageU(void);
void add_Utilisateur(Utilisateur *U);
Utilisateur* charger_utilisateur(int *taille);
void supprimeUtilisateur(const char *prenom,const char *nom);
int modif_Utilisateur(Utilisateur U[], const char* nom,const char* prenom, int size);
void saveToStorageU(const char* nom,const char* prenom);
void afficher_utilisateur();
void rechercherUtilisateur(Utilisateur U[], int taille);
#endif // A_H
