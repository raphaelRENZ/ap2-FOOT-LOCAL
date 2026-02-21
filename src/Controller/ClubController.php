<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ClubController extends AbstractController
{
    // --- PARTIE WEB (HTML pour le navigateur) ---

    #[Route('/clubs', name: 'app_clubs', methods: ['GET'])]
    public function index(): Response
    {
        $clubs = [
            ['id' => 1, 'nom' => 'AS Montagne', 'ville' => 'Montville'],
            ['id' => 2, 'nom' => 'US Rivière', 'ville' => 'Rivertown'],
        ];

        return $this->render('club/index.html.twig', [
            'clubs' => $clubs,
        ]);
    }

    #[Route('/clubs/{id}', name: 'app_clubs_detail', methods: ['GET'])]
    public function detail(int $id): Response
    {
        $club = ['id' => $id, 'nom' => 'AS Montagne', 'ville' => 'Montville'];
        return $this->render('club/detail.html.twig', [
            'club' => $club,
            'joueurs' => []
        ]);
    }

    // --- PARTIE API (JSON pour Postman et Expo) ---

    #[Route('/api/clubs', name: 'api_clubs_index', methods: ['GET'])]
    public function apiIndex(): JsonResponse
    {
        $clubs = [
            ['id' => 1, 'nom' => 'AS Montagne', 'ville' => 'Montville'],
            ['id' => 2, 'nom' => 'US Rivière', 'ville' => 'Rivertown'],
        ];
        return $this->json($clubs);
    }

    #[Route('/api/clubs/{id}', name: 'api_clubs_detail', methods: ['GET'])]
    public function apiDetail(int $id): JsonResponse
    {
        $club = [
            'id' => $id,
            'nom' => 'AS Montagne',
            'ville' => 'Montville',
            'adresse' => '123 Rue du Stade',
            'telephone' => '01 23 45 67 89'
        ];
        return $this->json($club);
    }
}