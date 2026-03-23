#!/bin/sh
set -e

echo ">>> [1/5] Installation des dépendances Composer..."
composer install --no-interaction --prefer-dist --no-scripts

echo ">>> [2/5] Permissions du dossier var/..."
chmod -R 777 var/

echo ">>> [3/5] Nettoyage du cache Symfony..."
php bin/console cache:clear --no-warmup

echo ">>> [4/5] Exécution des migrations de base de données..."
php bin/console doctrine:migrations:migrate --no-interaction || true

echo ">>> [5/5] Chargement des fixtures de test..."
php bin/console doctrine:fixtures:load --no-interaction --append || true

echo ">>> Démarrage du serveur Symfony sur 0.0.0.0:8000..."
exec symfony server:start --no-tls --port=8000 --allow-http --listen-ip=0.0.0.0
