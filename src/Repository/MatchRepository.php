<?php

namespace App\Repository;

use App\Entity\FootballMatch;
use App\Entity\Club;
use App\Entity\Tournament;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FootballMatch>
 */
class MatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FootballMatch::class);
    }

    /**
     * Find upcoming matches
     */
    public function findUpcoming(int $limit = 10): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.matchDate > :now')
            ->andWhere('m.status = :status')
            ->setParameter('now', new \DateTimeImmutable())
            ->setParameter('status', 'scheduled')
            ->orderBy('m.matchDate', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find live matches
     */
    public function findLive(): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.status = :status')
            ->setParameter('status', 'live')
            ->orderBy('m.matchDate', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find finished matches
     */
    public function findFinished(int $limit = 20): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.status = :status')
            ->setParameter('status', 'finished')
            ->orderBy('m.matchDate', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find matches by club
     */
    public function findByClub(Club $club, int $limit = 10): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.homeTeam = :club OR m.awayTeam = :club')
            ->setParameter('club', $club)
            ->orderBy('m.matchDate', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find matches by tournament
     */
    public function findByTournament(Tournament $tournament): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.tournament = :tournament')
            ->setParameter('tournament', $tournament)
            ->orderBy('m.matchDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find matches between two clubs
     */
    public function findBetweenClubs(Club $club1, Club $club2): array
    {
        return $this->createQueryBuilder('m')
            ->where('(m.homeTeam = :club1 AND m.awayTeam = :club2) OR (m.homeTeam = :club2 AND m.awayTeam = :club1)')
            ->setParameter('club1', $club1)
            ->setParameter('club2', $club2)
            ->orderBy('m.matchDate', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
