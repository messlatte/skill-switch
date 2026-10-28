import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

// Follow the system theme.
const media = window.matchMedia("(prefers-color-scheme: dark)")
const applyTheme = (dark: boolean) => document.documentElement.classList.toggle("dark", dark)
applyTheme(media.matches)
media.addEventListener("change", (e) => applyTheme(e.matches))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
