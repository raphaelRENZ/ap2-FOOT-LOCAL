<?php

namespace App\Service;

use App\Entity\Club;
use App\Entity\FootballMatch;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class EmailNotificationService
{
    private const FROM_EMAIL = 'noreply@foot-local.fr';

    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    // 1. Email de bienvenue
    public function sendWelcomeEmail(User $user): void
    {
        $email = (new TemplatedEmail())
            ->from(self::FROM_EMAIL)
            ->to($user->getEmail())
            ->subject('Bienvenue sur Foot Local !')
            ->htmlTemplate('emails/welcome.html.twig')
            ->context([
                'user' => $user,
            ]);

        $this->mailer->send($email);
    }

    public function sendUpcomingMatchAlertEmail(User $user, Club $favoriteClub, FootballMatch $match): void
    {
        $email = (new TemplatedEmail())
            ->from(self::FROM_EMAIL)
            ->to($user->getEmail())
            ->subject(sprintf('Prochain match de %s', $favoriteClub->getName()))
            ->htmlTemplate('emails/upcoming_match_alert.html.twig')
            ->context([
                'user' => $user,
                'favoriteClub' => $favoriteClub,
                'match' => $match,
            ]);

        $this->mailer->send($email);
    }

    public function sendMatchDayReminderEmail(User $user, Club $favoriteClub, FootballMatch $match): void
    {
        $email = (new TemplatedEmail())
            ->from(self::FROM_EMAIL)
            ->to($user->getEmail())
            ->subject(sprintf('Aujourd\'hui : %s joue un match', $favoriteClub->getName()))
            ->htmlTemplate('emails/match_day_reminder.html.twig')
            ->context([
                'user' => $user,
                'favoriteClub' => $favoriteClub,
                'match' => $match,
            ]);

        $this->mailer->send($email);
    }

    public function sendAccountDeletionConfirmation(User $user, string $reason = 'user_request'): void
    {
        $this->sendAccountDeletionConfirmationTo(
            (string) $user->getEmail(),
            $user->getFullName(),
            $reason
        );
    }

    public function sendAccountDeletionConfirmationTo(string $emailAddress, string $displayName, string $reason = 'user_request'): void
    {
        $email = (new TemplatedEmail())
            ->from(self::FROM_EMAIL)
            ->to($emailAddress)
            ->subject('Confirmation de suppression de compte')
            ->htmlTemplate('emails/account_deleted.html.twig')
            ->context([
                'userName' => $displayName ?: $emailAddress,
                'userEmail' => $emailAddress,
                'reason' => $this->formatDeletionReason($reason),
            ]);

        $this->mailer->send($email);
    }

    public function sendAccountDeletedEmail(User $user, string $reason = 'user_request'): void
    {
        $this->sendAccountDeletionConfirmation($user, $reason);
    }

    private function formatDeletionReason(string $reason): string
    {
        $reason = trim($reason);

        return match ($reason) {
            'policy_violation' => 'Suppression par un administrateur pour non-respect des regles.',
            'user_request' => 'Suppression demandee par l\'utilisateur.',
            default => $reason !== '' ? $reason : 'Suppression du compte confirmee.',
        };
    }
}
