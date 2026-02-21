<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse; // Nécessaire pour l'API
use Symfony\Component\Routing\Attribute\Route;

final class AccountController extends AbstractController
{
    // --- ROUTES WEB (Pour le navigateur) ---

    #[Route('/compte', name: 'app_compte', methods: ['GET'])]
    public function index(): Response
    {
        $utilisateur = [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com',
        ];

        return $this->render('account/index.html.twig', [
            'utilisateur' => $utilisateur,
        ]);
    }

    #[Route('/compte/favoris', name: 'app_compte_favoris', methods: ['GET', 'POST'])]
    public function favoris(): Response
    {
        $clubsFavoris = [
            ['id' => 1, 'nom' => 'AS Montagne', 'notifications' => true],
            ['id' => 3, 'nom' => 'FC Forêt', 'notifications' => false],
        ];

        return $this->render('account/favoris.html.twig', [
            'clubsFavoris' => $clubsFavoris,
        ]);
    }

    // --- ROUTE API (Pour Postman / Mobile) ---

    #[Route('/api/me', name: 'api_account_me', methods: ['GET'])]
    public function apiMe(): JsonResponse
    {
        // Données simulées pour l'API
        $utilisateur = [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com',
            'date_inscription' => '2026-01-15',
            'roles' => ['ROLE_USER']
        ];

        return $this->json($utilisateur); // Réponse JSON
    }
}