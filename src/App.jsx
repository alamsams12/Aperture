import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, ChevronDown, Clapperboard, Compass, Film, Heart, Home, Menu, Play, Search, Sparkles, Star, TrendingUp, X } from 'lucide-react'
import MovieCard from './components/MovieCard'
import MovieModal from './components/MovieModal'
import { categories, genres, hasApiKey, imageUrl, tmdb } from './lib/tmdb'
import { loadSaved, saveSaved } from './lib/storage'


const NAV = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'popular', name: 'Popular', icon: Compass },
  { id: 'top_rated', name: 'Top rated', icon: Star },
  { id: 'upcoming', name: 'Coming soon', icon: Sparkles },
  { id: 'favourites', name: 'Favourites', icon: Heart },
  { id: 'watchlater', name: 'Watch later', icon: Bookmark },
]

function SkeletonCards() {
  return <div className="movie-grid">{Array.from({ length: 12 }, (_, i) => <div key={i} className="animate-pulse"><div className="poster-wrap rounded-[16px] bg-[#1a2040]"/><div className="mt-3 h-4 w-3/4 rounded bg-[#1b2341]"/><div className="mt-2 h-3 w-1/2 rounded bg-[#1b2341]"/></div>)}</div>
}

function EmptyState({ icon: Icon = Film, title, description, onAction, action }) {
  return <div className="empty-state"><div className="mb-4 rounded-2xl bg-[#21274a] p-4 text-[#9d8cfa]"><Icon size={28} /></div><h3 className="text-xl font-bold text-white">{title}</h3><p className="mt-2 max-w-md text-center text-sm leading-6 text-[#949cb9]">{description}</p>{onAction && <button className="primary-button mt-6" onClick={onAction}>{action} <ArrowRight size={15}/></button>}</div>
}

