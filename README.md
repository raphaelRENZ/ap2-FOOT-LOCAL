# Maison des Ligues - Foot Local

Plateforme Web pour suivre les résultats de football local et gérer la logistique de la ligue (terrains, vestiaires, matériel).

## Stack Technique

- **Framework** : Symfony 7.4.3
- **Langage** : PHP 8.2.30
- **Moteur de template** : Twig
- **ORM** : Doctrine

## Structure du projet

### Contrôleurs créés

- **MainController** (`/`) - Page d'accueil avec derniers scores et actualités
- **TournamentController** :
  - `/tournois` - Liste globale des tournois
  - `/tournois/{id}` - Détails d'un tournoi avec matchs à venir et anciens matchs
- **ClubController** :
  - `/clubs` - Liste des clubs par ville
  - `/clubs/{id}` - Fiche d'information du club et liste des joueurs
- **ContactController** (`/contact`) - Formulaire de contact (nom, email, message) et coordonnées
- **AccountController** (Espace membre) :
  - `/compte` - Informations personnelles et tableau de bord
  - `/compte/favoris` - Gestion des clubs préférés et activation des notifications
- **AdminController** (`/admin`) - Tableau de bord administrateur sécurisé pour la gestion logistique (terrains, vestiaires, matériel)

### Routes (noms en français)

Toutes les routes utilisent le préfixe `app_` suivi du nom en français :
- `app_home` - Page d'accueil
- `app_tournois` - Liste des tournois
- `app_tournois_detail` - Détail d'un tournoi
- `app_clubs` - Liste des clubs
- `app_clubs_detail` - Détail d'un club
- `app_contact` - Page de contact
- `app_compte` - Espace membre
- `app_compte_favoris` - Clubs favoris
- `app_admin_dashboard` - Tableau de bord admin

## Installation

### Prérequis

- PHP 8.2+ avec les extensions : `pdo_mysql`, `intl`, `openssl`, `zip`
- Composer 2.x

### Commandes d'installation

```bash
# Installer les dépendances
composer install

# Créer la base de données (à configurer dans .env)
php bin/console doctrine:database:create

# Exécuter les migrations (une fois créées)
php bin/console doctrine:migrations:migrate
```

## Lancement du serveur de développement

### Méthode 1 : Serveur PHP intégré
```bash
php -S localhost:8000 -t public
```

### Méthode 2 : Symfony CLI (si installé)
```bash
symfony serve
```

L'application sera accessible sur `http://localhost:8000`

## Tâches VS Code

Une tâche "Symfony Server" est disponible dans VS Code pour lancer le serveur en arrière-plan.

## Prochaines étapes

1. **Configuration de la base de données** : Mettre à jour `DATABASE_URL` dans `.env`
2. **Création des entités Doctrine** :
   - Tournoi
   - Club
   - Joueur
   - Match
   - Utilisateur
   - Terrain
   - Vestiaire
   - Matériel
3. **Implémentation des formulaires** :
   - Formulaire de contact avec validation
   - Formulaire de gestion des favoris
   - Formulaires admin pour la logistique
4. **Sécurité** :
   - Configuration de l'authentification utilisateur
   - Protection de la zone admin avec `IsGranted('ROLE_ADMIN')`
5. **Notifications** : Système de notifications pour les clubs favoris
6. **Tests** : Écrire les tests unitaires et fonctionnels

## Commandes Symfony utiles

```bash
# Lister toutes les routes
php bin/console debug:router

# Créer une nouvelle entité
php bin/console make:entity

# Créer un nouveau contrôleur
php bin/console make:controller

# Créer un formulaire
php bin/console make:form

# Vider le cache
php bin/console cache:clear

# Informations sur l'application
php bin/console about
```

## Licence

Projet réalisé pour la Maison des Ligues - Foot Local.
