<?php

namespace App\DataFixtures;

use App\Entity\Club;
use App\Entity\Player;
use App\Entity\FootballMatch;
use App\Entity\Tournament;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        // Créer des utilisateurs
        $user1 = new User();
        $user1->setEmail('user@example.com');
        $user1->setPassword($this->passwordHasher->hashPassword($user1, 'password'));
        $user1->setFirstName('Jean');
        $user1->setLastName('Dupont');
        $user1->setIsVerified(true);
        $user1->setRoles(['ROLE_USER']);
        $manager->persist($user1);

        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin'));
        $admin->setFirstName('Admin');
        $admin->setLastName('Foot Local');
        $admin->setIsVerified(true);
        $admin->setRoles(['ROLE_ADMIN']);
        $manager->persist($admin);

        // Créer 3 clubs
        $club1 = new Club();
        $club1->setName('AS Montagne');
        $club1->setCity('Montville');
        $club1->setCountry('France');
        $club1->setStadium('Stade de la Montagne');
        $club1->setColors('#206448');
        $club1->setDescription('Club de foot local très dynamique');
        $club1->setFoundedYear(2000);
        $manager->persist($club1);

        $club2 = new Club();
        $club2->setName('US Rivière');
        $club2->setCity('Rivertown');
        $club2->setCountry('France');
        $club2->setStadium('Stade Rivière');
        $club2->setColors('#0066CC');
        $club2->setDescription('Club rival depuis 1995');
        $club2->setFoundedYear(1995);
        $manager->persist($club2);

        $club3 = new Club();
        $club3->setName('FC Forêt');
        $club3->setCity('Forestcity');
        $club3->setCountry('France');
        $club3->setStadium('Stade Forêt');
        $club3->setColors('#00AA00');
        $club3->setDescription('Le champion en titre');
        $club3->setFoundedYear(1988);
        $manager->persist($club3);

        // Créer des joueurs pour AS Montagne
        $player1 = new Player();
        $player1->setFirstName('Jean');
        $player1->setLastName('Dupont');
        $player1->setPosition('Attaquant');
        $player1->setJerseyNumber(10);
        $player1->setNationality('France');
        $player1->setHeight(180);
        $player1->setWeight(75);
        $player1->setClub($club1);
        $manager->persist($player1);

        $player2 = new Player();
        $player2->setFirstName('Pierre');
        $player2->setLastName('Martin');
        $player2->setPosition('Défenseur');
        $player2->setJerseyNumber(5);
        $player2->setNationality('France');
        $player2->setHeight(185);
        $player2->setWeight(82);
        $player2->setClub($club1);
        $manager->persist($player2);

        $player3 = new Player();
        $player3->setFirstName('Luc');
        $player3->setLastName('Dubois');
        $player3->setPosition('Gardien');
        $player3->setJerseyNumber(1);
        $player3->setNationality('France');
        $player3->setHeight(190);
        $player3->setWeight(85);
        $player3->setClub($club1);
        $manager->persist($player3);

        // Créer des joueurs pour US Rivière
        $player4 = new Player();
        $player4->setFirstName('Marc');
        $player4->setLastName('Bernard');
        $player4->setPosition('Milieu');
        $player4->setJerseyNumber(8);
        $player4->setNationality('France');
        $player4->setHeight(175);
        $player4->setWeight(70);
        $player4->setClub($club2);
        $manager->persist($player4);

        // Créer un tournoi
        $tournament = new Tournament();
        $tournament->setName('Championnat Local 2026');
        $tournament->setSeason('2025-2026');
        $tournament->setStatus('ongoing');
        $tournament->setStartDate(new \DateTimeImmutable('2025-09-01'));
        $tournament->setEndDate(new \DateTimeImmutable('2026-06-30'));
        $tournament->setLocation('Région Foot Local');
        $tournament->setDescription('Championnat principal de la ligue');
        $manager->persist($tournament);

        // Créer des matchs
        $match1 = new FootballMatch();
        $match1->setHomeTeam($club1);
        $match1->setAwayTeam($club2);
        $match1->setMatchDate(new \DateTimeImmutable('2026-03-15 15:00:00'));
        $match1->setVenue('Stade de la Montagne');
        $match1->setStatus('scheduled');
        $match1->setTournament($tournament);
        $manager->persist($match1);

        $match2 = new FootballMatch();
        $match2->setHomeTeam($club2);
        $match2->setAwayTeam($club3);
        $match2->setHomeScore(2);
        $match2->setAwayScore(1);
        $match2->setMatchDate(new \DateTimeImmutable('2026-03-03 20:00:00'));
        $match2->setVenue('Stade Rivière');
        $match2->setStatus('finished');
        $match2->setTournament($tournament);
        $manager->persist($match2);

        $match3 = new FootballMatch();
        $match3->setHomeTeam($club1);
        $match3->setAwayTeam($club3);
        $match3->setHomeScore(1);
        $match3->setAwayScore(1);
        $match3->setMatchDate(new \DateTimeImmutable('2026-03-05 19:30:00'));
        $match3->setVenue('Stade de la Montagne');
        $match3->setStatus('live');
        $match3->setTournament($tournament);
        $manager->persist($match3);

        // Ajouter club favori pour l'utilisateur
        $user1->addFavoriteClub($club1);

        $manager->flush();
    }
}