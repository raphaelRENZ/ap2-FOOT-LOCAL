import { useEffect, useState } from 'react'
import './App.css'
import { addFavorite, clearToken, getClubDetail, getClubs, getFavorites, getMatches, getMatchesByStatus, getMe, getTournaments, getTournamentDetail, getToken, login, removeFavorite, saveToken } from './services/api'

function App() {
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('password')
  const [token, setToken] = useState(getToken())
  const [profile, setProfile] = useState(null)
  const [clubs, setClubs] = useState([])
  const [selectedClubId, setSelectedClubId] = useState(null)
  const [selectedClubDetail, setSelectedClubDetail] = useState(null)
  const [playerSearch, setPlayerSearch] = useState('')
  const [matches, setMatches] = useState([])
  const [favorites, setFavorites] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [tournaments, setTournaments] = useState([])
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [matchStatusFilter, setMatchStatusFilter] = useState('scheduled')
  const [activeView, setActiveView] = useState('account')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setProfile(null)
        return
      }

      try {
        const response = await getMe(token)
        setProfile(response.data)
      } catch {
        clearToken()
        setToken(null)
        setProfile(null)
      }
    }

    loadProfile()
  }, [token])

  useEffect(() => {
    async function loadClubs() {
      if (!token) {
        setClubs([])
        return
      }

      try {
        const response = await getClubs()
        setClubs(response.data ?? [])
      } catch {
        setClubs([])
      }
    }

    loadClubs()
  }, [token])

  useEffect(() => {
    async function loadClubDetail() {
      if (!token || !selectedClubId) {
        setSelectedClubDetail(null)
        return
      }

      try {
        const response = await getClubDetail(selectedClubId)
        setSelectedClubDetail(response.data)
      } catch {
        setSelectedClubDetail(null)
      }
    }

    loadClubDetail()
  }, [token, selectedClubId])

  useEffect(() => {
    async function loadMatches() {
      if (!token) {
        setMatches([])
        return
      }

      try {
        const response = await getMatchesByStatus(matchStatusFilter)
        setMatches(response.data ?? [])
      } catch {
        setMatches([])
      }
    }

    loadMatches()
  }, [token, matchStatusFilter])

  useEffect(() => {
    async function loadFavorites() {
      if (!token) {
        setFavorites([])
        setFavoriteIds(new Set())
        return
      }

      try {
        const response = await getFavorites()
        const fav = response.data ?? []
        setFavorites(fav)
        setFavoriteIds(new Set(fav.map((c) => c.id)))
      } catch {
        setFavorites([])
        setFavoriteIds(new Set())
      }
    }

    loadFavorites()
  }, [token])

  useEffect(() => {
    async function loadTournaments() {
      if (!token) {
        setTournaments([])
        return
      }

      try {
        const response = await getTournaments()
        setTournaments(response.data ?? [])
      } catch {
        setTournaments([])
      }
    }

    loadTournaments()
  }, [token])

  useEffect(() => {
    async function loadTournamentDetail() {
      if (!token || !selectedTournament?.id) {
        return
      }

      try {
        const response = await getTournamentDetail(selectedTournament.id)
        setSelectedTournament(response.data)
      } catch {
        // Error handling
      }
    }

    loadTournamentDetail()
  }, [token, selectedTournament?.id])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)
      saveToken(response.token)
      setToken(response.token)
      setActiveView('account')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearToken()
    setToken(null)
    setProfile(null)
    setClubs([])
    setSelectedClubId(null)
    setSelectedClubDetail(null)
    setPlayerSearch('')
    setMatches([])
    setFavorites([])
    setFavoriteIds(new Set())
    setTournaments([])
    setSelectedTournament(null)
  }

  async function toggleFavorite(clubId) {
    setError('')

    if (favoriteIds.has(clubId)) {
      try {
        await removeFavorite(clubId)
        const updated = new Set(favoriteIds)
        updated.delete(clubId)
        setFavoriteIds(updated)
        setFavorites(favorites.filter((c) => c.id !== clubId))
      } catch (e) {
        setError(e.message ?? 'Erreur lors de la suppression du favori')
      }
    } else {
      try {
        await addFavorite(clubId)
        const club = clubs.find((c) => c.id === clubId)
        if (club) {
          setFavoriteIds(new Set(favoriteIds).add(clubId))
          setFavorites([...favorites, club])
        }
      } catch (e) {
        setError(e.message ?? 'Erreur lors de l’ajout en favori')
      }
    }
  }

  const filteredPlayers = selectedClubDetail?.players?.filter((player) => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase()
    return fullName.includes(playerSearch.toLowerCase())
  }) ?? []

  return (
    <main className="container">
      <h1>Foot Local - Web</h1>

      {!token ? (
        <form className="card" onSubmit={handleSubmit}>
          <h2>Connexion</h2>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      ) : (
        <section className="card card-wide">
          <div className="actions">
            <button type="button" onClick={() => setActiveView('account')}>
              Compte
            </button>
            <button type="button" onClick={() => setActiveView('clubs')}>
              Clubs
            </button>
            <button type="button" onClick={() => setActiveView('favorites')}>
              Favoris
            </button>
            <button type="button" onClick={() => setActiveView('tournaments')}>
              Tournois
            </button>
            <button type="button" onClick={() => setActiveView('matches')}>
              Matchs
            </button>
            <button type="button" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>

          {activeView === 'account' ? (
            <>
              <h2>Profil connecté</h2>
              {profile ? (
                <>
                  <p><strong>ID:</strong> {profile.id}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Nom:</strong> {profile.firstName} {profile.lastName}</p>
                  <p><strong>Rôles:</strong> {profile.roles.join(', ')}</p>
                </>
              ) : (
                <p>Chargement du profil...</p>
              )}
            </>
          ) : activeView === 'clubs' ? (
            <>
              <h2>Clubs</h2>
              {selectedClubDetail ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedClubId(null)}
                    className="btn-back"
                  >
                    ← Retour à la liste
                  </button>

                  <div className="club-detail">
                    <h3>{selectedClubDetail.name}</h3>
                    <p><strong>Ville:</strong> {selectedClubDetail.city} - {selectedClubDetail.country}</p>
                    <p><strong>Stade:</strong> {selectedClubDetail.stadium}</p>
                    {selectedClubDetail.founded_year && (
                      <p><strong>Fondé en:</strong> {selectedClubDetail.founded_year}</p>
                    )}
                    {selectedClubDetail.colors && (
                      <p><strong>Couleurs:</strong> {selectedClubDetail.colors}</p>
                    )}
                    {selectedClubDetail.description && (
                      <p><strong>Description:</strong> {selectedClubDetail.description}</p>
                    )}
                  </div>

                  <h4>Joueurs ({selectedClubDetail.players?.length ?? 0})</h4>
                  <input
                    type="text"
                    className="player-search"
                    placeholder="Rechercher un joueur..."
                    value={playerSearch}
                    onChange={(event) => setPlayerSearch(event.target.value)}
                  />
                  {selectedClubDetail.players && selectedClubDetail.players.length > 0 ? (
                    filteredPlayers.length > 0 ? (
                    <ul className="player-list">
                      {filteredPlayers.map((player) => (
                        <li key={player.id}>
                          <p><strong>{player.firstName} {player.lastName}</strong></p>
                          <p>Poste: {player.position} | N° {player.jerseyNumber}</p>
                        </li>
                      ))}
                    </ul>
                    ) : (
                      <p>Aucun joueur ne correspond à la recherche.</p>
                    )
                  ) : (
                    <p>Aucun joueur trouvé pour ce club.</p>
                  )}
                </>
              ) : clubs.length === 0 ? (
                <p>Aucun club trouvé.</p>
              ) : (
                <ul className="club-list">
                  {clubs.map((club) => (
                    <li key={club.id}>
                      <p><strong>{club.name}</strong></p>
                      <p>{club.city} - {club.country}</p>
                      <p>Stade: {club.stadium}</p>
                      <button
                        type="button"
                        className="btn-detail"
                        onClick={() => setSelectedClubId(club.id)}
                      >
                        Détails + joueurs
                      </button>
                      <button
                        type="button"
                        className={favoriteIds.has(club.id) ? 'btn-favorite active' : 'btn-favorite'}
                        onClick={() => toggleFavorite(club.id)}
                      >
                        {favoriteIds.has(club.id) ? '★ Favori' : '☆ Ajouter aux favoris'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : activeView === 'tournaments' ? (
            <>
              <h2>Tournois</h2>
              {selectedTournament ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedTournament(null)}
                    className="btn-back"
                  >
                    ← Retour à la liste
                  </button>
                  <div className="tournament-detail">
                    <h3>{selectedTournament.name}</h3>
                    <p><strong>Saison:</strong> {selectedTournament.season}</p>
                    <p><strong>Statut:</strong> {selectedTournament.status}</p>
                    <p><strong>Lieu:</strong> {selectedTournament.location}</p>
                    <p><strong>Dates:</strong> {selectedTournament.startDate} à {selectedTournament.endDate}</p>
                    {selectedTournament.description && (
                      <p><strong>Description:</strong> {selectedTournament.description}</p>
                    )}
                  </div>
                  <h4>Matchs du tournoi ({selectedTournament.matches?.length ?? 0})</h4>
                  {selectedTournament.matches && selectedTournament.matches.length > 0 ? (
                    <ul className="match-list">
                      {selectedTournament.matches.map((match) => (
                        <li key={match.id}>
                          <p className="match-teams">
                            <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
                          </p>
                          <p className="match-status">Statut: <em>{match.status}</em></p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun match dans ce tournoi.</p>
                  )}
                </>
              ) : (
                <>
                  {tournaments.length === 0 ? (
                    <p>Aucun tournoi trouvé.</p>
                  ) : (
                    <ul className="tournament-list">
                      {tournaments.map((tournament) => (
                        <li key={tournament.id} className="tournament-item">
                          <div>
                            <p className="tournament-name"><strong>{tournament.name}</strong></p>
                            <p><em>Saison {tournament.season}</em></p>
                            <p className="tournament-status">{tournament.status}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedTournament(tournament)}
                            className="btn-detail"
                          >
                            Détails
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          ) : activeView === 'favorites' ? (
            <>
              <h2>Clubs favoris</h2>
              {favorites.length === 0 ? (
                <p>Vous n'avez pas encore de clubs favoris.</p>
              ) : (
                <ul className="club-list">
                  {favorites.map((club) => (
                    <li key={club.id}>
                      <p><strong>{club.name}</strong></p>
                      <p>{club.city} - {club.country}</p>
                      <p>Stade: {club.stadium}</p>
                      <button
                        type="button"
                        className="btn-favorite active"
                        onClick={() => toggleFavorite(club.id)}
                      >
                        ★ Supprimer des favoris
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <h2>Matchs</h2>
              <div className="filter-group">
                {['scheduled', 'live', 'finished'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={matchStatusFilter === status ? 'active' : ''}
                    onClick={() => setMatchStatusFilter(status)}
                  >
                    {status === 'scheduled' ? 'À venir' : status === 'live' ? 'En direct' : 'Terminés'}
                  </button>
                ))}
              </div>

              {matches.length === 0 ? (
                <p>Aucun match trouvé.</p>
              ) : (
                <ul className="match-list">
                  {matches.map((match) => (
                    <li key={match.id}>
                      <p className="match-teams">
                        <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
                      </p>
                      {matchStatusFilter === 'finished' && (
                        <p className="match-score">
                          Résultat: {match.homeScore} - {match.awayScore}
                        </p>
                      )}
                      {matchStatusFilter === 'live' && (
                        <p className="match-score">
                          En cours: {match.homeScore} - {match.awayScore}
                        </p>
                      )}
                      <p className="match-status">
                        Statut: <em>{match.status}</em>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      )}
    </main>
  )
}

export default App
