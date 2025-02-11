#ifndef ARTICLE_H
#define ARTICLE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "database.h"

// Constantes

// Prototypes des fonctions
Article saisi_Article(void);
void inputToStorageC(void);
void add_article(Article *A);
Article* charger_article(int *taille);
void supprimeARTICLE(const char *titre);
int modif_Article(Article A[], const char* titre, int size);
void saveToStorageC(const char* titre);
void afficher_article(void);
void rechercherArticle(Article A[], int taille);

#endif // ARTICLE_H
