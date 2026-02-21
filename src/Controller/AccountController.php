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
        $utilisateur = $this->getUser();

        return $this->render('account/index.html.twig', [
            'utilisateur' => $utilisateur,
        ]);
    }

    #[Route('/compte/favoris', name: 'app_compte_favoris', methods: ['GET', 'POST'])]
    public function favoris(): Response
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $clubsFavoris = $user->getFavoriteClubs();

        return $this->render('account/favoris.html.twig', [
            'clubsFavoris' => $clubsFavoris,
        ]);
    }
}