export default function App() {
  const [section, setSection] = useState('home')
  const [movies, setMovies] = useState([])
  const [featured, setFeatured] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [genre, setGenre] = useState(0)
  const [selected, setSelected] = useState(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [favourites, setFavourites] = useState(() => loadSaved('favourites', []))
  const [watchLater, setWatchLater] = useState(() => loadSaved('watchlater', []))
  const [ratings, setRatings] = useState(() => loadSaved('ratings', {}))
  const [heroIndex, setHeroIndex] = useState(0)
  
  useEffect(() => { saveSaved('favourites', favourites) }, [favourites])
  useEffect(() => { saveSaved('watchlater', watchLater) }, [watchLater])
  useEffect(() => { saveSaved('ratings', ratings) }, [ratings])

  useEffect(() => {
    if (!hasApiKey) return
    let alive = true
    tmdb('/trending/movie/week').then(data => { if (alive) setFeatured(data.results.filter(m => m.backdrop_path).slice(0, 5)) }).catch(() => {})
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (section === 'favourites' || section === 'watchlater') return
    let alive = true
    setLoading(true)
    setError('')
    setMovies([])
    const params = { page }
    let endpoint = categories[section === 'home' ? 'trending' : section]?.endpoint
    if (searchQuery) { endpoint = '/search/movie'; params.query = searchQuery }
    else if (genre) { endpoint = '/discover/movie'; params.with_genres = genre; params.sort_by = 'popularity.desc' }
    tmdb(endpoint, params).then(data => { if (alive) { setMovies(data.results || []); setTotalPages(Math.min(data.total_pages || 1, 500)) } })
      .catch(err => { if (alive) setError(err.message) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [section, page, genre, searchQuery])

  const savedList = section === 'favourites' ? favourites : watchLater
  const visibleMovies = section === 'favourites' || section === 'watchlater'
    ? savedList.filter(m => (!searchQuery || m.title?.toLowerCase().includes(searchQuery.toLowerCase())) && (!genre || m.genre_ids?.includes(genre)))
    : movies
  const hero = featured[heroIndex] || movies.find(m => m.backdrop_path)
  const title = searchQuery ? `Results for “${searchQuery}”` : section === 'favourites' ? 'My favourites' : section === 'watchlater' ? 'Watch later' : genre ? `${genres.find(g => g.id === genre)?.name} movies` : categories[section === 'home' ? 'trending' : section]?.label
  const subtitle = searchQuery ? 'Discover what matches your search' : section === 'favourites' ? 'All the movies you love, in one place' : section === 'watchlater' ? 'Your queue for the perfect movie night' : categories[section === 'home' ? 'trending' : section]?.description

  function navigate(next) {
    setSection(next); setSearchInput(''); setSearchQuery(''); setGenre(0); setPage(1); setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function performSearch(e) {
    e.preventDefault()
    setSearchQuery(searchInput.trim()); setGenre(0); setPage(1)
    if (searchInput.trim() && ['favourites', 'watchlater'].includes(section)) setSection('home')
  }
  function toggle(collectionSetter, movie) {
    collectionSetter(prev => prev.some(m => m.id === movie.id) ? prev.filter(m => m.id !== movie.id) : [movie, ...prev])
  }
  const isFavourite = movie => favourites.some(m => m.id === movie.id)
  const isWatchLater = movie => watchLater.some(m => m.id === movie.id)
  const activeSaved = useMemo(() => new Set([...favourites.map(m => m.id), ...watchLater.map(m => m.id)]), [favourites, watchLater])

  return <div className="min-h-screen bg-[#080b1b] text-white">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <button className="absolute right-4 top-5 text-[#a6abc7] md:hidden" aria-label="Close menu" onClick={() => setMobileMenu(false)}><X size={22}/></button>
      <button className="flex items-center gap-3 px-3 pt-2 text-left" onClick={() => navigate('home')}>
        <div className="logo-mark"><Clapperboard size={23} strokeWidth={2.6}/></div>
        <h1><span className="text-gradient text-2xl font-extrabold">APERTURE</span></h1>
      </button>
      <div className="mt-12 px-3 text-[12px] font-bold uppercase tracking-[.2em] text-white">Discover</div>
      <nav className="mt-4 space-y-1" aria-label="Main navigation">
        {NAV.slice(0, 5).map(({ id, name, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`nav-item ${section === id ? 'nav-active' : ''}`}><Icon size={18}/><span>{name}</span>{section === id && <span className="ml-auto h-[6px] w-[6px] rounded-full bg-[#ab94ff]"/>}</button>)}
      </nav>
      <div className="mt-9 px-3 text-[12px] font-bold uppercase tracking-[.2em] text-white">My collection</div>
      <nav className="mt-4 space-y-1" aria-label="Saved movies">
        {NAV.slice(5).map(({ id, name, icon: Icon }) => 
        <button key={id} onClick={() => navigate(id)} className={`nav-item ${section === id ? 'nav-active' : ''}`}>
          <Icon size={18}/>
          <span>{name}</span>
          <span className="ml-auto rounded-md bg-[#1c2341] px-2 py-[2px] text-[11px] text-white">{id ===  'favourites' ? favourites.length : watchLater.length}
            </span>
          </button>)}
      </nav>
      <div className="mt-auto px-2 pb-3 pt-9"><div className="sidebar-tip"><Sparkles size={21} className="text-[#c4b4ff]"/><p className="mt-3 text-sm font-bold text-white">Your next favourite is waiting.</p><p className="mt-1 text-xs leading-5 text-[#aeb5d4]">Explore incredible stories, one movie at a time.</p><button className="mt-4 flex items-center gap-2 text-xs font-bold text-[#c3b1ff]" onClick={() => navigate('popular')}>Explore movies <ArrowRight size={14}/></button></div></div>
    </aside>
    {mobileMenu && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMobileMenu(false)}/>}
    <main className="main-content">
      <header className="topbar">
        <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-white md:hidden" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu size={21}/></button><div className="hidden text-[13px] text-[#a4aac5] lg:block">Explore the world of cinema <span className="ml-1">✦</span></div><div className="font-display text-xl font-bold md:hidden">cine<span className="text-[#a58cfa]">verse</span></div></div>
        <div className="flex items-center gap-4"><form onSubmit={performSearch} className="search-field"><Search size={17} className="shrink-0 text-[#828eaf]"/><input aria-label="Search movies" placeholder="Search movies..." value={searchInput} onChange={e => setSearchInput(e.target.value)}/><button aria-label="Submit search" type="submit" className="hidden text-xs text-[#a995f8] sm:block">↵</button></form><button className="avatar" onClick={() => navigate('favourites')} title="My favourites"><Heart size={17}/></button></div>
      </header>
      <div className="page-container">
        {section === 'home' && !searchQuery && !genre && hero && <section className="hero relative overflow-hidden rounded-[23px] border border-white/[.06]">
          <img src={imageUrl(hero.backdrop_path, 'w1280')} alt="" className="absolute inset-0 h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#101329] via-[#101329]/80 to-transparent"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#11162a]/90 via-transparent to-transparent"/>
          <div className="relative flex h-full max-w-[580px] flex-col justify-center px-7 py-10 sm:px-12">
            <span className="mb-5 flex w-fit items-center gap-2 rounded-full border border-[#a68afc]/40 bg-[#a68afc]/15 px-3 py-[7px] text-[11px] font-bold uppercase tracking-[.14em] text-[#d2c5ff]"><Sparkles size={13}/> Featured this week</span>
            <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{hero.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#ced2e4]"><span className="flex items-center gap-1 text-amber-300"><Star size={15} fill="currentColor"/> {hero.vote_average?.toFixed(1)}</span><span>{hero.release_date?.slice(0,4) || 'TBA'}</span><span>Movie</span></div>

            <p className="mt-4 line-clamp-3 max-w-[460px] text-sm leading-7 text-[#c7cbdf]">{hero.overview || 'Discover your next favourite movie.'}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="primary-button" onClick={() => setSelected(hero)}><Play size={16} fill="currentColor"/> Explore movie</button><button className="outline-button bg-white/10 backdrop-blur" onClick={() => toggle(setWatchLater, hero)}><Bookmark size={16} fill={isWatchLater(hero) ? 'currentColor' : 'none'}/>{isWatchLater(hero) ? 'Saved' : 'Watch later'}</button>
              </div>
          </div>
          {featured.length > 1 && <div className="absolute bottom-5 right-6 hidden items-center gap-2 sm:flex">{featured.map((m, i) => <button key={m.id} aria-label={`Show featured movie ${i+1}`} onClick={() => setHeroIndex(i)} className={`h-[5px] rounded-full transition-all ${heroIndex === i ? 'w-7 bg-[#bdabff]' : 'w-2 bg-white/40'}`}/>)}</div>}
        </section>}
        {section === 'home' && !searchQuery && !genre && <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#282b4d] bg-[#11162c] px-5 py-4">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-[#28204d] p-2.5 text-[#ac96ff]"><Clapperboard size={20}/></div><div><div className="text-sm font-bold text-white">Movies you'll love</div>
          <p className="mt-1 text-xs text-[#8993b2]">Browse, save, and make every movie night count.</p>
          </div></div>
          <button className="text-xs font-bold text-[#b5a1ff] hover:text-white" onClick={() => navigate('top_rated')}>View top rated <ArrowRight className="inline" size={14}/></button></div>}
        <section className="mt-10 pb-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-[#a28dff]"><span className="h-[6px] w-[6px] rounded-full bg-[#a28dff]"/> {searchQuery ? 'Search' : section === 'favourites' || section === 'watchlater' ? 'Your space' : 'Discover'}</div><h2 className="font-display text-[25px] font-extrabold tracking-tight sm:text-[30px]">{title}</h2><p className="mt-1 text-[13px] text-[#8d96b5]">{subtitle}</p></div><div className="relative"><select aria-label="Filter by genre" className="genre-select" value={genre} onChange={e => { setGenre(Number(e.target.value)); setPage(1) }}>{genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#a9b1ce]" size={14}/></div></div>
          {error ? <EmptyState icon={Film} title="Couldn't load movies" description={error} onAction={() => window.location.reload()} action="Try again" />
            : loading ? <SkeletonCards/>
            : visibleMovies.length ? <div className="movie-grid">{visibleMovies.map(movie => <MovieCard key={movie.id} movie={movie} onOpen={setSelected} isFavourite={isFavourite(movie)} isWatchLater={isWatchLater(movie)} onFavourite={m => toggle(setFavourites, m)} onWatchLater={m => toggle(setWatchLater, m)}/>)}</div>
            : section === 'favourites' ? <EmptyState icon={Heart} title="No favourites yet" description="Tap the heart on any movie poster to save it here." onAction={() => navigate('trending')} action="Discover movies" />
            : section === 'watchlater' ? <EmptyState icon={Bookmark} title="Your watchlist is empty" description="Found something interesting? Save it for movie night using the bookmark button." onAction={() => navigate('popular')} action="Find movies" />
            : <EmptyState icon={Search} title={hasApiKey ? 'No movies found' : 'Connect your TMDB API key'} description={hasApiKey ? 'Try another search or choose a different genre.' : 'Open the README and follow the setup instructions to connect live movie data.'} onAction={() => { setSearchInput(''); setSearchQuery(''); setGenre(0) }} action="Clear filters" />}
          {!loading && !error && visibleMovies.length > 0 && !['favourites', 'watchlater'].includes(section) && totalPages > 1 && <div className="mt-10 flex items-center justify-center gap-3">
            <button className="pagination-button" disabled={page <= 1} onClick={() => { setPage(n => n - 1); window.scrollTo({ top: 500, behavior: 'smooth' }) }}><ArrowLeft size={16}/></button><span className="px-3 text-sm text-[#aab3d0]">Page <strong className="text-white">{page}</strong> of {totalPages}</span><button className="pagination-button" disabled={page >= totalPages} onClick={() => { setPage(n => n + 1); window.scrollTo({ top: 500, behavior: 'smooth' }) }}><ArrowRight size={16}/></button></div>}
        </section>
        <footer className="flex flex-col justify-between gap-3 border-t border-[#232744] py-6 text-[11px] text-[#7883a3] sm:flex-row"><span>© {new Date().getFullYear()} Cineverse. Made for movie lovers.</span><span>Movie data by <a className="text-[#b0a0fa] hover:underline" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a> · Not endorsed or certified by TMDB.</span></footer>
      </div>
    </main>
    {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} isFavourite={isFavourite(selected)} isWatchLater={isWatchLater(selected)} onFavourite={m => toggle(setFavourites, m)} onWatchLater={m => toggle(setWatchLater, m)} userRating={ratings[selected.id] || 0} onRate={(id, value) => setRatings(prev => ({ ...prev, [id]: value }))} />}
  </div>
}
