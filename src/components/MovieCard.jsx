import { Bookmark, Heart, Play, Star } from 'lucide-react'
import { imageUrl } from '../lib/tmdb'

export default function MovieCard({ movie, isFavourite, isWatchLater, onOpen, onFavourite, onWatchLater }) {
  const year = movie.release_date?.slice(0, 4) || 'TBA'
  return (
    <article className="movie-card group min-w-0" onClick={() => onOpen(movie)} tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onOpen(movie) }} role="button" aria-label={`View ${movie.title} details`}>
      <div className="poster-wrap relative overflow-hidden rounded-[16px] bg-[#1b2140]">
        {movie.poster_path ? <img src={imageUrl(movie.poster_path)} alt={`${movie.title} poster`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]" />
          : <div className="flex h-full items-center justify-center p-6 text-center text-slate-400">No poster available</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b1b]/90 via-transparent to-transparent opacity-40 transition group-hover:opacity-90" />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-[#0c1025]/85 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          <Star size={12} className="fill-amber-400 text-amber-400" /> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100 max-md:opacity-100">
          <button aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'} title="Favourite" className={`poster-action ${isFavourite ? 'active' : ''}`} onClick={e => { e.stopPropagation(); onFavourite(movie) }}><Heart size={16} fill={isFavourite ? 'currentColor' : 'none'} /></button>
          <button aria-label={isWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'} title="Watch Later" className={`poster-action ${isWatchLater ? 'active' : ''}`} onClick={e => { e.stopPropagation(); onWatchLater(movie) }}><Bookmark size={16} fill={isWatchLater ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#15152c]"><Play size={13} fill="currentColor" /> View details</span>
        </div>
      </div>
      <div className="pt-3">
        <h3 className="truncate text-[14px] font-bold text-[#f5f5ff] transition group-hover:text-[#bbabff]">{movie.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-[#8c93b1]"><span>{year}</span><span className="h-[3px] w-[3px] rounded-full bg-[#747b98]" /><span>Movie</span></div>
      </div>
    </article>
  )
}
