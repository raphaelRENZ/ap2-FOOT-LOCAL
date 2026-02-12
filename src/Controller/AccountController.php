<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\SecurityBundle\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
final class AccountController extends AbstractController
{
    #[Route('/compte', name: 'app_compte', methods: ['GET'])]
    public function index(): Response
    {
        // TODO: Recup ici  les info de l'utilisateur connecté
        $utilisateur = [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com',
        ];

        return $this->render('account/index.html.twig', [
            'utilisateur' => $utilisateur,
        ]);
    }

    #[Route('/compte/favoris', name: 'app_compte_favoris', methods: ['GET', 'POST'])]
    public function favoris(): Response
    {
        // TODO: Récupérer et gérer les clubs favoris de l'utilisateur
        $clubsFavoris = [
            ['id' => 1, 'nom' => 'AS Montagne', 'notifications' => true],
            ['id' => 3, 'nom' => 'FC Forêt', 'notifications' => false],
        ];

        return $this->render('account/favoris.html.twig', [
            'clubsFavoris' => $clubsFavoris,
        ]);
    }
}
