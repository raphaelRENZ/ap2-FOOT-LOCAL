<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserProfileFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
final class AccountController extends AbstractController
{
    #[Route('/compte', name: 'app_compte', methods: ['GET'])]
    public function index(): Response
    {
        /** @var \App\Entity\User $utilisateur */
        $utilisateur = $this->getUser();

        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->redirectToRoute('app_admin_dashboard');
        }

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

    #[Route('/compte/modifier', name: 'app_compte_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, EntityManagerInterface $entityManager): Response
    {
        /** @var User $utilisateur */
        $utilisateur = $this->getUser();

        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->redirectToRoute('app_admin_dashboard');
        }

        $form = $this->createForm(UserProfileFormType::class, $utilisateur);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            $this->addFlash('success', 'Vos informations ont ete mises a jour.');

            return $this->redirectToRoute('app_compte');
        }

        return $this->render('account/edit.html.twig', [
            'profileForm' => $form,
        ]);
    }
}
