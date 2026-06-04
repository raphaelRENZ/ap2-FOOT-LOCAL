<?php

$privatePath = __DIR__ . '/config/jwt/private.pem';
$publicPath = __DIR__ . '/config/jwt/public.pem';
$passphrase = '57130a54bd6d4d9c85fb489953a88ec5464bf5bb8960f6450450fab6857060c0';

if (!is_dir(dirname($privatePath))) {
    mkdir(dirname($privatePath), 0777, true);
}

$key = openssl_pkey_new([
    'private_key_bits' => 4096,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
]);

if (!$key) {
    while ($error = openssl_error_string()) {
        echo $error, PHP_EOL;
    }
    exit(1);
}

if (!openssl_pkey_export_to_file($key, $privatePath, $passphrase)) {
    while ($error = openssl_error_string()) {
        echo $error, PHP_EOL;
    }
    exit(2);
}

$details = openssl_pkey_get_details($key);
if (!is_array($details) || empty($details['key'])) {
    echo "Could not extract public key", PHP_EOL;
    exit(3);
}

file_put_contents($publicPath, $details['key']);

echo "JWT keypair generated", PHP_EOL;
