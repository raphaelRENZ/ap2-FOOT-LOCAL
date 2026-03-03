<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TournamentController extends AbstractController
{
    #[Route('/tournois', name: 'app_tournois', methods: ['GET'])]
    public function index(): Response
    {
        // TODO: Récupérer la liste des tournois depuis la base de données
        $tournois = [
            ['id' => 1, 'nom' => 'Coupe Locale 2026', 'date_debut' => '2026-02-01'],
            ['id' => 2, 'nom' => 'Championnat Régional', 'date_debut' => '2026-03-15'],
        ];

        return $this->render('tournament/index.html.twig', [
            'tournois' => $tournois,
        ]);
    }

    #[Route('/tournois/{id}', name: 'app_tournois_detail', methods: ['GET'])]
    public function detail(int $id): Response
    {
        // TODO: Récupérer le tournoi et ses matchs depuis la base de données
        $tournoi = [
            'id' => $id,
            'nom' => 'Coupe Locale 2026',
            'date_debut' => '2026-02-01',
        ];
        $matchsAVenir = [
            ['domicile' => 'AS Montagne', 'exterieur' => 'US Rivière', 'date' => '2026-02-05'],
        ];
        $anciensMatchs = [
            ['domicile' => 'FC Forêt', 'exterieur' => 'SC Plage', 'score' => '1-1', 'date' => '2026-01-20'],
        ];

        return $this->render('tournament/detail.html.twig', [
            'tournoi' => $tournoi,
            'matchsAVenir' => $matchsAVenir,
            'anciensMatchs' => $anciensMatchs,
        ]);
    }
}
