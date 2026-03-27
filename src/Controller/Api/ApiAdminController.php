<?php

namespace App\Controller\Api;

use App\Entity\Club;
use App\Entity\FootballMatch;
use App\Entity\Tournament;
use App\Repository\ClubRepository;
use App\Repository\MatchRepository;
use App\Repository\TournamentRepository;
use App\Repository\UserRepository;
use App\Service\EmailNotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin', name: 'api_admin_')]
#[IsGranted('ROLE_ADMIN')]
final class ApiAdminController extends AbstractController
{
    // ──────────────────────────────────────────
    //  DASHBOARD STATS
    // ──────────────────────────────────────────

    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function stats(
        ClubRepository $clubs,
        TournamentRepository $tournaments,
        MatchRepository $matches,
        UserRepository $users
    ): JsonResponse {
        return $this->json([
            'status' => 'success',
            'data'   => [
                'clubs'        => $clubs->count([]),
                'tournois'     => $tournaments->count([]),
                'matchs'       => $matches->count([]),
                'utilisateurs' => $users->count([]),
            ],
        ]);
    }

    // ──────────────────────────────────────────
    //  CLUBS CRUD
    // ──────────────────────────────────────────

    #[Route('/clubs', name: 'clubs_list', methods: ['GET'])]
    public function clubsList(ClubRepository $repo): JsonResponse
    {
        $clubs = $repo->findBy([], ['name' => 'ASC']);

        return $this->json([
            'status' => 'success',
            'data'   => array_map(fn($c) => [
                'id'          => $c->getId(),
                'name'        => $c->getName(),
                'city'        => $c->getCity(),
                'country'     => $c->getCountry(),
                'stadium'     => $c->getStadium(),
                'colors'      => $c->getColors(),
                'foundedYear' => $c->getFoundedYear(),
                'description' => $c->getDescription(),
            ], $clubs),
        ]);
    }

    #[Route('/clubs', name: 'clubs_create', methods: ['POST'])]
    public function clubsCreate(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data  = json_decode($request->getContent(), true) ?? [];
        $club  = new Club();
        $this->hydrateClub($club, $data);
        $em->persist($club);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Club créé.', 'id' => $club->getId()], 201);
    }

