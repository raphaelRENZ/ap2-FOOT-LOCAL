<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse; // Nécessaire pour l'API
use Symfony\Component\Routing\Attribute\Route;

final class ContactController extends AbstractController
{
    // --- ROUTE WEB (HTML) ---
    #[Route('/contact', name: 'app_contact', methods: ['GET', 'POST'])]
    public function index(Request $request): Response
    {
        $coordonnees = [
            'adresse' => 'Maison des Ligues - Foot Local, 456 Avenue du Sport',
            'telephone' => '05 12 34 56 78',
            'email' => 'contact@footlocal.fr',
        ];

        return $this->render('contact/index.html.twig', [
            'coordonnees' => $coordonnees,
        ]);
    }

    // --- ROUTE API (JSON pour Postman) ---
    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function apiContact(Request $request): JsonResponse
    {
        // On récupère les données JSON envoyées par le mobile
        $data = $request->toArray();

        // On simule une réussite d'envoi
        return $this->json([
            'status' => 'success',
            'message' => 'Votre message a été envoyé à l\'équipe MDL.',
            'recapitulatif' => [
                'sujet' => $data['sujet'] ?? 'Sans sujet',
                'envoye_le' => date('d-m-Y H:i')
            ]
        ], 201); // 201 = Created
    }
}