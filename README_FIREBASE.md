# Guide de Migration et Utilisation Firebase

## État Actuel (Mise à jour)
J'ai unifié les versions pour simplifier le projet :
1. **index.html** (Racine) : C'est désormais la version **Sponsoring Manager PRO (12).html** (la version complète et corrigée).
2. **index.backup.html** : L'ancienne version (sauvegarde).
3. **.github/Sponsoring Manager PRO (12).html** : Le fichier source original (que j'ai copié vers la racine).

## Base de Données sur Firebase
Votre application utilise désormais **index.html** à la racine.
Elle est configurée pour utiliser Firebase Firestore.

### Améliorations Apportées :
- **Correction de Bug** : Correction de l'erreur `newClient` dans la sauvegarde automatique.
- **Synchronisation Complète** : Ajout de la synchronisation pour `clientRequests` et `recurringExpenses` (qui manquaient auparavant).
- **Structure Simplifiée** : Le fichier principal `index.html` contient maintenant toutes les fonctionnalités PRO.

## Serveur Local (server.js / db.js)
Ces fichiers sont obsolètes pour la version Firebase. Vous pouvez les ignorer.
L'authentification et la base de données sont gérées directement par Firebase dans `index.html`.

## Comment déployer sur Firebase Hosting
1. Installez Firebase Tools : `npm install -g firebase-tools`
2. Connectez-vous : `firebase login`
3. Initialisez : `firebase init` (choisissez Hosting)
   - Public directory: `.` (le dossier courant) ou créez un dossier `public` et mettez-y `index.html`.
   - Configure as a single-page app: `Yes`
4. Déployez : `firebase deploy`
