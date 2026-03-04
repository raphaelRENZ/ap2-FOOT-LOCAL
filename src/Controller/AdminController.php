<?php

namespace App\Controller;

use App\Entity\Club;
use App\Entity\FootballMatch;
use App\Entity\Tournament;
use App\Repository\ClubRepository;
use App\Repository\MatchRepository;
use App\Repository\TournamentRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin', name: 'app_admin_')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    // ──────────────────────────────────────────
    //  DASHBOARD
    // ──────────────────────────────────────────

    #[Route('', name: 'dashboard', methods: ['GET'])]
    public function dashboard(
        ClubRepository $clubs,
        TournamentRepository $tournaments,
        MatchRepository $matches,
        UserRepository $users
    ): Response {
        return $this->render('admin/index.html.twig', [
            'stats' => [
                'clubs'        => $clubs->count([]),
                'tournois'     => $tournaments->count([]),
                'matchs'       => $matches->count([]),
                'utilisateurs' => $users->count([]),
            ],
        ]);
    }

    // ──────────────────────────────────────────
    //  CLUBS
    // ──────────────────────────────────────────

    #[Route('/clubs', name: 'clubs_index', methods: ['GET'])]
    public function clubsIndex(ClubRepository $repo): Response
    {
        return $this->render('admin/clubs/index.html.twig', [
            'clubs' => $repo->findBy([], ['name' => 'ASC']),
        ]);
    }

    #[Route('/clubs/new', name: 'clubs_new', methods: ['GET', 'POST'])]
    public function clubsNew(Request $request, EntityManagerInterface $em): Response
    {
        if ($request->isMethod('POST')) {
            $club = new Club();
            $this->hydrateClub($club, $request);
            $em->persist($club);
            $em->flush();
            $this->addFlash('success', 'Club créé avec succès.');
            return $this->redirectToRoute('app_admin_clubs_index');
        }

        return $this->render('admin/clubs/new.html.twig');
    }

    #[Route('/clubs/{id}/edit', name: 'clubs_edit', methods: ['GET', 'POST'])]
    public function clubsEdit(int $id, Request $request, ClubRepository $repo, EntityManagerInterface $em): Response
    {
        $club = $repo->find($id) ?? throw $this->createNotFoundException('Club introuvable.');

        if ($request->isMethod('POST')) {
            $this->hydrateClub($club, $request);
            $em->flush();
            $this->addFlash('success', 'Club modifié avec succès.');
            return $this->redirectToRoute('app_admin_clubs_index');
        }

        return $this->render('admin/clubs/edit.html.twig', ['club' => $club]);
    }

    #[Route('/clubs/{id}/delete', name: 'clubs_delete', methods: ['POST'])]
    public function clubsDelete(int $id, Request $request, ClubRepository $repo, EntityManagerInterface $em): Response
    {
        $club = $repo->find($id) ?? throw $this->createNotFoundException('Club introuvable.');

        if ($this->isCsrfTokenValid('delete_club_' . $id, (string) $request->request->get('_token'))) {
            $em->remove($club);
            $em->flush();
            $this->addFlash('success', 'Club supprimé.');
        } else {
            $this->addFlash('error', 'Token CSRF invalide.');
        }

        return $this->redirectToRoute('app_admin_clubs_index');
    }

    private function hydrateClub(Club $club, Request $r): void
    {
        $club->setName((string) $r->request->get('name', ''));
        $club->setCity($r->request->get('city') ?: null);
        $club->setCountry($r->request->get('country') ?: null);
        $club->setDescription($r->request->get('description') ?: null);
        $club->setStadium($r->request->get('stadium') ?: null);
        $club->setColors($r->request->get('colors') ?: null);
        $year = $r->request->get('foundedYear');
        $club->setFoundedYear(($year !== '' && $year !== null) ? (int) $year : null);
    }

    // ──────────────────────────────────────────
    //  TOURNOIS
    // ──────────────────────────────────────────

    #[Route('/tournois', name: 'tournois_index', methods: ['GET'])]
    public function tournoisIndex(TournamentRepository $repo): Response
    {
        return $this->render('admin/tournois/index.html.twig', [
            'tournois' => $repo->findBy([], ['startDate' => 'DESC']),
        ]);
    }

    #[Route('/tournois/new', name: 'tournois_new', methods: ['GET', 'POST'])]
    public function tournoisNew(Request $request, EntityManagerInterface $em): Response
    {
        if ($request->isMethod('POST')) {
            $tournament = new Tournament();
            $this->hydrateTournament($tournament, $request);
            $em->persist($tournament);
            $em->flush();
            $this->addFlash('success', 'Tournoi créé avec succès.');
            return $this->redirectToRoute('app_admin_tournois_index');
        }

        return $this->render('admin/tournois/new.html.twig');
    }

    #[Route('/tournois/{id}/edit', name: 'tournois_edit', methods: ['GET', 'POST'])]
    public function tournoisEdit(int $id, Request $request, TournamentRepository $repo, EntityManagerInterface $em): Response
    {
        $tournament = $repo->find($id) ?? throw $this->createNotFoundException('Tournoi introuvable.');

        if ($request->isMethod('POST')) {
            $this->hydrateTournament($tournament, $request);
            $em->flush();
            $this->addFlash('success', 'Tournoi modifié avec succès.');
            return $this->redirectToRoute('app_admin_tournois_index');
        }

        return $this->render('admin/tournois/edit.html.twig', ['tournoi' => $tournament]);
    }

    #[Route('/tournois/{id}/delete', name: 'tournois_delete', methods: ['POST'])]
    public function tournoisDelete(int $id, Request $request, TournamentRepository $repo, EntityManagerInterface $em): Response
    {
        $tournament = $repo->find($id) ?? throw $this->createNotFoundException('Tournoi introuvable.');

        if ($this->isCsrfTokenValid('delete_tournoi_' . $id, (string) $request->request->get('_token'))) {
            $em->remove($tournament);
            $em->flush();
            $this->addFlash('success', 'Tournoi supprimé.');
        } else {
            $this->addFlash('error', 'Token CSRF invalide.');
        }

        return $this->redirectToRoute('app_admin_tournois_index');
    }

    private function hydrateTournament(Tournament $t, Request $r): void
    {
        $t->setName((string) $r->request->get('name', ''));
        $t->setSeason($r->request->get('season') ?: null);
        $t->setDescription($r->request->get('description') ?: null);
        $t->setLocation($r->request->get('location') ?: null);
        $t->setStatus($r->request->get('status', 'upcoming'));
        $start = $r->request->get('startDate');
        $t->setStartDate($start ? new \DateTimeImmutable($start) : null);
        $end = $r->request->get('endDate');
        $t->setEndDate($end ? new \DateTimeImmutable($end) : null);
    }

    // ──────────────────────────────────────────
    //  MATCHS
    // ──────────────────────────────────────────

    #[Route('/matchs', name: 'matchs_index', methods: ['GET'])]
    public function matchsIndex(MatchRepository $repo): Response
    {
        return $this->render('admin/matchs/index.html.twig', [
            'matchs' => $repo->findBy([], ['matchDate' => 'DESC']),
        ]);
    }

    #[Route('/matchs/new', name: 'matchs_new', methods: ['GET', 'POST'])]
    public function matchsNew(
        Request $request,
        EntityManagerInterface $em,
        ClubRepository $clubs,
        TournamentRepository $tournaments
    ): Response {
        if ($request->isMethod('POST')) {
            $match = new FootballMatch();
            $this->hydrateMatch($match, $request, $clubs, $tournaments);
            $em->persist($match);
            $em->flush();
            $this->addFlash('success', 'Match créé avec succès.');
            return $this->redirectToRoute('app_admin_matchs_index');
        }

        return $this->render('admin/matchs/new.html.twig', [
            'clubs'    => $clubs->findBy([], ['name' => 'ASC']),
            'tournois' => $tournaments->findBy([], ['name' => 'ASC']),
        ]);
    }

    #[Route('/matchs/{id}/edit', name: 'matchs_edit', methods: ['GET', 'POST'])]
    public function matchsEdit(
        int $id,
        Request $request,
        MatchRepository $repo,
        EntityManagerInterface $em,
        ClubRepository $clubs,
        TournamentRepository $tournaments
    ): Response {
        $match = $repo->find($id) ?? throw $this->createNotFoundException('Match introuvable.');

        if ($request->isMethod('POST')) {
            $this->hydrateMatch($match, $request, $clubs, $tournaments);
            $em->flush();
            $this->addFlash('success', 'Match modifié avec succès.');
            return $this->redirectToRoute('app_admin_matchs_index');
        }

        return $this->render('admin/matchs/edit.html.twig', [
            'match'    => $match,
            'clubs'    => $clubs->findBy([], ['name' => 'ASC']),
            'tournois' => $tournaments->findBy([], ['name' => 'ASC']),
        ]);
    }

    #[Route('/matchs/{id}/delete', name: 'matchs_delete', methods: ['POST'])]
    public function matchsDelete(int $id, Request $request, MatchRepository $repo, EntityManagerInterface $em): Response
    {
        $match = $repo->find($id) ?? throw $this->createNotFoundException('Match introuvable.');

        if ($this->isCsrfTokenValid('delete_match_' . $id, (string) $request->request->get('_token'))) {
            $em->remove($match);
            $em->flush();
            $this->addFlash('success', 'Match supprimé.');
        } else {
            $this->addFlash('error', 'Token CSRF invalide.');
        }

        return $this->redirectToRoute('app_admin_matchs_index');
    }

    private function hydrateMatch(FootballMatch $m, Request $r, ClubRepository $clubs, TournamentRepository $tournaments): void
    {
        $home = $clubs->find((int) $r->request->get('homeTeam'));
        $away = $clubs->find((int) $r->request->get('awayTeam'));
        if ($home) $m->setHomeTeam($home);
        if ($away) $m->setAwayTeam($away);

        $hs = $r->request->get('homeScore');
        $m->setHomeScore(($hs !== '' && $hs !== null) ? (int) $hs : null);
        $as = $r->request->get('awayScore');
        $m->setAwayScore(($as !== '' && $as !== null) ? (int) $as : null);

        $date = $r->request->get('matchDate');
        if ($date) $m->setMatchDate(new \DateTimeImmutable($date));

        $m->setVenue($r->request->get('venue') ?: null);
        $m->setStatus($r->request->get('status', 'scheduled'));

        $tid = $r->request->get('tournament');
        $m->setTournament($tid ? $tournaments->find((int) $tid) : null);
    }

    // ──────────────────────────────────────────
    //  UTILISATEURS
    // ──────────────────────────────────────────

    #[Route('/utilisateurs', name: 'utilisateurs_index', methods: ['GET'])]
    public function utilisateursIndex(UserRepository $repo): Response
    {
        return $this->render('admin/utilisateurs/index.html.twig', [
            'utilisateurs' => $repo->findBy([], ['lastName' => 'ASC']),
        ]);
    }

    #[Route('/utilisateurs/{id}/edit', name: 'utilisateurs_edit', methods: ['GET', 'POST'])]
    public function utilisateursEdit(
        int $id,
        Request $request,
        UserRepository $repo,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): Response {
        $user = $repo->find($id) ?? throw $this->createNotFoundException('Utilisateur introuvable.');

        if ($request->isMethod('POST')) {
            $user->setFirstName($request->request->get('firstName') ?: null);
            $user->setLastName($request->request->get('lastName') ?: null);
            $user->setPhone($request->request->get('phone') ?: null);

            $rolesRaw = $request->request->all('roles');
            $user->setRoles(array_values(array_unique($rolesRaw ?: ['ROLE_USER'])));

            $user->setIsActive($request->request->get('isActive') === '1');

            $newPassword = $request->request->get('newPassword');
            if ($newPassword) {
                $user->setPassword($hasher->hashPassword($user, $newPassword));
            }

            $em->flush();
            $this->addFlash('success', 'Utilisateur modifié avec succès.');
            return $this->redirectToRoute('app_admin_utilisateurs_index');
        }

        return $this->render('admin/utilisateurs/edit.html.twig', ['utilisateur' => $user]);
    }

    #[Route('/utilisateurs/{id}/delete', name: 'utilisateurs_delete', methods: ['POST'])]
    public function utilisateursDelete(int $id, Request $request, UserRepository $repo, EntityManagerInterface $em): Response
    {
        $user = $repo->find($id) ?? throw $this->createNotFoundException('Utilisateur introuvable.');

        if ($user === $this->getUser()) {
            $this->addFlash('error', 'Vous ne pouvez pas supprimer votre propre compte.');
            return $this->redirectToRoute('app_admin_utilisateurs_index');
        }

        if ($this->isCsrfTokenValid('delete_user_' . $id, (string) $request->request->get('_token'))) {
            $em->remove($user);
            $em->flush();
            $this->addFlash('success', 'Utilisateur supprimé.');
        } else {
            $this->addFlash('error', 'Token CSRF invalide.');
        }

        return $this->redirectToRoute('app_admin_utilisateurs_index');
    }
}
