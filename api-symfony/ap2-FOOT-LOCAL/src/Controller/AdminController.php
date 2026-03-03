<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\SecurityBundle\Attribute\IsGranted;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
final class AdminController extends AbstractController
{
    #[Route('', name: 'app_admin_dashboard', methods: ['GET'])]
    public function dashboard(): Response
    {
        // TODO: Ajouter la sécurité (IsGranted('ROLE_ADMIN'))
        // Tableau de bord pour la gestion logistique
        $stats = [
            'reservations_aujourdhui' => 5,
            'terrains_disponibles' => 3,
            'vestiaires_occupes' => 2,
        ];

        return $this->render('admin/index.html.twig', [
            'stats' => $stats,
        ]);
    }

    // TODO: Ajouter les routes pour la gestion des terrains, vestiaires, matériel
    // #[Route('/terrains', name: 'app_admin_terrains')]
    // #[Route('/vestiaires', name: 'app_admin_vestiaires')]
    // #[Route('/materiel', name: 'app_admin_materiel')]
}
