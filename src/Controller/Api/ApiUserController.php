<?php

namespace App\Controller\Api;

use App\Service\EmailNotificationService;
use App\Repository\ClubRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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

    #[Route('/me', name: 'me_delete', methods: ['DELETE'])]
    public function deleteMe(
        Request $request,
        EntityManagerInterface $em,
        EmailNotificationService $emailNotificationService
    ): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $data = is_array($data) ? $data : [];
        $reason = trim((string) ($data['reason'] ?? ''));

        if ($reason === '') {
            return $this->json(['status' => 'error', 'message' => 'La raison de suppression est requise.'], 400);
        }

        if (mb_strlen($reason) > 500) {
            return $this->json(['status' => 'error', 'message' => 'La raison ne peut pas depasser 500 caracteres.'], 400);
        }

        $emailAddress = (string) $user->getEmail();
        $displayName = $user->getFullName();
        $emailSent = true;

        try {
            $emailNotificationService->sendAccountDeletionConfirmationTo($emailAddress, $displayName, $reason);
        } catch (\Throwable) {
            $emailSent = false;
        }

        foreach ($user->getFavoriteClubs()->toArray() as $club) {
            $user->removeFavoriteClub($club);
        }

        $em->remove($user);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => $emailSent
                ? 'Compte supprime. Un email de confirmation a ete envoye.'
                : 'Compte supprime, mais l\'email de confirmation n\'a pas pu etre envoye.',
            'emailSent' => $emailSent,
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
    #[IsGranted('ROLE_ADMIN')]
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
    #[IsGranted('ROLE_ADMIN')]
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
