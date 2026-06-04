<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api', name: 'api_')]
final class ApiUserController extends AbstractController
{
    /**
     * Endpoint de login JWT.
     * La requête doit être en POST avec un body JSON : { "email": "...", "password": "..." }
     * Le token JWT est retourné automatiquement par LexikJWTAuthenticationBundle.
     */
    #[Route('/login', name: 'login', methods: ['GET', 'POST'])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        // GET : infos sur l'endpoint
        if (null === $user) {
            return $this->json([
                'endpoint' => 'POST /api/login',
                'message'  => 'Envoyez une requête POST avec {"email": "...", "password": "..."} pour obtenir un token JWT.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'message' => 'Connexion réussie.',
            'user'    => $user->getUserIdentifier(),
        ]);
    }

    /**
     * Retourne les informations de l'utilisateur authentifié via JWT.
     * Requiert un header : Authorization: Bearer <token>
     */
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(['message' => 'Non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id'        => $user->getId(),
            'email'     => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName'  => $user->getLastName(),
            'roles'     => $user->getRoles(),
        ]);
    }
}
