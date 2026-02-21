<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse; // Obligatoire pour l'API
use Symfony\Component\Routing\Attribute\Route;

final class TournamentController extends AbstractController
{
    // --- ROUTES WEB (HTML pour le navigateur) ---

    #[Route('/tournois', name: 'app_tournois', methods: ['GET'])]
    public function index(): Response
    {
        $tournois = [
            ['id' => 1, 'nom' => 'Coupe Locale 2026', 'date_debut' => '2026-02-01'],
            ['id' => 2, 'nom' => 'Championnat Régional', 'date_debut' => '2026-03-15'],
        ];

        return $this->render('tournament/index.html.twig', [
            'tournois' => $tournois,
        ]);
    }

    #[Route('/tournois/{id}', name: 'app_tournois_detail', methods: ['GET'])]
    public function detail(int $id): Response
    {
        $tournoi = ['id' => $id, 'nom' => 'Coupe Locale 2026', 'date_debut' => '2026-02-01'];
        return $this->render('tournament/detail.html.twig', [
            'tournoi' => $tournoi,
            'matchsAVenir' => [],
            'anciensMatchs' => [],
        ]);
    }

    // --- ROUTES API (JSON pour Postman) ---

    #[Route('/api/tournaments', name: 'api_tournaments_index', methods: ['GET'])]
    public function apiIndex(): JsonResponse
    {
        $tournois = [
            ['id' => 1, 'nom' => 'Coupe Locale 2026', 'date_debut' => '2026-02-01'],
            ['id' => 2, 'nom' => 'Championnat Régional', 'date_debut' => '2026-03-15'],
        ];

        return $this->json($tournois); // Retourne les tournois en JSON
    }

    #[Route('/api/tournaments/{id}', name: 'api_tournaments_detail', methods: ['GET'])]
    public function apiDetail(int $id): JsonResponse
    {
        $tournoi = [
            'id' => $id,
            'nom' => 'Coupe Locale 2026',
            'date_debut' => '2026-02-01',
            'statut' => 'En cours'
        ];

        return $this->json($tournoi); // Retourne le détail en JSON
    }
}