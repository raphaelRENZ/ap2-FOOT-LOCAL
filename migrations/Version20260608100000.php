<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Platforms\SqlitePlatform;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260608100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create news table for sidebar and homepage mini-actualites.';
    }

    public function up(Schema $schema): void
    {
        $platform = $this->connection->getDatabasePlatform();

        if ($platform instanceof SqlitePlatform) {
            $this->addSql('CREATE TABLE news (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(255) NOT NULL, subtitle VARCHAR(255) DEFAULT NULL, description CLOB NOT NULL, image_url VARCHAR(255) DEFAULT NULL, position INTEGER NOT NULL, is_published BOOLEAN NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)');
            $this->addSql('CREATE INDEX idx_news_published_position ON news (is_published, position)');
            return;
        }

        $this->addSql('CREATE TABLE news (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, subtitle VARCHAR(255) DEFAULT NULL, description LONGTEXT NOT NULL, image_url VARCHAR(255) DEFAULT NULL, position INT NOT NULL, is_published TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE INDEX idx_news_published_position ON news (is_published, position)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE news');
    }
}