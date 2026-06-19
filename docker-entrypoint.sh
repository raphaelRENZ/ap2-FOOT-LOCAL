#!/bin/sh
set -e

echo ">>> [1/5] Installation des dépendances Composer..."
composer install --no-interaction --prefer-dist --no-scripts

echo ">>> [1.5/5] Installation des assets AssetMapper..."
php bin/console importmap:install --no-interaction || true

echo ">>> [2/5] Permissions du dossier var/..."
mkdir -p var/cache var/log
chmod -R 777 var/

echo ">>> [3/5] Nettoyage du cache Symfony..."
if [ "${APP_SKIP_CACHE_CLEAR:-1}" = "1" ]; then
	echo "Cache clear ignore (APP_SKIP_CACHE_CLEAR=1)."
else
	php bin/console cache:clear --no-warmup || true
fi

echo ">>> [4/5] Exécution des migrations de base de données..."
if [ "${APP_RUN_MIGRATIONS:-0}" = "1" ]; then
	php bin/console doctrine:migrations:migrate --no-interaction || true
else
	echo "Migrations ignorees (APP_RUN_MIGRATIONS=0)."
fi

echo ">>> [5/5] Chargement des fixtures de test..."
if [ "${APP_LOAD_FIXTURES:-0}" = "1" ]; then
	php bin/console doctrine:fixtures:load --no-interaction --append || true
else
	echo "Fixtures ignorees (APP_LOAD_FIXTURES=0)."
fi

echo ">>> Démarrage du serveur PHP sur 0.0.0.0:8000..."
exec php -S 0.0.0.0:8000 -t public
