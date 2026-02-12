<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AccountController extends AbstractController
{
    #[Route('/compte', name: 'app_compte', methods: ['GET'])]
    public function index(): Response
    {
        // Récupérer l'utilisateur connecté
        /** @var \App\Entity\User $utilisateur */
        $utilisateur = $this->getUser();

        // Vérifier que l'utilisateur est connecté (normalement géré par access_control)
        if (!$utilisateur) {
            return $this->redirectToRoute('app_login');
        }

        return $this->render('account/index.html.twig', [
            'utilisateur' => $utilisateur,
        ]);
    }

    #[Route('/compte/favoris', name: 'app_compte_favoris', methods: ['GET', 'POST'])]
    public function favoris(): Response
    {
        // Récupérer l'utilisateur connecté
        /** @var \App\Entity\User $utilisateur */
        $utilisateur = $this->getUser();

        if (!$utilisateur) {
            return $this->redirectToRoute('app_login');
        }

        // Récupérer les clubs favoris de l'utilisateur
        $clubsFavoris = $utilisateur->getFavoriteClubs();

        return $this->render('account/favoris.html.twig', [
            'clubsFavoris' => $clubsFavoris,
        ]);
    }
}
