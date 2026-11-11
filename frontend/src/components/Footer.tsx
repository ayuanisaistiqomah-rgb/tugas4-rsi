import { Utensils } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 bg-sky">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-dark">
            <Utensils size={18} aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold text-ink">
            Lapar<span className="text-brand-dark">.in</span>
          </span>
        </div>
        <p className="max-w-sm text-sm text-brand-dark">
          Lihat warung, menu, dan rating dari teman-teman kampus sebelum kamu antre.
        </p>
      </div>

      <div className="border-t border-ink/10 py-3 text-center text-xs text-brand-dark">
        © {new Date().getFullYear()} Lapar.in. Semua hak dilindungi.
      </div>
    </footer>
  )
}