// Keep favourites, watch later, and personal ratings in this browser's localStorage.
export function loadSaved(key, fallback) {
  try {
    const value = localStorage.getItem(`cineverse_${key}`)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function saveSaved(key, value) {
  try { localStorage.setItem(`cineverse_${key}`, JSON.stringify(value)) }
  catch { /* e.g. private browsing with storage disabled */ }
}
