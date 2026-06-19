<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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
            'phone'     => $user->getPhone(),
            'avatar'    => $user->getAvatar(),
            'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
            'roles'     => $user->getRoles(),
        ]);
    }

    #[Route('/me', name: 'me_update', methods: ['PUT'])]
    public function updateMe(Request $request, #[CurrentUser] ?User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        if (null === $user) {
            return $this->json(['message' => 'Non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['message' => 'Payload JSON invalide.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (array_key_exists('firstName', $payload)) {
            $user->setFirstName($payload['firstName'] !== '' ? trim((string) $payload['firstName']) : null);
        }

        if (array_key_exists('lastName', $payload)) {
            $user->setLastName($payload['lastName'] !== '' ? trim((string) $payload['lastName']) : null);
        }

        if (array_key_exists('phone', $payload)) {
            $user->setPhone($payload['phone'] !== '' ? trim((string) $payload['phone']) : null);
        }

        if (array_key_exists('avatar', $payload)) {
            $user->setAvatar($payload['avatar'] !== '' ? trim((string) $payload['avatar']) : null);
        }

        if (array_key_exists('birthDate', $payload)) {
            $birthDate = $payload['birthDate'];
            if ($birthDate === '' || $birthDate === null) {
                $user->setBirthDate(null);
            } else {
                try {
                    $user->setBirthDate(new \DateTimeImmutable((string) $birthDate));
                } catch (\Exception) {
                    return $this->json(['message' => 'Date de naissance invalide.'], JsonResponse::HTTP_BAD_REQUEST);
                }
            }
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Profil mis à jour.',
            'id'        => $user->getId(),
            'email'     => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName'  => $user->getLastName(),
            'phone'     => $user->getPhone(),
            'avatar'    => $user->getAvatar(),
            'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
            'roles'     => $user->getRoles(),
        ]);
    }

    #[Route('/me', name: 'me_delete', methods: ['DELETE'])]
    public function deleteMe(Request $request, #[CurrentUser] ?User $user, EntityManagerInterface $entityManager, \Symfony\Component\Mailer\MailerInterface $mailer): JsonResponse
    {
        if (null === $user) {
            return $this->json(['message' => 'Non authentifié.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $payload = json_decode($request->getContent(), true);
        $reason = $payload['reason'] ?? null;
        $comment = $payload['comment'] ?? null;

        $userEmail = $user->getEmail();
        $userName = $user->getFirstName() ?? 'Utilisateur';

        // Supprimer l'utilisateur
        $entityManager->remove($user);
        $entityManager->flush();

        // Envoyer un email de confirmation
        try {
            $email = (new \Symfony\Component\Mime\Email())
                ->from('no-reply@footlocal.local')
                ->to($userEmail)
                ->subject('Votre compte FootLocal a été supprimé')
                ->html($this->renderView('emails/account_deletion.html.twig', [
                    'name' => $userName,
                    'reason' => $reason,
                    'comment' => $comment,
                ]));
            
            $mailer->send($email);
        } catch (\Exception $e) {
            // Log l'erreur mais ne la retourne pas (le compte est déjà supprimé)
            error_log('Erreur lors de l\'envoi du mail de suppression : ' . $e->getMessage());
        }

        return $this->json([
            'message' => 'Compte supprimé avec succès.',
        ]);
    }
}
