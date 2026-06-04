# 📋 ANALYSE DE COHÉRENCE - Cahier des Charges vs Code Implémenté
**Date**: 26 février 2026 | **Projet**: Foot Local - M2L

---

## 🟢 CE QUI EST BIEN ALIGNÉ

### 1. **Stack Technique** ✅
- ✅ Symfony 7 (PHP 8.2)
- ✅ Doctrine ORM
- ✅ MySQL (migrations créées)
- ✅ Twig (moteur de template)
- ✅ Bootstrap (mentionné dans les dépendances)

### 2. **Entités Sportives de Base** ✅
- ✅ User (avec authentification, rôles, favoris)
- ✅ Club (avec joueurs, fans)
- ✅ FootballMatch (avec status: scheduled, live, finished, postponed, cancelled)
- ✅ Tournament (avec saison, dates)
- ✅ Player (avec détails complètement remplis)

### 3. **Fonctionnalités Sportives Implémentées** ✅
- ✅ Tableau des scores (MainController)
- ✅ Annuaire des clubs avec recherche (ClubController)
- ✅ Fiches clubs avec effectifs joueurs (ClubController/detail)
- ✅ Système de favoris pour utilisateurs connectés (AccountController/favoris)
- ✅ Dashboard utilisateur (AccountController)
- ✅ Gestion des tournois (TournamentController)

### 4. **Sécurité de Base** ✅
- ✅ Authentification Symfony Security
- ✅ Hachage des mots de passe (Bcrypt)
- ✅ Protection CSRF (formulaires)
- ✅ Gestion des rôles (ROLE_USER, ROLE_ADMIN)
- ✅ Routes protégées avec @IsGranted

---

## 🔴 ÉCARTS CRITIQUES ET MANQUES MAJEURS

### 1. **❌ ENTITÉS LOGISTIQUES MANQUANTES** (Cœur du M2L)
**Cahier des charges dit**: "Gestion Logistique (Cœur M2L) : Digitaliser la réservation des terrains, l'affectation des vestiaires et le suivi du matériel sportif"

**Réalité**: Aucune entité logistique implémentée

**Manque**:
- ❌ Entité `Field/Terrain` (avec localisation, capacité, disponibilité)
- ❌ Entité `DressingRoom/Vestiaire` (avec nombre, capacité)
- ❌ Entité `Equipment/Matériel` (ballons, chasubles, etc. avec stock/inventaire)
- ❌ Pas de migration pour ces entités
- ❌ Pas de formulaires de réservation
- ❌ Pas de planning de terrains

**Action requise**: Créer immédiatement les entités logistiques et les migrations.

---

### 2. **❌ SYSTÈME DE VALIDATION DES MATCHS INCOMPLET**
**Cahier des charges dit**: "Un match a 2 validations (une par équipe) + validation admin"

**Réalité**: 
- ❌ Pas d'entité `MatchValidation` 
- ❌ Pas de rôle "gestionnaire de club"
- ❌ Pas de workflow: création → validation équipe 1 → validation équipe 2 → validation admin
- ❌ Pas de distinction entre utilisateurs simples, gestionnaires de club et admins

**Manque**:
- Entité `MatchValidation` ou champs de validation dans `FootballMatch`
- Rôle `ROLE_CLUB_MANAGER` ou `ROLE_GESTIONNAIRE_CLUB`
- Contrôleur pour création/validation des matchs
- État du match à gérer: `draft` → `validated_team1` → `validated_team2` → `validated_admin` → `published`

**Action requise**: Revoir l'architecture des rôles et ajouter le workflow de validation.

---

### 3. **❌ RÔLES ET TYPES D'UTILISATEURS MAL DÉFINIS**
**Cahier des charges dit**:
- Visiteur (consultation)
- Membre connecté (favoris, profil, alertes)
- Gestionnaire de club (créer matchs, valider)
- Administrateur (gestion logistique + résultats sportifs)

**Réalité**:
- ❌ Seulement `ROLE_USER` et `ROLE_ADMIN` implémentés
- ❌ Pas de distinction gestionnaire de club
- ❌ Pas d'affiliation d'un user à un club (club_manager_of)

**Actions requises**:
1. Ajouter `ROLE_CLUB_MANAGER` ou `ROLE_GESTIONNAIRE_CLUB`
2. Ajouter relation `User` → `Club` (manager_of)
3. Implémenter les droits spécifiques par rôle

---

### 4. **❌ FONCTIONNALITÉS DE COMMENTAIRES MANQUANTES**
**Cahier des charges dit (User Stories)**: "En tant qu'utilisateur connecté, rajouté des commentaires sur chaque match publié"

