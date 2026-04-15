#!/bin/sh
set -e

echo ">>> [1/5] Installation des dépendances Composer..."
if [ "${FORCE_COMPOSER_INSTALL:-0}" = "1" ] || [ ! -f vendor/autoload.php ]; then
	composer install --no-interaction --prefer-dist --no-scripts
else
	echo "Dependencies already present (vendor/autoload.php). Skipping composer install."
fi

echo ">>> [2/5] Permissions du dossier var/..."
chmod -R 777 var/

echo ">>> [3/5] Nettoyage du cache Symfony..."
php bin/console cache:clear --no-warmup || echo "Cache clear failed on mounted volume; continuing startup."

echo ">>> [4/5] Exécution des migrations de base de données..."
php bin/console doctrine:migrations:migrate --no-interaction || true

echo ">>> [5/5] Chargement des fixtures de test..."
php bin/console doctrine:fixtures:load --no-interaction --append || true

if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
	echo ">>> Génération des clés JWT..."
	mkdir -p config/jwt
	php bin/console lexik:jwt:generate-keypair --skip-if-exists || true
fi

echo ">>> Démarrage du serveur Symfony sur 0.0.0.0:8000..."
exec symfony server:start --no-tls --port=8000 --allow-http --listen-ip=0.0.0.0
