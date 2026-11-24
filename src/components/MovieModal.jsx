import { useEffect, useState } from 'react'
import { Bookmark, CalendarDays, Clock3, ExternalLink, Heart, Play, Star, X } from 'lucide-react'
import { imageUrl, tmdb } from '../lib/tmdb'

export default function MovieModal({ movie, onClose, isFavourite, isWatchLater, onFavourite, onWatchLater, userRating, onRate }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    setDetails(null)
    setLoading(true)
    tmdb(`/movie/${movie.id}`, { append_to_response: 'videos' })
      .then(data => { if (active) setDetails(data) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [movie.id])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  const info = details || movie
  const trailer = details?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040d]/85 px-3 py-5 backdrop-blur-md" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-label={`${movie.title} details`} className="modal-scroll relative max-h-[94vh] w-full max-w-[760px] overflow-y-auto rounded-[24px] border border-white/10 bg-[#11152c] shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-[#101328]/85 p-2 text-white hover:bg-[#303455]" aria-label="Close details"><X size={21}/></button>
        <div className="relative h-52 bg-[#202744] sm:h-72">
          {info.backdrop_path ? <img className="h-full w-full object-cover" src={imageUrl(info.backdrop_path, 'w1280')} alt="" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11152c] via-[#11152c]/20 to-transparent" />
        </div>
        <div className="relative px-6 pb-7 sm:px-9">
          <div className="-mt-12 flex items-end gap-5 sm:-mt-20">
            <div className="hidden h-44 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-[#151936] shadow-lg sm:block">{info.poster_path && <img className="h-full w-full object-cover" src={imageUrl(info.poster_path)} alt="" />}</div>

            <div className="min-w-0 pb-1">
              <div className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#b2a0ff]">Movie details</div>
              <h2 className="text-2xl font-extrabold text-white sm:text-4xl">{movie.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#b4bbd5]">
                <span className="flex items-center gap-1">
                  <Star size={15} className="fill-amber-400 text-amber-400" /> {Number(movie.vote_average || 0).toFixed(1)} / 10</span>
                <span className="flex items-center gap-1"><CalendarDays size={15}/>{movie.release_date?.slice(0,4) || 'TBA'}</span>{info.runtime && <span className="flex items-center gap-1"><Clock3 size={15}/>{info.runtime} min</span>}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">{info.genres?.map(g => <span key={g.id} className="rounded-full border border-[#42456b] px-3 py-1 text-xs text-[#c5c9e2]">{g.name}</span>)}</div>
          <p className="mt-5 text-[14px] leading-7 text-[#b8bfd9]">{info.overview || 'No description is available for this movie yet.'}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {trailer && <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="primary-button"><Play size={16} fill="currentColor" /> Watch trailer <ExternalLink size={13}/></a>}
            <button onClick={() => onFavourite(movie)} className={`outline-button ${isFavourite ? 'selected' : ''}`}><Heart size={16} fill={isFavourite ? 'currentColor' : 'none'}/>{isFavourite ? 'Favourited' : 'Favourite'}</button>
            <button onClick={() => onWatchLater(movie)} className={`outline-button ${isWatchLater ? 'selected' : ''}`}><Bookmark size={16} fill={isWatchLater ? 'currentColor' : 'none'}/>{isWatchLater ? 'In Watch Later' : 'Watch Later'}</button>
          </div>
          <div className="mt-7 border-t border-white/10 pt-5"><h3 className="text-sm font-bold text-white">Your rating <span className="font-normal text-[#858eac]">(saved on this device)</span></h3><div className="mt-3 flex flex-wrap gap-1">{Array.from({ length: 10 }, (_, i) => i + 1).map(n => <button key={n} aria-label={`Rate ${n} out of 10`} title={`${n}/10`} onClick={() => onRate(movie.id, userRating === n ? 0 : n)} className={`rounded-md p-1 transition hover:scale-110 ${n <= userRating ? 'text-amber-400' : 'text-[#586080] hover:text-amber-300'}`}><Star size={22} fill={n <= userRating ? 'currentColor' : 'none'} /></button>)}<span className="ml-2 self-center text-sm text-[#c4c9e2]">{userRating ? `${userRating}/10` : 'Not rated'}</span></div></div>
          {loading && <p className="mt-4 text-xs text-[#8b92ae]">Loading additional movie information...</p>}
          <div className="mt-6 text-xs text-[#757f9f]">Movie information provided by TMDB. This product is not endorsed or certified by TMDB.</div>
        </div>
      </div>
    </div>
  )
}
