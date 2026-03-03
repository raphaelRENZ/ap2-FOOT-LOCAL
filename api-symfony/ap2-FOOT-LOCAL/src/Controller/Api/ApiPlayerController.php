<?php

namespace App\Controller\Api;

use App\Repository\PlayerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/players', name: 'api_players')]
final class ApiPlayerController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(PlayerRepository $playerRepository): JsonResponse
    {
        $players = $playerRepository->findAll();
        
        $data = array_map(fn($player) => [
            'id' => $player->getId(),
            'firstName' => $player->getFirstName(),
            'lastName' => $player->getLastName(),
            'position' => $player->getPosition(),
            'jerseyNumber' => $player->getJerseyNumber(),
            'nationality' => $player->getNationality(),
            'club' => $player->getClub() ? [
                'id' => $player->getClub()->getId(),
                'name' => $player->getClub()->getName(),
            ] : null,
        ], $players);

        return $this->json([
            'status' => 'success',
            'data' => $data,
            'total' => count($data),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, PlayerRepository $playerRepository): JsonResponse
    {
        $player = $playerRepository->find($id);

        if (!$player) {
            return $this->json(['status' => 'error', 'message' => 'Player not found'], 404);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $player->getId(),
                'firstName' => $player->getFirstName(),
                'lastName' => $player->getLastName(),
                'position' => $player->getPosition(),
                'jerseyNumber' => $player->getJerseyNumber(),
                'nationality' => $player->getNationality(),
                'birthDate' => $player->getBirthDate()?->format('Y-m-d'),
                'height' => $player->getHeight(),
                'weight' => $player->getWeight(),
                'preferredFoot' => $player->getPreferredFoot(),
                'photo' => $player->getPhoto(),
                'club' => $player->getClub() ? [
                    'id' => $player->getClub()->getId(),
                    'name' => $player->getClub()->getName(),
                ] : null,
            ],
        ]);
    }

    #[Route('/club/{clubId}', name: 'by_club', methods: ['GET'])]
    public function byClub(int $clubId, PlayerRepository $playerRepository): JsonResponse
    {
        $players = $playerRepository->findBy(['club' => $clubId]);
        
        $data = array_map(fn($player) => [
            'id' => $player->getId(),
            'firstName' => $player->getFirstName(),
            'lastName' => $player->getLastName(),
            'position' => $player->getPosition(),
            'jerseyNumber' => $player->getJerseyNumber(),
        ], $players);

        return $this->json([
            'status' => 'success',
            'data' => $data,
            'count' => count($data),
        ]);
    }
}
