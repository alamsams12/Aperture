// All TMDB requests live here, so the React components stay easy to read.
const API_BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
export const hasApiKey = Boolean(API_KEY && API_KEY !== 'your_tmdb_api_key_here')

export function imageUrl(path, size = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
}

export async function tmdb(path, params = {}) {
  if (!hasApiKey) throw new Error('Add your TMDB API key to the .env file to see live movies.')
  const url = new URL(`${API_BASE}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 401) throw new Error('TMDB rejected the API key. Check the value in your .env file.')
    throw new Error(`TMDB request failed (${response.status}). Please try again.`)
  }
  return response.json()
}

export const categories = {
  trending: { label: 'Trending now', endpoint: '/trending/movie/week', description: 'What everyone is watching this week' },
  popular: { label: 'Popular movies', endpoint: '/movie/popular', description: 'The movies everyone is talking about' },
  top_rated: { label: 'Top rated', endpoint: '/movie/top_rated', description: 'Critically acclaimed and fan favourites' },
  upcoming: { label: 'Coming soon', endpoint: '/movie/upcoming', description: 'Your next big-screen obsessions' },
  now_playing: { label: 'Now playing', endpoint: '/movie/now_playing', description: 'Fresh arrivals in cinemas' },
}

export const genres = [
  { id: 0, name: 'All genres' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' }, { id: 14, name: 'Fantasy' }, { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
]
