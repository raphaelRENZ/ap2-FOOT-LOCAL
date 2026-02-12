<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260212154707 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE club (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, city VARCHAR(100) DEFAULT NULL, country VARCHAR(100) DEFAULT NULL, description LONGTEXT DEFAULT NULL, logo VARCHAR(255) DEFAULT NULL, stadium VARCHAR(255) DEFAULT NULL, founded_year INT DEFAULT NULL, colors VARCHAR(50) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE football_match (id INT AUTO_INCREMENT NOT NULL, home_score INT DEFAULT NULL, away_score INT DEFAULT NULL, match_date DATETIME NOT NULL, venue VARCHAR(255) DEFAULT NULL, status VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, home_team_id INT NOT NULL, away_team_id INT NOT NULL, tournament_id INT DEFAULT NULL, INDEX IDX_8CE33ACE9C4C13F6 (home_team_id), INDEX IDX_8CE33ACE45185D02 (away_team_id), INDEX IDX_8CE33ACE33D1A3E7 (tournament_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE player (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, nationality VARCHAR(100) DEFAULT NULL, birth_date DATETIME DEFAULT NULL, position VARCHAR(50) DEFAULT NULL, jersey_number INT DEFAULT NULL, height INT DEFAULT NULL, weight INT DEFAULT NULL, preferred_foot VARCHAR(50) DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, club_id INT DEFAULT NULL, INDEX IDX_98197A6561190A32 (club_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tournament (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, season VARCHAR(100) DEFAULT NULL, description LONGTEXT DEFAULT NULL, start_date DATETIME DEFAULT NULL, end_date DATETIME DEFAULT NULL, location VARCHAR(100) DEFAULT NULL, status VARCHAR(50) NOT NULL, logo VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, is_verified TINYINT NOT NULL, first_name VARCHAR(100) DEFAULT NULL, last_name VARCHAR(100) DEFAULT NULL, phone VARCHAR(20) DEFAULT NULL, birth_date DATETIME DEFAULT NULL, avatar VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, last_login_at DATETIME DEFAULT NULL, is_active TINYINT NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user_favorite_clubs (user_id INT NOT NULL, club_id INT NOT NULL, INDEX IDX_78B0C55EA76ED395 (user_id), INDEX IDX_78B0C55E61190A32 (club_id), PRIMARY KEY (user_id, club_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE football_match ADD CONSTRAINT FK_8CE33ACE9C4C13F6 FOREIGN KEY (home_team_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE football_match ADD CONSTRAINT FK_8CE33ACE45185D02 FOREIGN KEY (away_team_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE football_match ADD CONSTRAINT FK_8CE33ACE33D1A3E7 FOREIGN KEY (tournament_id) REFERENCES tournament (id)');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A6561190A32 FOREIGN KEY (club_id) REFERENCES club (id)');
        $this->addSql('ALTER TABLE user_favorite_clubs ADD CONSTRAINT FK_78B0C55EA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_favorite_clubs ADD CONSTRAINT FK_78B0C55E61190A32 FOREIGN KEY (club_id) REFERENCES club (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE football_match DROP FOREIGN KEY FK_8CE33ACE9C4C13F6');
        $this->addSql('ALTER TABLE football_match DROP FOREIGN KEY FK_8CE33ACE45185D02');
        $this->addSql('ALTER TABLE football_match DROP FOREIGN KEY FK_8CE33ACE33D1A3E7');
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A6561190A32');
        $this->addSql('ALTER TABLE user_favorite_clubs DROP FOREIGN KEY FK_78B0C55EA76ED395');
        $this->addSql('ALTER TABLE user_favorite_clubs DROP FOREIGN KEY FK_78B0C55E61190A32');
        $this->addSql('DROP TABLE club');
        $this->addSql('DROP TABLE football_match');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE tournament');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE user_favorite_clubs');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
