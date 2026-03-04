<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260212155801 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Tables already created by Version20260212154707 — skipped to avoid duplicates
    }

    public function down(Schema $schema): void
    {
        // No-op: tables are managed by Version20260212154707
    }
}
