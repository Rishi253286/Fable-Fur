import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

const storyShowcase = [
  {
    name: 'Milo',
    story: 'Adopted by a couple after two quick matches and one perfect meet-and-greet.',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Pepper',
    story: 'Found her forever home with a family that loved calm routines and cozy evenings.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Clover',
    story: 'A gentle rabbit rescued and matched to a peaceful apartment with a sunny window.',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=900&q=80'
  }
];

function App() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', age: 'all', energy: 'all' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePet, setActivePet] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fablefur-user');
    if (!savedUser) {
      return { name: 'Guest User', email: '', isAuthenticated: false };
    }

    try {
      return { ...JSON.parse(savedUser), isAuthenticated: true };
    } catch {
      return { name: 'Guest User', email: '', isAuthenticated: false };
    }
  });
  const [matchSummary, setMatchSummary] = useState({ liked: 0, superliked: 0, skipped: 0 });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        const json = await res.json();
        setPets(json.pets || []);
      } catch (error) {
        console.error('Failed to fetch pets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  useEffect(() => {
    if (user.isAuthenticated) {
      localStorage.setItem('fablefur-user', JSON.stringify({ name: user.name, email: user.email }));
    } else {
      localStorage.removeItem('fablefur-user');
    }
  }, [user]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const typeMatch = filters.type === 'all' || pet.type === filters.type;
      const ageMatch = filters.age === 'all' || pet.age === filters.age;
      const energyMatch = filters.energy === 'all' || pet.energy === filters.energy;
      return typeMatch && ageMatch && energyMatch;
    });
  }, [pets, filters]);

  const visibleCards = filteredPets.slice(currentIndex, currentIndex + 3);

  const handleFilter = (group, value) => {
    setFilters((previous) => ({ ...previous, [group]: value }));
    setCurrentIndex(0);
  };

  const handleDecision = async (decision, pet = null) => {
    if (!filteredPets.length) return;

    if (decision === 'like') {
      setMatchSummary((prev) => ({ ...prev, liked: prev.liked + 1 }));
    } else if (decision === 'favorite') {
      setMatchSummary((prev) => ({ ...prev, superliked: prev.superliked + 1 }));
    } else {
      setMatchSummary((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
    }

    if (pet) {
      try {
        await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            petId: pet.id,
            userName: user.name || 'Guest User',
            matchType: decision === 'favorite' ? 'superlike' : decision
          })
        });
      } catch (error) {
        console.error('Failed to save match', error);
      }
    }

    setCurrentIndex((previous) => {
      if (previous >= filteredPets.length - 1) {
        return 0;
      }
      return previous + 1;
    });
  };

  const handleAuthSubmit = async (event, mode) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!email || !password || (mode === 'signup' && !name)) {
      setAuthError(mode === 'signup' ? 'Please fill in your name, email, and password.' : 'Please enter your email and password.');
      return;
    }

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = mode === 'signup' ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Authentication failed.');
      }

      const nextUser = mode === 'signup' ? json.user : json.user;
      setUser({
        name: nextUser.name,
        email: nextUser.email,
        isAuthenticated: true
      });
      setAuthError('');
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.message || 'Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser({ name: 'Guest User', email: '', isAuthenticated: false });
    setAuthError('');
    navigate('/');
  };

  const protectedRoute = (element) => user.isAuthenticated ? element : <AuthPage mode="login" onSubmit={handleAuthSubmit} authError={authError} />;

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-badge logo-badge">
            <img className="logo-image" src="/logo.png" alt="Fable & Fur logo" />
          </div>
          <div>
            <p className="brand-kicker">Adopt with joy</p>
            <h1>Fable & Fur</h1>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/match">Match</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {!user.isAuthenticated && <NavLink to="/signup">Sign up</NavLink>}
          {!user.isAuthenticated && <NavLink to="/login">Log in</NavLink>}
          {user.isAuthenticated && <button type="button" className="nav-logout" onClick={handleLogout}>Log out</button>}
        </nav>

        <div className="nav-actions">
          {!user.isAuthenticated ? (
            <>
              <NavLink className="ghost-btn" to="/login">Log in</NavLink>
              <NavLink className="secondary-btn" to="/signup">Sign up</NavLink>
            </>
          ) : (
            <>
              <span className="user-pill">Hi, {user.name}</span>
              <button type="button" className="secondary-btn" onClick={handleLogout}>Log out</button>
            </>
          )}
          <NavLink className="primary-btn" to="/match">Start swiping</NavLink>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage pets={pets} user={user} />} />
          <Route
            path="/match"
            element={protectedRoute(
              <MatchPage
                pets={pets}
                loading={loading}
                filters={filters}
                currentIndex={currentIndex}
                activePet={activePet}
                matchSummary={matchSummary}
                visibleCards={visibleCards}
                onSetActivePet={setActivePet}
                onFilter={handleFilter}
                onDecision={handleDecision}
                user={user}
              />
            )}
          />
          <Route path="/dashboard" element={protectedRoute(<DashboardPage user={user} matchSummary={matchSummary} />)} />
          <Route path="/login" element={<AuthPage mode="login" onSubmit={handleAuthSubmit} authError={authError} />} />
          <Route path="/signup" element={<AuthPage mode="signup" onSubmit={handleAuthSubmit} authError={authError} />} />
        </Routes>
      </main>

      <footer className="site-footer" id="support">
        <div>
          <div className="brand-wrap">
            <div className="brand-badge logo-badge">
              <img className="logo-image" src="/logo.png" alt="Fable & Fur logo" />
            </div>
            <div>
              <p className="brand-kicker">Adopt with joy</p>
              <h1>Fable & Fur</h1>
            </div>
          </div>
        </div>
        <p>Helping rescue pets find their favorite humans since 2025.</p>
      </footer>
    </div>
  );
}

