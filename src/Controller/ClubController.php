<?php

namespace App\Controller;

use App\Repository\ClubRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class ClubController extends AbstractController
{
    public function __construct(
        private ClubRepository $clubRepository,
        private EntityManagerInterface $em,
    ) {}

    #[Route('/clubs', name: 'app_clubs', methods: ['GET'])]
    public function index(): Response
    {
        $clubs = $this->clubRepository->findAll();

        return $this->render('club/index.html.twig', [
            'clubs' => $clubs,
        ]);
    }

    #[Route('/clubs/{id}', name: 'app_clubs_detail', methods: ['GET'])]
    public function detail(int $id): Response
    {
        $club = $this->clubRepository->find($id);

        if (!$club) {
            throw $this->createNotFoundException('Club introuvable');
        }

        $isFavori = false;
        if ($this->getUser()) {
            /** @var \App\Entity\User $user */
            $user = $this->getUser();
            $isFavori = $user->hasFavoriteClub($club);
        }

        return $this->render('club/detail.html.twig', [
            'club'     => $club,
            'joueurs'  => $club->getPlayers(),
            'isFavori' => $isFavori,
        ]);
    }

    #[Route('/clubs/{id}/toggle-favori', name: 'app_clubs_toggle_favori', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function toggleFavori(int $id, Request $request): Response
    {
        if (!$this->isCsrfTokenValid('toggle_favori_' . $id, $request->request->get('_token'))) {
            throw $this->createAccessDeniedException('Token CSRF invalide.');
        }

        $club = $this->clubRepository->find($id);

        if (!$club) {
            throw $this->createNotFoundException('Club introuvable');
        }

        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if ($user->hasFavoriteClub($club)) {
            $user->removeFavoriteClub($club);
        } else {
            $user->addFavoriteClub($club);
        }

        $this->em->flush();

        return $this->redirectToRoute('app_clubs_detail', ['id' => $id]);
    }
}
