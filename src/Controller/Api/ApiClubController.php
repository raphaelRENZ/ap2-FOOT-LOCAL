<?php

namespace App\Controller\Api;

use App\Repository\ClubRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/clubs', name: 'api_clubs')]
final class ApiClubController extends AbstractController
{    public function __construct(private EntityManagerInterface $em) {}    #[Route('', name: 'list', methods: ['GET'])]
    public function list(ClubRepository $clubRepository): JsonResponse
    {
        $clubs = $clubRepository->findAll();
        
        $data = array_map(fn($club) => [
            'id' => $club->getId(),
            'name' => $club->getName(),
            'city' => $club->getCity(),
            'country' => $club->getCountry(),
            'stadium' => $club->getStadium(),
            'logo' => $club->getLogo(),
            'description' => $club->getDescription(),
            'founded_year' => $club->getFoundedYear(),
            'colors' => $club->getColors(),
        ], $clubs);

        return $this->json([
            'status' => 'success',
            'data' => $data,
            'total' => count($data),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, ClubRepository $clubRepository): JsonResponse
    {
        $club = $clubRepository->find($id);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club not found'], 404);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $club->getId(),
                'name' => $club->getName(),
                'city' => $club->getCity(),
                'country' => $club->getCountry(),
                'stadium' => $club->getStadium(),
                'logo' => $club->getLogo(),
                'description' => $club->getDescription(),
                'founded_year' => $club->getFoundedYear(),
                'colors' => $club->getColors(),
                'players' => $club->getPlayers()->map(fn($p) => [
                    'id' => $p->getId(),
                    'firstName' => $p->getFirstName(),
                    'lastName' => $p->getLastName(),
                    'position' => $p->getPosition(),
                    'jerseyNumber' => $p->getJerseyNumber(),
                ])->toArray(),
            ],
        ]);
    }

    #[Route('/{id}/favorite', name: '_favorite', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function toggleFavorite(int $id, ClubRepository $clubRepository): JsonResponse
    {
        $club = $clubRepository->find($id);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club introuvable'], 404);
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if ($user->hasFavoriteClub($club)) {
            $user->removeFavoriteClub($club);
            $this->em->flush();
            return $this->json(['status' => 'success', 'favorited' => false, 'message' => 'Club retiré des favoris']);
        }

        $user->addFavoriteClub($club);
        $this->em->flush();
        return $this->json(['status' => 'success', 'favorited' => true, 'message' => 'Club ajouté aux favoris']);
    }

    #[Route('/{id}/favorite/status', name: '_favorite_status', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function favoriteStatus(int $id, ClubRepository $clubRepository): JsonResponse
    {
        $club = $clubRepository->find($id);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club introuvable'], 404);
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        return $this->json([
            'status' => 'success',
            'favorited' => $user->hasFavoriteClub($club),
        ]);
    }
}