function HomePage({ pets, user }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Find your match, not just a pet</span>
          <h2>Where rescue pets and loving humans meet.</h2>
          <p>
            Swipe through adorable companions, discover personalities that fit your life,
            and take the next step to adoption with confidence.
          </p>

          <div className="cta-row">
            <NavLink className="primary-btn large" to={user.isAuthenticated ? '/match' : '/signup'}>
              {user.isAuthenticated ? 'Meet adoptables' : 'Create account'}
            </NavLink>
            <NavLink className="secondary-btn large" to={user.isAuthenticated ? '/dashboard' : '/login'}>
              {user.isAuthenticated ? 'Open dashboard' : 'Log in'}
            </NavLink>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>12.4k+</strong>
              <span>happy adoptions</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>average match rating</span>
            </div>
            <div>
              <strong>2.3k</strong>
              <span>local foster homes</span>
            </div>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="pet-spotlight-card">
            <img src={pets[0]?.image || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80'} alt="Happy rescue dog sitting outdoors" />
            <div className="spotlight-badge">
              <span>Featured match</span>
              <strong>{pets[0]?.name || 'Nova'} • {pets[0]?.age || '2 yrs'}</strong>
            </div>
          </div>
          <div className="floating-bubble bubble-1">
            <img className="ui-icon small" src="https://img.icons8.com/fluency/48/home.png" alt="Home icon" />
            <span>Verified home</span>
          </div>
          <div className="floating-bubble bubble-2">
            <img className="ui-icon small" src="https://img.icons8.com/fluency/48/like.png" alt="Heart icon" />
            <span>High match score</span>
          </div>
        </div>
      </section>

      <section className="featured-pets" id="stories">
        <div className="section-heading">
          <p className="label">Success stories</p>
          <h3>Recently matched forever homes</h3>
        </div>

        <div className="story-grid">
          {storyShowcase.map((story) => (
            <article className="story-card" key={story.name}>
              <img src={story.image} alt={story.name} />
              <div className="story-card-body">
                <h4>{story.name}</h4>
                <p>{story.story}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process" id="process">
        <div className="section-heading centered">
          <p className="label">How matching works</p>
          <h3>Easy steps to find your perfect companion</h3>
        </div>

        <div className="steps">
          <article>
            <div className="step-number">01</div>
            <h4>Build your profile</h4>
            <p>Tell us about your space, routines, and the energy level that feels right.</p>
          </article>
          <article>
            <div className="step-number">02</div>
            <h4>Swipe with intention</h4>
            <p>Browse rescue pets that match your rhythm and priorities in seconds.</p>
          </article>
          <article>
            <div className="step-number">03</div>
            <h4>Meet & welcome home</h4>
            <p>Schedule a meet-and-greet, complete adoption, and begin your new chapter.</p>
          </article>
        </div>
      </section>
    </>
  );
}

function MatchPage({ pets, loading, filters, currentIndex, activePet, matchSummary, visibleCards, onSetActivePet, onFilter, onDecision, user }) {
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const typeMatch = filters.type === 'all' || pet.type === filters.type;
      const ageMatch = filters.age === 'all' || pet.age === filters.age;
      const energyMatch = filters.energy === 'all' || pet.energy === filters.energy;
      return typeMatch && ageMatch && energyMatch;
    });
  }, [pets, filters]);

  return (
    <>
      <section className="match-area" id="match">
        <aside className="filters-panel">
          <div className="panel-header">
            <p className="label">Filter your vibe</p>
            <h3>Perfect pet, perfect home</h3>
          </div>

          <div className="filter-group">
            <span className="filter-label">Animal</span>
            <div className="chip-row">
              {['all', 'Dog', 'Cat', 'Rabbit', 'German Shepherd', 'Golden Retriever', 'Tortoise', 'Husky', 'Beagle', 'Labrador', 'Parrot', 'Central Asian Shepherd', 'Boxer', 'Corgi', 'Rottweiler', 'Dachshund', 'Bengal'].map((value) => (
                <button
                  key={value}
                  className={`chip ${filters.type === value ? 'active' : ''}`}
                  onClick={() => onFilter('type', value)}
                >
                  {value === 'all' ? 'All' : value}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Age</span>
            <div className="chip-row">
              {['all', 'Puppy', 'Young', 'Adult'].map((value) => (
                <button
                  key={value}
                  className={`chip ${filters.age === value ? 'active' : ''}`}
                  onClick={() => onFilter('age', value)}
                >
                  {value === 'all' ? 'Any age' : value}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Lifestyle</span>
            <div className="chip-row">
              {['all', 'Playful', 'Calm', 'Affectionate'].map((value) => (
                <button
                  key={value}
                  className={`chip ${filters.energy === value ? 'active' : ''}`}
                  onClick={() => onFilter('energy', value)}
                >
                  {value === 'all' ? 'Any' : value}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-summary-card">
            <p className="label">This week</p>
            <strong>{filteredPets.length} pets available</strong>
            <span>Ready for meet-and-greets</span>
          </div>
        </aside>

        <div className="swipe-panel">
          <div className="card-toolbar">
            <button className="icon-btn" aria-label="Previous pet">
              <img className="ui-icon small" src="https://img.icons8.com/fluency/48/undo.png" alt="Undo icon" />
            </button>
            <div className="toolbar-status">
              <span className="dot online"></span>
              <span>Live adoption board</span>
            </div>
            <button className="icon-btn" aria-label="Refresh matches">
              <img className="ui-icon small" src="https://img.icons8.com/fluency/48/refresh.png" alt="Refresh icon" />
            </button>
          </div>

          <div className="card-stack" aria-live="polite">
            {loading ? (
              <div className="pet-card"><div className="pet-card-content"><h3>Loading pets...</h3></div></div>
            ) : filteredPets.length ? (
              visibleCards.map((pet, idx) => (
                <article className="pet-card" key={pet.id} style={{ zIndex: 10 - idx }}>
                  <img src={pet.image} alt={pet.name} />
                  <div className="pet-card-content">
                    <div className="pet-topline">
                      <h3 className="pet-name">{pet.name}</h3>
                      <button className="primary-btn" onClick={() => onSetActivePet(pet)}>Details</button>
                    </div>

                    <div className="pet-meta">
                      <span>{pet.type}</span>
                      <span>•</span>
                      <span>{pet.age}</span>
                      <span>•</span>
                      <span>{pet.city}</span>
                    </div>

                    <div className="pet-badges">
                      {(pet.tags || []).map((tag) => (
                        <span className="pet-badge" key={tag}>{tag}</span>
                      ))}
                    </div>

                    <p className="pet-story">{pet.bio}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="pet-card no-results">
                <div className="pet-card-content">
                  <h3>No matches yet</h3>
                  <p className="pet-story">Try widening your filters to discover more adorable companions.</p>
                </div>
              </div>
            )}
          </div>

          <div className="swipe-actions">
            <button className="action-btn skip" onClick={() => onDecision('skip', filteredPets[currentIndex] || null)}>Pass</button>
            <button className="action-btn favorite" onClick={() => onDecision('favorite', filteredPets[currentIndex] || null)}>Super like</button>
            <button className="action-btn like" onClick={() => onDecision('like', filteredPets[currentIndex] || null)}>Adopt me</button>
          </div>
        </div>

        <aside className="side-panel">
          <div className="mini-card highlight">
            <p className="label">Top match</p>
            <h4>Mocha & Miso</h4>
            <span>Bonded pair • Ready now</span>
          </div>

          <div className="mini-card">
            <p className="label">Nearby shelters</p>
            <ul>
              <li>Happy Tails Rescue</li>
              <li>Paw Haven Studio</li>
              <li>Little Bark Collective</li>
            </ul>
          </div>

          <div className="mini-card">
            <p className="label">Latest wins</p>
            <div className="story-list">
              <div>
                <strong>{matchSummary.liked + matchSummary.superliked}</strong>
                <span>new hearts matched</span>
              </div>
              <div>
                <strong>{user.isAuthenticated ? 'Live' : '2.1k'}</strong>
                <span>{user.isAuthenticated ? 'profile active' : 'successful handoffs'}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {activePet && (
        <div className="modal" onClick={() => onSetActivePet(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => onSetActivePet(null)} aria-label="Close details">×</button>
            <div className="modal-content">
              <img src={activePet.image} alt={activePet.name} />
              <div className="modal-text">
                <h3>{activePet.name}</h3>
                <div className="muted">{activePet.type} • {activePet.age} • {activePet.city}</div>
                <div className="detail-row">
                  {(activePet.tags || []).map((tag) => (
                    <span key={tag} className="detail-tag">{tag}</span>
                  ))}
                </div>
                <p>{activePet.bio}</p>
                <p><strong>Story:</strong> {activePet.story}</p>
                <div className="modal-actions">
                  <button className="secondary-btn" onClick={() => onSetActivePet(null)}>Maybe later</button>
                  <button className="primary-btn" onClick={() => { onSetActivePet(null); onDecision('like', activePet); }}>
                    Adopt now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DashboardPage({ user, matchSummary }) {
  return (
    <section className="dashboard" id="dashboard">
      <div className="section-heading">
        <div>
          <p className="label">Dashboard</p>
          <h3>{user.isAuthenticated ? `Welcome back, ${user.name}` : 'Create your adoption dashboard'}</h3>
        </div>
        <NavLink className="primary-btn" to={user.isAuthenticated ? '/match' : '/signup'}>
          {user.isAuthenticated ? 'Visit matches' : 'Create account'}
        </NavLink>
      </div>

      <div className="dashboard-grid">
        <article className="stat-card highlight">
          <span>Saved pets</span>
          <strong>{matchSummary.liked + matchSummary.superliked || 3}</strong>
          <small>Favorites this week</small>
        </article>
        <article className="stat-card">
          <span>Application status</span>
          <strong>In review</strong>
          <small>2 pending meet-and-greets</small>
        </article>
        <article className="stat-card">
          <span>Foster matches</span>
          <strong>4</strong>
          <small>Homes ready to welcome</small>
        </article>
      </div>
    </section>
  );
}

function AuthPage({ mode, onSubmit, authError }) {
  return (
    <section className="auth-shell">
      <div className="modal-card auth-card">
        <div className="auth-panel">
          <div className="auth-illustration">
            <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80" alt="Happy dog" />
          </div>
          <div className="modal-text">
            <p className="label">{mode === 'signup' ? 'Create your profile' : 'Welcome back'}</p>
            <h3>{mode === 'signup' ? 'Sign up to adopt' : 'Log in to continue'}</h3>
            <form className="auth-form" onSubmit={(event) => onSubmit(event, mode)}>
              {mode === 'signup' && (
                <label>
                  Full name
                  <input type="text" name="name" placeholder="Your full name" />
                </label>
              )}
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" />
              </label>
              <label>
                Password
                <input type="password" name="password" placeholder="••••••••" />
              </label>
              {authError && <p className="auth-error">{authError}</p>}
              <button type="submit" className="primary-btn full-width">
                {mode === 'signup' ? 'Create account' : 'Continue'}
              </button>
            </form>
            <p className="auth-toggle">
              {mode === 'signup' ? 'Already have an account?' : "Need an account?"}{' '}
              <NavLink to={mode === 'signup' ? '/login' : '/signup'}>
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
