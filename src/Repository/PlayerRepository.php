<?php

namespace App\Repository;

use App\Entity\Player;
use App\Entity\Club;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Player>
 */
class PlayerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Player::class);
    }

    /**
     * Find players by club
     */
    public function findByClub(Club $club): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.club = :club')
            ->setParameter('club', $club)
            ->orderBy('p.jerseyNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find players by position
     */
    public function findByPosition(string $position): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.position = :position')
            ->setParameter('position', $position)
            ->orderBy('p.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Search players by name
     */
    public function searchByName(string $search): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.firstName LIKE :search OR p.lastName LIKE :search')
            ->setParameter('search', '%' . $search . '%')
            ->orderBy('p.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find players by nationality
     */
    public function findByNationality(string $nationality): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.nationality = :nationality')
            ->setParameter('nationality', $nationality)
            ->orderBy('p.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
