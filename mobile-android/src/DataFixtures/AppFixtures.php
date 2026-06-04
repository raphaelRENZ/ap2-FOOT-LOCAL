<?php

namespace App\DataFixtures;

use App\Entity\Club;
use App\Entity\FootballMatch;
use App\Entity\Player;
use App\Entity\Tournament;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $hasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        // =====================
        // CLUBS (8 clubs)
        // =====================
        $clubsData = [
            ['AS Montagne',     'Lyon',        'France', 'Stade du Sommet',    1987, 'Rouge et Blanc'],
            ['FC Forêt',        'Grenoble',    'France', 'Stade des Sapins',   1993, 'Vert et Noir'],
            ['Olympique Lac',   'Annecy',      'France', 'Stade du Lac',       1975, 'Bleu et Or'],
            ['SC Rivière',      'Valence',     'France', 'Stade du Rhône',     2001, 'Bleu et Blanc'],
            ['FC Plaine',       'Bourg',       'France', 'Stade de la Plaine', 1965, 'Jaune et Noir'],
            ['US Colline',      'Chambéry',    'France', 'Stade des Collines', 1982, 'Rouge et Bleu'],
            ['Sporting Vallée', 'Albertville', 'France', 'Stade de la Vallée', 2005, 'Orange et Blanc'],
            ['RC Prairie',      'Romans',      'France', 'Stade Prairie',      1978, 'Vert et Blanc'],
        ];

        $clubs = [];
        foreach ($clubsData as $data) {
            $club = new Club();
            $club->setName($data[0]);
            $club->setCity($data[1]);
            $club->setCountry($data[2]);
            $club->setStadium($data[3]);
            $club->setFoundedYear($data[4]);
            $club->setColors($data[5]);
            $club->setDescription('Club de football local de ' . $data[1] . ', fondé en ' . $data[4] . '.');
            $manager->persist($club);
            $clubs[] = $club;
        }

        // =====================
        // JOUEURS (5 par club = 40 joueurs)
        // =====================
        $positions    = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Latéral'];
        $pieds        = ['Droit', 'Gauche', 'Les deux'];
        $nationalites = ['Française', 'Espagnole', 'Portugaise', 'Brésilienne', 'Algérienne', 'Sénégalaise'];

        $prenoms = ['Lucas', 'Thomas', 'Noah', 'Léo', 'Hugo', 'Maxime', 'Antoine', 'Julien',
                    'Pierre', 'Romain', 'Sébastien', 'Karim', 'Yann', 'Baptiste', 'Nicolas',
                    'Alexis', 'Tristan', 'Florian', 'Damien', 'Enzo'];
        $noms    = ['Dupont', 'Martin', 'Bernard', 'Moreau', 'Lefebvre', 'Leroy', 'Simon',
                    'Girard', 'Petit', 'Blanc', 'Garcia', 'Roux', 'Durand', 'Fontaine', 'Lambert',
                    'Chevalier', 'Benali', 'Diallo', 'Ferreira', 'Santos'];

        $playerIndex = 0;
        foreach ($clubs as $club) {
            for ($i = 0; $i < 5; $i++) {
                $player = new Player();
                $player->setFirstName($prenoms[$playerIndex % count($prenoms)]);
                $player->setLastName($noms[$playerIndex % count($noms)]);
                $player->setNationality($nationalites[$playerIndex % count($nationalites)]);
                $player->setBirthDate(new \DateTimeImmutable(sprintf('%d-%02d-%02d',
                    rand(1990, 2002), rand(1, 12), rand(1, 28)
                )));
                $player->setPosition($positions[$i % count($positions)]);
                $player->setJerseyNumber($i + 1);
                $player->setHeight(rand(168, 195));
                $player->setWeight(rand(65, 90));
                $player->setPreferredFoot($pieds[$playerIndex % count($pieds)]);
                $player->setClub($club);
                $manager->persist($player);
                $playerIndex++;
            }
        }

        // =====================
        // UTILISATEURS (6)
        // =====================
        $usersData = [
            ['admin@footlocal.com', 'admin1234', ['ROLE_ADMIN'], 'Admin',   'Système',  '0600000001'],
            ['jean@example.com',    'user1234',  [],             'Jean',    'Dupont',   '0600000002'],
            ['marie@example.com',   'user1234',  [],             'Marie',   'Martin',   '0600000003'],
            ['pierre@example.com',  'user1234',  [],             'Pierre',  'Bernard',  '0600000004'],
            ['sophie@example.com',  'user1234',  [],             'Sophie',  'Lefebvre', '0600000005'],
            ['lucas@example.com',   'user1234',  [],             'Lucas',   'Moreau',   '0600000006'],
        ];

        $users = [];
        foreach ($usersData as $data) {
            $existingUser = $manager->getRepository(User::class)->findOneBy(['email' => $data[0]]);
            if ($existingUser) {
                $users[] = $existingUser;
                continue;
            }
            $user = new User();
            $user->setEmail($data[0]);
            $user->setPassword($this->hasher->hashPassword($user, $data[1]));
            $user->setRoles($data[2]);
            $user->setFirstName($data[3]);
            $user->setLastName($data[4]);
            $user->setPhone($data[5]);
            $user->setIsVerified(true);
            $user->setIsActive(true);
            $user->setBirthDate(new \DateTimeImmutable(sprintf('%d-%02d-%02d',
                rand(1985, 2000), rand(1, 12), rand(1, 28)
            )));
            $manager->persist($user);
            $users[] = $user;
        }

        // Clubs favoris
        if (isset($users[1])) { $users[1]->addFavoriteClub($clubs[0]); $users[1]->addFavoriteClub($clubs[2]); }
        if (isset($users[2])) { $users[2]->addFavoriteClub($clubs[1]); $users[2]->addFavoriteClub($clubs[3]); }
        if (isset($users[3])) { $users[3]->addFavoriteClub($clubs[4]); }
        if (isset($users[4])) { $users[4]->addFavoriteClub($clubs[0]); $users[4]->addFavoriteClub($clubs[6]); }

        // =====================
        // TOURNOIS (3)
        // =====================
        $tournamentsData = [
            ['Coupe Régionale 2025',   '2024-2025', 'Tournoi régional annuel.',             '2025-09-01', '2025-12-15', 'Lyon',      'completed'],
            ['Championnat Local 2026', '2025-2026', 'Championnat de la ligue locale.',      '2026-01-15', '2026-05-30', 'Grenoble',  'ongoing'],
            ['Tournoi Estival 2026',   '2026',      'Tournoi amical estival.',               '2026-07-01', '2026-07-31', 'Annecy',    'upcoming'],
        ];

        $tournaments = [];
        foreach ($tournamentsData as $data) {
            $tournament = new Tournament();
            $tournament->setName($data[0]);
            $tournament->setSeason($data[1]);
            $tournament->setDescription($data[2]);
            $tournament->setStartDate(new \DateTimeImmutable($data[3]));
            $tournament->setEndDate(new \DateTimeImmutable($data[4]));
            $tournament->setLocation($data[5]);
            $tournament->setStatus($data[6]);
            $manager->persist($tournament);
            $tournaments[] = $tournament;
        }

        // =====================
        // MATCHS (10)
        // =====================
        $matchesData = [
            [$clubs[0], $clubs[1], 2,    1,    '2025-09-15', 'Stade du Sommet',    'finished',  $tournaments[0]],
            [$clubs[2], $clubs[3], 0,    0,    '2025-09-22', 'Stade du Lac',       'finished',  $tournaments[0]],
            [$clubs[4], $clubs[5], 3,    2,    '2025-10-05', 'Stade de la Plaine', 'finished',  $tournaments[0]],
            [$clubs[6], $clubs[7], 1,    1,    '2025-10-19', 'Stade de la Vallée', 'finished',  $tournaments[0]],
            [$clubs[0], $clubs[2], 2,    0,    '2025-11-02', 'Stade du Sommet',    'finished',  $tournaments[0]],
            [$clubs[1], $clubs[4], 1,    2,    '2026-02-01', 'Stade des Sapins',   'finished',  $tournaments[1]],
            [$clubs[3], $clubs[6], 0,    1,    '2026-02-08', 'Stade du Rhône',     'finished',  $tournaments[1]],
            [$clubs[5], $clubs[7], null, null, '2026-03-01', 'Stade des Collines', 'scheduled', $tournaments[1]],
            [$clubs[0], $clubs[4], null, null, '2026-03-08', 'Stade du Sommet',    'scheduled', $tournaments[1]],
            [$clubs[2], $clubs[6], null, null, '2026-04-12', 'Stade du Lac',       'scheduled', null],
        ];

        foreach ($matchesData as $data) {
            $match = new FootballMatch();
            $match->setHomeTeam($data[0]);
            $match->setAwayTeam($data[1]);
            $match->setHomeScore($data[2]);
            $match->setAwayScore($data[3]);
            $match->setMatchDate(new \DateTimeImmutable($data[4]));
            $match->setVenue($data[5]);
            $match->setStatus($data[6]);
            if ($data[7] !== null) {
                $match->setTournament($data[7]);
            }
            $manager->persist($match);
        }

        $manager->flush();
    }
}
