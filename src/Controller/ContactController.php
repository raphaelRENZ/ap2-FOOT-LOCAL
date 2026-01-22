<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ContactController extends AbstractController
{
    #[Route('/contact', name: 'app_contact', methods: ['GET', 'POST'])]
    public function index(Request $request): Response
    {
        // TODO: Implémenter le traitement du formulaire de contact
        $coordonnees = [
            'adresse' => 'Maison des Ligues - Foot Local, 456 Avenue du Sport',
            'telephone' => '05 12 34 56 78',
            'email' => 'contact@footlocal.fr',
        ];

        if ($request->isMethod('POST')) {
            // TODO: Valider et traiter le formulaire
            // $this->addFlash('success', 'Votre message a été envoyé avec succès !');
        }

        return $this->render('contact/index.html.twig', [
            'coordonnees' => $coordonnees,
        ]);
    }
}
