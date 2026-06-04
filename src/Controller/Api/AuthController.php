<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
final class AuthController extends AbstractController
{
    #[Route('/test', name: 'test', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return $this->json(['status' => 'OK', 'message' => 'API is working!']);
    }

    #[Route('/login', name: 'login', methods: ['POST', 'OPTIONS'])]
    public function login(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        // Handle CORS preflight
        if ($request->getMethod() === 'OPTIONS') {
            return new JsonResponse(null, 204);
        }

        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data || !isset($data['email'], $data['password'])) {
                return $this->json(
                    ['error' => 'Email et mot de passe requis.'],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }

            $user = $userRepository->findOneBy(['email' => $data['email']]);

            if (!$user) {
                return $this->json(
                    ['error' => 'Email ou mot de passe incorrect.'],
                    JsonResponse::HTTP_UNAUTHORIZED
                );
            }

            if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
                return $this->json(
                    ['error' => 'Email ou mot de passe incorrect.'],
                    JsonResponse::HTTP_UNAUTHORIZED
                );
            }

            if (!$user->isActive()) {
                return $this->json(
                    ['error' => 'Compte désactivé.'],
                    JsonResponse::HTTP_UNAUTHORIZED
                );
            }

            // Generate JWT token
            $token = $jwtManager->create($user);

            return $this->json([
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles(),
                ]
            ]);

        } catch (\Throwable $e) {
            error_log('Auth error: ' . $e->getMessage());
            return $this->json(
                ['error' => 'Erreur serveur: ' . $e->getMessage()],
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
