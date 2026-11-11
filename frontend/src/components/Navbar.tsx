import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Plus, Utensils } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { canCreateStall } from '../lib/permissions'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-sun">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-dark">
            <Utensils size={18} aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold text-ink">
            Lapar<span className="text-brand-dark">.in</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-ink">
          {canCreateStall(user) && (
            <Link to="/stalls/new" className="flex items-center gap-1.5 hover:underline">
              <Plus size={16} aria-hidden="true" />
              Tambah Warung
            </Link>
          )}

          {user ? (
            <>
              <span className="flex items-center gap-2 rounded-xl bg-white/70 py-1 pl-1 pr-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky text-sm font-bold text-brand-dark">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-bold">{user.name}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                    {user.role}
                  </span>
                </span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 hover:underline"
              >
                <LogOut size={16} aria-hidden="true" />
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Masuk
              </Link>
              <Link to="/register" className="rounded-xl bg-ink px-4 py-2 text-white hover:bg-brand-dark">
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}