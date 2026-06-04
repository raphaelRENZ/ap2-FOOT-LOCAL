<?php

namespace App\Controller\Api;

use App\Repository\MatchRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/matches', name: 'api_matches')]
final class ApiFootballMatchController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(MatchRepository $matchRepository): JsonResponse
    {
        $matches = $matchRepository->findAll();
        
        $data = array_map(fn($match) => [
            'id' => $match->getId(),
            'homeTeam' => [
                'id' => $match->getHomeTeam()->getId(),
                'name' => $match->getHomeTeam()->getName(),
            ],
            'awayTeam' => [
                'id' => $match->getAwayTeam()->getId(),
                'name' => $match->getAwayTeam()->getName(),
            ],
            'homeScore' => $match->getHomeScore(),
            'awayScore' => $match->getAwayScore(),
            'matchDate' => $match->getMatchDate()?->format('Y-m-d H:i:s'),
            'venue' => $match->getVenue(),
            'status' => $match->getStatus(),
            'tournament' => $match->getTournament() ? [
                'id' => $match->getTournament()->getId(),
                'name' => $match->getTournament()->getName(),
            ] : null,
        ], $matches);

        return $this->json([
            'status' => 'success',
            'data' => $data,
            'total' => count($data),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, MatchRepository $matchRepository): JsonResponse
    {
        $match = $matchRepository->find($id);

        if (!$match) {
            return $this->json(['status' => 'error', 'message' => 'Match not found'], 404);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $match->getId(),
                'homeTeam' => [
                    'id' => $match->getHomeTeam()->getId(),
                    'name' => $match->getHomeTeam()->getName(),
                ],
                'awayTeam' => [
                    'id' => $match->getAwayTeam()->getId(),
                    'name' => $match->getAwayTeam()->getName(),
                ],
                'homeScore' => $match->getHomeScore(),
                'awayScore' => $match->getAwayScore(),
                'matchDate' => $match->getMatchDate()?->format('Y-m-d H:i:s'),
                'venue' => $match->getVenue(),
                'status' => $match->getStatus(),
                'tournament' => $match->getTournament() ? [
                    'id' => $match->getTournament()->getId(),
                    'name' => $match->getTournament()->getName(),
                ] : null,
            ],
        ]);
    }

    #[Route('/status/{status}', name: 'by_status', methods: ['GET'])]
    public function byStatus(string $status, MatchRepository $matchRepository): JsonResponse
    {
        $matches = $matchRepository->findBy(['status' => $status]);
        
        $data = array_map(fn($match) => [
            'id' => $match->getId(),
            'homeTeam' => $match->getHomeTeam()->getName(),
            'awayTeam' => $match->getAwayTeam()->getName(),
            'homeScore' => $match->getHomeScore(),
            'awayScore' => $match->getAwayScore(),
            'status' => $match->getStatus(),
        ], $matches);

        return $this->json([
            'status' => 'success',
            'data' => $data,
            'count' => count($data),
        ]);
    }
}