**Réalité**:
- ❌ Pas d'entité `Comment` ou `MatchComment`
- ❌ Pas de migration pour les commentaires
- ❌ Pas de formulaire/contrôleur pour les commentaires
- ❌ Pas de page de commentaires sur les détails des matchs

**Actions requises**:
1. Créer entité `Comment` avec relations User ↔ Match
2. Créer migration
3. Ajouter route pour créer/afficher commentaires
4. Ajouter template avec section commentaires

---

### 5. **❌ FONCTIONNALITÉS DE COMPTE UTILISATEUR INCOMPLÈTES**
**Cahier des charges dit (User Stories)**:
- "accéder à mon compte personnel, modifier mes informations personnelles et supprimer mon compte"

**Réalité**:
- ✅ Lecture du compte (`/compte`)
- ❌ Pas de route `POST /compte/edit` pour modifier le profil
- ❌ Pas de confirmation email pour modifications
- ❌ Pas de fonction "supprimer mon compte"
- ❌ Pas de formulaire de modification

**Actions requises**:
1. Créer route `PATCH /compte/edit`
2. Créer formulaire `UserProfileFormType`
3. Créer route `DELETE /compte/delete` avec confirmation
4. Ajouter templates pour édition

---

### 6. **❌ SYSTÈME D'ALERTES/NOTIFICATIONS MANQUANT**
**Cahier des charges dit**: 
- "Notifications (email/mobile) pour suivre les résultats d'un club spécifique"
- "activation des notifications" dans AccountController

**Réalité**:
- ❌ Pas de table pour stocker les alertes/notifications
- ❌ Pas de système Mailer/Email configuré
- ❌ Pas d'événements Doctrine pour créer des notifications
- ❌ Pas de contrôleur pour les préférences de notifications
- ❌ AccountController a un lien vers favoris mais pas vers notifications

**Actions requises**:
1. Configurer Symfony Mailer
2. Créer entité `Notification` (optionnel, ou utiliser Messenger)
3. Créer événements pour déclencher emails
4. Ajouter page de préférences de notifications

---

### 7. **❌ CONTACT & DEMANDE PAR EMAIL**
**Cahier des charges dit**: "envoyer un email (pour réservation ou autre demande)"

**Réalité**:
- ✅ ContactController existe avec formulaire de contact
- ❌ Pas de traitement d'emails (pas d'intégration Mailer)
- ❌ Pas de stockage des messages de contact en BD
- ❌ Pas de système de tickets/demandes

**Actions requises**:
1. Créer entité `ContactMessage` pour tracker en BD
2. Implémenter envoi d'email via Mailer
3. Créer page admin pour voir les demandes
4. Ajouter confirmation utilisateur

---

### 8. **❌ API REST ABSENTE**
**Cahier des charges dit**: "API REST générée par le projet Symfony pour synchroniser les données en temps réel"

**Réalité**:
- ❌ Aucun endpoint API implémenté
- ❌ Pas d'API Platform installé
- ❌ Les contrôleurs retournent des vues Twig, pas du JSON

**Actions requises** (pour mobile/PWA):
1. Installer API Platform OU créer des routes API/JSON
2. Créer endpoints pour scores, clubs, matchs, etc.
3. Ajouter pagination et filtres
4. Gérer CORS pour mobile

---

### 9. **❌ APPLICATION MOBILE / PWA ABSENTE**
**Cahier des charges dit**: "Développement d'une application (ou PWA)"

**Réalité**:
- ❌ Aucune PWA
- ❌ Pas de manifest.json
- ❌ Pas de service worker
- ❌ Aucune application mobile mentionnée

**Note**: C'est peut-être une phase ultérieure, mais à citer dans les limitations.

---

