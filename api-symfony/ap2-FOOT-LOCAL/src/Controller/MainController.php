<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class MainController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function index(): Response
    {
        // Données mockées - à remplacer par des requêtes Doctrine
        $derniersScores = [
            ['domicile' => 'AS Montagne', 'exterieur' => 'US Rivière', 'score' => '2-1'],
            ['domicile' => 'FC Forêt', 'exterieur' => 'SC Plage', 'score' => '0-0'],
        ];
        $actus = [
            ['titre' => 'Terrain A rénové', 'date' => '2026-01-10'],
            ['titre' => 'Nouveau calendrier juniors', 'date' => '2026-01-08'],
        ];

        return $this->render('main/index.html.twig', [
            'derniersScores' => $derniersScores,
            'actus' => $actus,
        ]);
    }
}
