<?php

namespace App\Repository;

use App\Entity\Tournament;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tournament>
 */
class TournamentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tournament::class);
    }

    /**
     * Find upcoming tournaments
     */
    public function findUpcoming(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.status = :status')
            ->setParameter('status', 'upcoming')
            ->andWhere('t.startDate > :now OR t.startDate IS NULL')
            ->setParameter('now', new \DateTimeImmutable())
            ->orderBy('t.startDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find ongoing tournaments
     */
    public function findOngoing(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.status = :status')
            ->setParameter('status', 'ongoing')
            ->orderBy('t.startDate', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find tournaments by season
     */
    public function findBySeason(string $season): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.season = :season')
            ->setParameter('season', $season)
            ->orderBy('t.startDate', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find completed tournaments
     */
    public function findCompleted(int $limit = 10): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.status = :status')
            ->setParameter('status', 'completed')
            ->orderBy('t.endDate', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
