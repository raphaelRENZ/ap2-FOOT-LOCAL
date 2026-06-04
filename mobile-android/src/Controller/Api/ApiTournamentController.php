<?php

namespace App\Controller\Api;

use App\Repository\TournamentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/tournaments', name: 'api_tournaments')]
final class ApiTournamentController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(TournamentRepository $tournamentRepository): JsonResponse
    {
        $tournaments = $tournamentRepository->findAll();
        
        $data = array_map(fn($tournament) => [
            'id' => $tournament->getId(),
            'name' => $tournament->getName(),
            'season' => $tournament->getSeason(),
            'status' => $tournament->getStatus(),
            'startDate' => $tournament->getStartDate()?->format('Y-m-d'),
            'endDate' => $tournament->getEndDate()?->format('Y-m-d'),
            'location' => $tournament->getLocation(),
            'logo' => $tournament->getLogo(),
        ], $tournaments);

        return $this->json([
            'status' => 'success',
            'data' => $data,
            'total' => count($data),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, TournamentRepository $tournamentRepository): JsonResponse
    {
        $tournament = $tournamentRepository->find($id);

        if (!$tournament) {
            return $this->json(['status' => 'error', 'message' => 'Tournament not found'], 404);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $tournament->getId(),
                'name' => $tournament->getName(),
                'season' => $tournament->getSeason(),
                'description' => $tournament->getDescription(),
                'status' => $tournament->getStatus(),
                'startDate' => $tournament->getStartDate()?->format('Y-m-d'),
                'endDate' => $tournament->getEndDate()?->format('Y-m-d'),
                'location' => $tournament->getLocation(),
                'logo' => $tournament->getLogo(),
                'matches' => $tournament->getMatches()->map(fn($m) => [
                    'id' => $m->getId(),
                    'homeTeam' => $m->getHomeTeam()->getName(),
                    'awayTeam' => $m->getAwayTeam()->getName(),
                    'status' => $m->getStatus(),
                ])->toArray(),
            ],
        ]);
    }
}
