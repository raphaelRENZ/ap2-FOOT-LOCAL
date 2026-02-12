<?php

namespace App\Repository;

use App\Entity\Club;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Club>
 */
class ClubRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Club::class);
    }

    /**
     * Find clubs by name (partial match)
     */
    public function findByNameLike(string $name): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.name LIKE :name')
            ->setParameter('name', '%' . $name . '%')
            ->orderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find clubs by country
     */
    public function findByCountry(string $country): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.country = :country')
            ->setParameter('country', $country)
            ->orderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Get most popular clubs (by number of fans)
     */
    public function findMostPopular(int $limit = 10): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.fans', 'f')
            ->groupBy('c.id')
            ->orderBy('COUNT(f.id)', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
