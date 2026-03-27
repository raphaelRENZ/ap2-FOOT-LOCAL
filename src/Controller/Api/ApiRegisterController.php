<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/register', name: 'api_register')]
final class ApiRegisterController extends AbstractController
{
    #[Route('', name: '', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true) ?? [];

        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            return $this->json(['status' => 'error', 'message' => 'Email et mot de passe requis.'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['status' => 'error', 'message' => 'Email invalide.'], 400);
        }

        if (strlen($password) < 6) {
            return $this->json(['status' => 'error', 'message' => 'Le mot de passe doit contenir au moins 6 caractères.'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($hasher->hashPassword($user, $password));
        $user->setIsVerified(true);

        if (!empty($data['firstName'])) {
            if (strlen($data['firstName']) > 100) {
                return $this->json(['status' => 'error', 'message' => 'Le prénom ne peut pas dépasser 100 caractères.'], 400);
            }
            $user->setFirstName($data['firstName']);
        }
        if (!empty($data['lastName'])) {
            if (strlen($data['lastName']) > 100) {
                return $this->json(['status' => 'error', 'message' => 'Le nom ne peut pas dépasser 100 caractères.'], 400);
            }
            $user->setLastName($data['lastName']);
        }

        $em->persist($user);
        $em->flush();

        return $this->json([
            'status'  => 'success',
            'message' => 'Compte créé avec succès.',
            'user'    => [
                'id'    => $user->getId(),
                'email' => $user->getEmail(),
            ],
        ], 201);
    }
}
