# Cineverse 🎬

A responsive, purple-blue movie discovery website built with **React, HTML, CSS, Tailwind CSS, JavaScript and Vite**. Powered by the TMDB API. Made to be easy to study, modify, and extend as a beginner.

## Features

- 🎥 Featured movie hero with selectable highlights
- 🔥 Trending, Popular, Top Rated, Coming Soon, and Now Playing categories
- 🔎 Search movies by title
- 🎭 Browse movies by genre
- ⭐ TMDB community ratings and your own personal 1–10 ratings
- ❤️ Save favourite movies
- 🔖 Save movies to Watch Later
- 🎬 Movie details popup with description, runtime, genres and YouTube trailer links (if TMDB provides one)
- 📱 Responsive desktop and mobile layouts
- 💾 Favourites, Watch Later and personal ratings persist in your browser using localStorage (no account required)
- 📃 Pagination, skeleton loading cards, and useful empty/error states

## Requirements

- **Node.js** version 20.19+ or 22.12+ (required by modern Vite versions)
- A free **TMDB v3 API key**: https://www.themoviedb.org/settings/api

## Start locally (Windows / VS Code)

1. Extract the project ZIP, then open the `cineverse` folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Install dependencies:

   ```bash
   npm install
   ```

4. In the project root, make a copy of `.env.example` named `.env`.
5. Replace `your_tmdb_api_key_here` with your actual **TMDB API Key (v3)** (not your account password).

   ```env
   VITE_TMDB_API_KEY=your_actual_key_here
   ```

6. Start the site:

   ```bash
   npm run dev
   ```

7. Open the localhost link shown by Vite (usually http://localhost:5173/).

**Important:** Restart `npm run dev` after changing `.env`.

## Production build

```bash
npm run build
npm run preview
```

`dist/` is the production-ready static build. It can be deployed to Vercel/Netlify.

## Easy-to-understand file guide

```text
cineverse/
├── index.html             # HTML entry point
├── .env.example           # Copy this to .env and add your API key
├── vite.config.js         # Vite + Tailwind configuration
├── src/
│   ├── main.jsx           # Starts React
│   ├── App.jsx            # Main layout, navigation, filters and state
│   ├── styles.css         # Tailwind import + custom theme styles
│   ├── components/
│   │   ├── MovieCard.jsx  # Poster card, ratings, save buttons
│   │   └── MovieModal.jsx # Details dialog and personal rating
│   └── lib/
│       ├── tmdb.js        # TMDB API calls, movie categories, genres
│       └── storage.js     # Local browser persistence
```

## How the app works

1. React's `useState` holds the current page, search term, movies and saved lists.
2. `useEffect` loads movies from the TMDB API when the category/search/page changes.
3. `MovieCard` displays each movie. Clicking it opens `MovieModal`.
4. Saved movies are stored as small movie objects in `localStorage`, so they remain after refreshing the page.
5. Your personal ratings are separate from the TMDB rating shown on the posters.

## Useful beginner exercises

1. Change the app name and the purple theme in `styles.css`.
2. Add a *Now Playing* entry to the sidebar (already supported by the API categories).
3. Add a sort dropdown (release date, popularity, rating) to genre discovery.
4. Add an Actors section using `/movie/{id}/credits`.
5. Add a Light / Dark theme toggle.

## Important security / deployment note

Vite's `VITE_` environment variables are visible to browser visitors after deployment. This is a **frontend-only learning project**, so your TMDB key is used client-side. Do not treat it as secret or put any private passwords in it. For a public production app where you need a secret token, route API calls through a backend/serverless function instead. Never commit `.env` to GitHub; `.gitignore` excludes it.

## Credits / attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Movie metadata, ratings and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). Review [TMDB terms and attribution requirements](https://developer.themoviedb.org/docs/faq) before public launch. Assets shown in the UI come from TMDB at runtime; the project does not bundle movie artwork.
