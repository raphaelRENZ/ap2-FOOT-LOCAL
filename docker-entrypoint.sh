#!/bin/sh
set -e

echo ">>> [1/4] Installation des dÃ©pendances Composer..."
composer install --no-interaction --prefer-dist --no-scripts

echo ">>> [2/4] Permissions du dossier var/..."
chmod -R 777 var/

echo ">>> [3/4] Nettoyage du cache Symfony..."
php bin/console cache:clear --no-warmup

echo ">>> [4/4] DÃ©marrage du serveur Symfony sur 0.0.0.0:8000..."
exec symfony server:start --no-tls --port=8000 --allow-http --listen-ip=0.0.0.0