    #[Route('/clubs/{id}', name: 'clubs_update', methods: ['PUT'])]
    public function clubsUpdate(int $id, Request $request, ClubRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $club = $repo->find($id);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club introuvable.'], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $this->hydrateClub($club, $data);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Club modifié.']);
    }

    #[Route('/clubs/{id}', name: 'clubs_delete', methods: ['DELETE'])]
    public function clubsDelete(int $id, ClubRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $club = $repo->find($id);

        if (!$club) {
            return $this->json(['status' => 'error', 'message' => 'Club introuvable.'], 404);
        }

        $em->remove($club);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Club supprimé.']);
    }

    private function hydrateClub(Club $club, array $data): void
    {
        $club->setName((string) ($data['name'] ?? ''));
        $club->setCity($data['city'] ?: null);
        $club->setCountry($data['country'] ?: null);
        $club->setDescription($data['description'] ?: null);
        $club->setStadium($data['stadium'] ?: null);
        $club->setColors($data['colors'] ?: null);
        $year = $data['foundedYear'] ?? null;
        $club->setFoundedYear(($year !== '' && $year !== null) ? (int) $year : null);
    }

    // ──────────────────────────────────────────
    //  TOURNOIS CRUD
    // ──────────────────────────────────────────

    #[Route('/tournois', name: 'tournois_list', methods: ['GET'])]
    public function tournoisList(TournamentRepository $repo): JsonResponse
    {
        $tournois = $repo->findBy([], ['startDate' => 'DESC']);

        return $this->json([
            'status' => 'success',
            'data'   => array_map(fn($t) => [
                'id'          => $t->getId(),
                'name'        => $t->getName(),
                'season'      => $t->getSeason(),
                'location'    => $t->getLocation(),
                'startDate'   => $t->getStartDate()?->format('Y-m-d'),
                'endDate'     => $t->getEndDate()?->format('Y-m-d'),
                'status'      => $t->getStatus(),
                'description' => $t->getDescription(),
            ], $tournois),
        ]);
    }

    #[Route('/tournois', name: 'tournois_create', methods: ['POST'])]
    public function tournoisCreate(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data       = json_decode($request->getContent(), true) ?? [];
        $tournament = new Tournament();
        $this->hydrateTournament($tournament, $data);
        $em->persist($tournament);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Tournoi créé.', 'id' => $tournament->getId()], 201);
    }

    #[Route('/tournois/{id}', name: 'tournois_update', methods: ['PUT'])]
    public function tournoisUpdate(int $id, Request $request, TournamentRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $tournament = $repo->find($id);

        if (!$tournament) {
            return $this->json(['status' => 'error', 'message' => 'Tournoi introuvable.'], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $this->hydrateTournament($tournament, $data);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Tournoi modifié.']);
    }

    #[Route('/tournois/{id}', name: 'tournois_delete', methods: ['DELETE'])]
    public function tournoisDelete(int $id, TournamentRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $tournament = $repo->find($id);

        if (!$tournament) {
            return $this->json(['status' => 'error', 'message' => 'Tournoi introuvable.'], 404);
        }

        $em->remove($tournament);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Tournoi supprimé.']);
    }

    private function hydrateTournament(Tournament $t, array $data): void
    {
        $t->setName((string) ($data['name'] ?? ''));
        $t->setSeason($data['season'] ?: null);
        $t->setDescription($data['description'] ?: null);
        $t->setLocation($data['location'] ?: null);
        $t->setStatus($data['status'] ?? 'upcoming');
        $start = $data['startDate'] ?? null;
        $t->setStartDate($start ? new \DateTimeImmutable($start) : null);
        $end = $data['endDate'] ?? null;
        $t->setEndDate($end ? new \DateTimeImmutable($end) : null);
    }

    // ──────────────────────────────────────────
    //  MATCHS CRUD
    // ──────────────────────────────────────────

    #[Route('/matchs', name: 'matchs_list', methods: ['GET'])]
    public function matchsList(MatchRepository $repo): JsonResponse
    {
        $matchs = $repo->findBy([], ['matchDate' => 'DESC']);

        return $this->json([
            'status' => 'success',
            'data'   => array_map(fn($m) => [
                'id'         => $m->getId(),
                'homeTeam'   => ['id' => $m->getHomeTeam()->getId(), 'name' => $m->getHomeTeam()->getName()],
                'awayTeam'   => ['id' => $m->getAwayTeam()->getId(), 'name' => $m->getAwayTeam()->getName()],
                'homeScore'  => $m->getHomeScore(),
                'awayScore'  => $m->getAwayScore(),
                'matchDate'  => $m->getMatchDate()?->format('Y-m-d\TH:i'),
                'venue'      => $m->getVenue(),
                'status'     => $m->getStatus(),
                'tournament' => $m->getTournament() ? ['id' => $m->getTournament()->getId(), 'name' => $m->getTournament()->getName()] : null,
            ], $matchs),
        ]);
    }

    #[Route('/matchs', name: 'matchs_create', methods: ['POST'])]
    public function matchsCreate(
        Request $request,
        EntityManagerInterface $em,
        ClubRepository $clubs,
        TournamentRepository $tournaments
    ): JsonResponse {
        $data  = json_decode($request->getContent(), true) ?? [];
        $match = new FootballMatch();
        $this->hydrateMatch($match, $data, $clubs, $tournaments);
        $em->persist($match);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Match créé.', 'id' => $match->getId()], 201);
    }

    #[Route('/matchs/{id}', name: 'matchs_update', methods: ['PUT'])]
    public function matchsUpdate(
        int $id,
        Request $request,
        MatchRepository $repo,
        EntityManagerInterface $em,
        ClubRepository $clubs,
        TournamentRepository $tournaments
    ): JsonResponse {
        $match = $repo->find($id);

        if (!$match) {
            return $this->json(['status' => 'error', 'message' => 'Match introuvable.'], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];
        $this->hydrateMatch($match, $data, $clubs, $tournaments);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Match modifié.']);
    }

    #[Route('/matchs/{id}', name: 'matchs_delete', methods: ['DELETE'])]
    public function matchsDelete(int $id, MatchRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $match = $repo->find($id);

        if (!$match) {
            return $this->json(['status' => 'error', 'message' => 'Match introuvable.'], 404);
        }

        $em->remove($match);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Match supprimé.']);
    }

    private function hydrateMatch(FootballMatch $m, array $data, ClubRepository $clubs, TournamentRepository $tournaments): void
    {
        $home = $clubs->find((int) ($data['homeTeam'] ?? 0));
        $away = $clubs->find((int) ($data['awayTeam'] ?? 0));
        if ($home) {
            $m->setHomeTeam($home);
        }
        if ($away) {
            $m->setAwayTeam($away);
        }

        $hs = $data['homeScore'] ?? null;
        $m->setHomeScore(($hs !== '' && $hs !== null) ? (int) $hs : null);
        $as = $data['awayScore'] ?? null;
        $m->setAwayScore(($as !== '' && $as !== null) ? (int) $as : null);

        $date = $data['matchDate'] ?? null;
        if ($date) {
            $m->setMatchDate(new \DateTimeImmutable($date));
        }

        $m->setVenue($data['venue'] ?: null);
        $m->setStatus($data['status'] ?? 'scheduled');

        $tid = $data['tournament'] ?? null;
        $m->setTournament($tid ? $tournaments->find((int) $tid) : null);
    }

    // ──────────────────────────────────────────
    //  UTILISATEURS
    // ──────────────────────────────────────────

    #[Route('/utilisateurs', name: 'utilisateurs_list', methods: ['GET'])]
    public function utilisateursList(UserRepository $repo): JsonResponse
    {
        $users = $repo->findBy([], ['lastName' => 'ASC']);

        return $this->json([
            'status' => 'success',
            'data'   => array_map(fn($u) => [
                'id'         => $u->getId(),
                'email'      => $u->getEmail(),
                'firstName'  => $u->getFirstName(),
                'lastName'   => $u->getLastName(),
                'phone'      => $u->getPhone(),
                'roles'      => $u->getRoles(),
                'isActive'   => $u->isActive(),
                'isVerified' => $u->isVerified(),
            ], $users),
        ]);
    }

    #[Route('/utilisateurs/{id}', name: 'utilisateurs_update', methods: ['PUT'])]
    public function utilisateursUpdate(
        int $id,
        Request $request,
        UserRepository $repo,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $user = $repo->find($id);

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Utilisateur introuvable.'], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName'] ?: null);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName'] ?: null);
        }
        if (isset($data['phone'])) {
            $user->setPhone($data['phone'] ?: null);
        }
        if (isset($data['roles'])) {
            $roles = array_values(array_unique((array) $data['roles']));
            if (!in_array('ROLE_USER', $roles)) {
                $roles[] = 'ROLE_USER';
            }
            $user->setRoles($roles);
        }
        if (isset($data['isActive'])) {
            $user->setIsActive((bool) $data['isActive']);
        }
        if (!empty($data['newPassword'])) {
            $user->setPassword($hasher->hashPassword($user, $data['newPassword']));
        }

        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Utilisateur modifié.']);
    }

    #[Route('/utilisateurs/{id}', name: 'utilisateurs_delete', methods: ['DELETE'])]
    public function utilisateursDelete(
        int $id,
        UserRepository $repo,
        EntityManagerInterface $em,
        EmailNotificationService $emailNotificationService
    ): JsonResponse
    {
        $user = $repo->find($id);

        if (!$user) {
            return $this->json(['status' => 'error', 'message' => 'Utilisateur introuvable.'], 404);
        }

        if ($user === $this->getUser()) {
            return $this->json(['status' => 'error', 'message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 400);
        }

        try {
            $emailNotificationService->sendAccountDeletionConfirmation($user, 'policy_violation');
        } catch (\Throwable $e) {
            // L'email a échoué, mais on continue la suppression
        }

        $em->remove($user);
        $em->flush();

        return $this->json(['status' => 'success', 'message' => 'Utilisateur supprimé.']);
    }
}