### 10. **⚠️ ÉLÉMENT MANQUANT: CHARTE GRAPHIQUE**
**Cahier des charges définit**:
- Couleur principale: Vert "Terrain" (#206448)
- Vert clair: Matchs terminés
- Rouge/Rose: Matchs en cours (live)
- Gris (#D9D9D9): Fond de page
- Blanc (#F9F3E8): Fond de lisibilité
- Logo avec blason et "Foot Local"

**Réalité**:
- ❓ Besoin de vérifier les CSS/styles
- ❓ Les templates Bootstrap sont-ils personnalisés avec les couleurs?
- ⚠️ Pas de fichier CSS personnalisé visible

**Action**: Vérifier et documenter les assets/styles.

---

### 11. **⚠️ FIXTURES / DONNÉES DE TEST**
**Cahier des charges** (Recette et Tests): Besoin de données réalistes

**Réalité**:
- ❌ Pas de fixtures Doctrine implémentées
- ❌ Pas de script seed d'exemple
- ❌ Controllers avec données mockées en dur

**Actions requises**:
1. Créer fixtures pour clubs, joueurs, matchs, etc.
2. Ajouter script de remplissage BD pour tests

---

### 12. **⚠️ TESTS UNITAIRES**
**Cahier des charges** mentionne "Tests et Recette"

**Réalité**:
- ❌ `/tests/bootstrap.php` existe mais vide
- ❌ Pas de tests visibles
- ❌ Pas de PHPUnit configuré

---

### 13. **❓ CONTRÔLEUR CONTACT**
- ✅ Existe mais
- ❓ Pas clair s'il envoie réellement des emails
- ❓ Besoin de vérifier l'implémentation

---

## 📊 RÉSUMÉ DES PRIORITÉS

### 🔴 CRITIQUE (Blocage pour le projet)
1. Entités logistiques (Terrain, Vestiaire, Matériel)
2. Système de validation des matchs avec workflow
3. Rôles utilisateur (Gestionnaire de club)
4. Entité Commentaires
5. API REST pour mobile

### 🟡 IMPORTANT (Fonctionnalités attendues)
1. Modification du profil utilisateur
2. Suppression du compte
3. Système de notifications/alertes email
4. Mailer configuré
5. Fixtures de données

### 🟢 SOUHAITABLE (Nice-to-have / Phase 2)
1. Application Mobile/PWA
2. Tests unitaires
3. Dashboard admin avancé
4. Charte graphique complète

---

## ✅ CORRECTIONS À APPORTER AU CAHIER DES CHARGES

### Option A: Réduire le scope (Recommandé pour BTS)
Si le temps est limité, redéfinir les objectifs:
- **MVP (Phase 1)**: Scores, annuaire clubs, favoris, authentification
- **Phase 2**: Logistique + commentaires + notifications
- **Phase 3**: API REST + Mobile

### Option B: Modifier le CDC pour être honnête sur le périmètre
```diff
VI. Planning et Livrables

Phase de Conception (Terminée)
Développement (En cours) :
+ ✅ Création de la structure Symfony, des entités et des contrôleurs de base [FAIT]
+ ⏳ Entités sportives (Clubs, Joueurs, Matchs, Tournois) [EN COURS]
+ ❌ Entités logistiques (Terrain, Vestiaire, Matériel) [À FAIRE]
+ ❌ Système de validation des matchs [À FAIRE]
+ ❌ API REST [À FAIRE]
+ ❌ Notifications email [À FAIRE]

Tests et Recette
Déploiement
```

---

## 🎯 PLAN D'ACTION RECOMMANDÉ

### Semaine 1 (URGENT)
- [ ] Créer entité `Field/Terrain`
- [ ] Créer entité `DressingRoom/Vestiaire`
- [ ] Créer entité `Equipment/Matériel`
- [ ] Migration Doctrine
- [ ] Gestionnaire des entités

### Semaine 2
- [ ] Créer entité `Comment` + migration
- [ ] Ajouter routes de commentaires
- [ ] Créer entité `MatchValidation` ou refactor `FootballMatch`
- [ ] Implémenter workflow de validation

### Semaine 3
- [ ] Ajouter `ROLE_CLUB_MANAGER`
- [ ] Relation `User.managedClubs` (ManyToMany)
- [ ] Routes de modification de profil
- [ ] Route suppression de compte

### Semaine 4
- [ ] Configurer Mailer Symfony
- [ ] Créer entité `Notification` ou système événements
- [ ] Templates emails
- [ ] Routes alertes/notifications

### Semaine 5
- [ ] API REST endpoints (Clubs, Matchs, Scores)
- [ ] Fixtures de données

### Semaine 6
- [ ] Tests + Recette
- [ ] Déploiement

---

## 📝 CONCLUSION

**Score de conformité: 55/100**

✅ **Points forts**:
- Architecture Symfony solide
- Entités sportives bien structurées
- Authentification et sécurité de base en place
- Design responsive prévu

❌ **Points faibles majeurs**:
- Logistique (cœur du M2L) absente
- Validation des matchs manquante
- Rôles utilisateur incomplets
- Fonctionnalités membres incomplètes
- API REST absente

**Recommandation**: Recentrer le cahier des charges sur le MVP et repousser les fonctionnalités avancées à une phase 2, OU accélérer drastiquement le développement pour couvrir tous les points.
