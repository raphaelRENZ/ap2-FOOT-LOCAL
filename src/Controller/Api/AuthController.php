<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
final class AuthController extends AbstractController
{
    #[Route('/test', name: 'test', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return $this->json(['status' => 'OK', 'message' => 'API is working!']);
    }

    /**
     * Login endpoint is handled automatically by Symfony's json_login authenticator
     * configured in security.yaml. The LexikJWT handler generates and returns the token automatically.
     * 
     * To login, send a POST request to /api/login with:
     * { "email": "user@example.com", "password": "password" }
     */
}
