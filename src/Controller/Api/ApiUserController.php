<?php

namespace App\Controller\Api;

use App\Repository\ClubRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/users', name: 'api_users')]
final class ApiUserController extends AbstractController
{
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
                'phone' => $user->getPhone(),
                'avatar' => $user->getAvatar(),
                'isVerified' => $user->isVerified(),
                'favoriteClubs' => $user->getFavoriteClubs()->map(fn($c) => [
                    'id' => $c->getId(),
                    'name' => $c->getName(),
                ])->toArray(),
            ],
        ]);
    }

    #[Route('/me/favorites', name: 'me_favorites', methods: ['GET'])]
    public function meFavorites(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $favorites = $user->getFavoriteClubs()->map(fn($club) => [
            'id' => $club->getId(),
            'name' => $club->getName(),
            'city' => $club->getCity(),
            'country' => $club->getCountry(),
            'stadium' => $club->getStadium(),
        ])->toArray();

        return $this->json([
            'status' => 'success',
            'data' => $favorites,
            'count' => count($favorites),
        ]);
    }

    #[Route('/me/favorites/{clubId}', name: 'me_favorite_add', methods: ['POST'])]
    public function addFavorite(int $clubId, ClubRepository $clubRepository, EntityManagerInterface $em): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $club = $clubRepository->find($clubId);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club not found'], 404);
        }

        if ($user->getFavoriteClubs()->contains($club)) {
            return $this->json(['status' => 'error', 'message' => 'Already favorited'], 409);
        }

        $user->addFavoriteClub($club);
        $em->persist($user);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Club added to favorites',
        ]);
    }

    #[Route('/me/favorites/{clubId}', name: 'me_favorite_remove', methods: ['DELETE'])]
    public function removeFavorite(int $clubId, ClubRepository $clubRepository, EntityManagerInterface $em): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $club = $clubRepository->find($clubId);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club not found'], 404);
        }

        if (!$user->getFavoriteClubs()->contains($club)) {
            return $this->json(['status' => 'error', 'message' => 'Not favorited'], 409);
        }

        $user->removeFavoriteClub($club);
        $em->persist($user);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Club removed from favorites',
        ]);
    }

    #[Route('/{id}/favorites', name: 'favorites', methods: ['GET'])]
    public function favorites(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $favorites = $user->getFavoriteClubs()->map(fn($club) => [
            'id' => $club->getId(),
            'name' => $club->getName(),
            'city' => $club->getCity(),
        ])->toArray();

        return $this->json([
            'status' => 'success',
            'data' => $favorites,
            'count' => count($favorites),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        return $this->json([
            'status' => 'success',
            'data' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'isVerified' => $user->isVerified(),
            ],
        ]);
    }
}
