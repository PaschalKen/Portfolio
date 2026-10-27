// Namespaced so other apps on the same origin (e.g. localhost:3000) can't collide.
export const THEME_KEY = "pe-theme";

export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

// Runs in <head> before first paint so the stored theme never flashes.
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
