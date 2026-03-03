<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ClubController extends AbstractController
{
    #[Route('/clubs', name: 'app_clubs', methods: ['GET'])]
    public function index(): Response
    {
        // TODO: Récupérer la liste des clubs par ville depuis la base de données
        $clubs = [
            ['id' => 1, 'nom' => 'AS Montagne', 'ville' => 'Montville'],
            ['id' => 2, 'nom' => 'US Rivière', 'ville' => 'Rivertown'],
            ['id' => 3, 'nom' => 'FC Forêt', 'ville' => 'Forestcity'],
        ];

        return $this->render('club/index.html.twig', [
            'clubs' => $clubs,
        ]);
    }

    #[Route('/clubs/{id}', name: 'app_clubs_detail', methods: ['GET'])]
    public function detail(int $id): Response
    {
        // TODO: Récupérer le club et ses joueurs depuis la base de données
        $club = [
            'id' => $id,
            'nom' => 'AS Montagne',
            'ville' => 'Montville',
            'adresse' => '123 Rue du Stade',
            'telephone' => '01 23 45 67 89',
        ];
        $joueurs = [
            ['nom' => 'Dupont', 'prenom' => 'Jean', 'poste' => 'Attaquant'],
            ['nom' => 'Martin', 'prenom' => 'Pierre', 'poste' => 'Défenseur'],
        ];

        return $this->render('club/detail.html.twig', [
            'club' => $club,
            'joueurs' => $joueurs,
        ]);
    }
}
