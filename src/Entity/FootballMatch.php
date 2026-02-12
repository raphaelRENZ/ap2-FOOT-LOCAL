<?php

namespace App\Entity;

use App\Repository\MatchRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MatchRepository::class)]
#[ORM\Table(name: 'football_match')]
#[ORM\HasLifecycleCallbacks]
class FootballMatch
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Club $homeTeam = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Club $awayTeam = null;

    #[ORM\Column(nullable: true)]
    private ?int $homeScore = null;

    #[ORM\Column(nullable: true)]
    private ?int $awayScore = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $matchDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $venue = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(['scheduled', 'live', 'finished', 'postponed', 'cancelled'])]
    private string $status = 'scheduled';

    #[ORM\ManyToOne(inversedBy: 'matches')]
    private ?Tournament $tournament = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHomeTeam(): ?Club
    {
        return $this->homeTeam;
    }

    public function setHomeTeam(?Club $homeTeam): static
    {
        $this->homeTeam = $homeTeam;
        return $this;
    }

    public function getAwayTeam(): ?Club
    {
        return $this->awayTeam;
    }

    public function setAwayTeam(?Club $awayTeam): static
    {
        $this->awayTeam = $awayTeam;
        return $this;
    }

    public function getHomeScore(): ?int
    {
        return $this->homeScore;
    }

    public function setHomeScore(?int $homeScore): static
    {
        $this->homeScore = $homeScore;
        return $this;
    }

    public function getAwayScore(): ?int
    {
        return $this->awayScore;
    }

    public function setAwayScore(?int $awayScore): static
    {
        $this->awayScore = $awayScore;
        return $this;
    }

    public function getMatchDate(): ?\DateTimeImmutable
    {
        return $this->matchDate;
    }

    public function setMatchDate(\DateTimeImmutable $matchDate): static
    {
        $this->matchDate = $matchDate;
        return $this;
    }

    public function getVenue(): ?string
    {
        return $this->venue;
    }

    public function setVenue(?string $venue): static
    {
        $this->venue = $venue;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getTournament(): ?Tournament
    {
        return $this->tournament;
    }

    public function setTournament(?Tournament $tournament): static
    {
        $this->tournament = $tournament;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getResult(): ?string
    {
        if ($this->homeScore === null || $this->awayScore === null) {
            return null;
        }
        return $this->homeScore . ' - ' . $this->awayScore;
    }

    public function isFinished(): bool
    {
        return $this->status === 'finished';
    }
}
