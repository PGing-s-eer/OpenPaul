import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

const Admin = lazy(() => import('./pages/Admin'))

function AdminFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-bg font-display text-sm text-muted">
      Chargement…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
