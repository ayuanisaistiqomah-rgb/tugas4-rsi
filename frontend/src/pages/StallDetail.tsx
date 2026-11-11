import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Flame, MapPin, Pencil, Utensils } from 'lucide-react'
import { stallApi, getErrorMessage, isNotFound } from '../lib/api'
import { formatRupiah } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { canEditStall } from '../lib/permissions'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../components/ui'
import type { MenuItem, Stall } from '../types/api'

export default function StallDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [stall, setStall] = useState<Stall | null>(null)
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadData(): Promise<void> {
      setIsLoading(true)
      setError(null)
      setNotFound(false)

      try {
        const [stallData, menuData] = await Promise.all([
          stallApi.detail(Number(id)),
          stallApi.menus(Number(id)),
        ])
        if (cancelled) return
        setStall(stallData)
        setMenus(menuData)
      } catch (caughtError) {
        if (cancelled) return
        if (isNotFound(caughtError)) setNotFound(true)
        else setError(getErrorMessage(caughtError))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  if (isLoading) return <LoadingPanel message="Memuat detail warung..." />

  if (notFound) {
    return (
      <EmptyPanel
        title="Warung tidak ditemukan"
        description="Warung yang kamu cari tidak ada atau sudah dihapus."
        action={
          <Link to="/" className="text-sm font-bold text-brand">
            Kembali ke daftar
          </Link>
        }
      />
    )
  }

  if (error) {
    return <ErrorPanel message={error} onRetry={() => setReloadKey((current) => current + 1)} />
  }

  if (!stall) return null

  return (
    <div>
      {/* Header besar */}
      <section className="relative overflow-hidden rounded-[2rem] bg-sky px-6 py-6 sm:px-8 sm:py-7">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-white/50"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-1/3 h-40 w-40 rounded-full bg-amber-200/70"
          aria-hidden="true"
        />

        <div className="relative">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Kembali ke daftar
          </Link>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
                {stall.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {stall.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink">
                    <MapPin size={14} aria-hidden="true" /> {stall.location}
                  </span>
                )}
                {stall.category && (
                  <span className="rounded-full bg-amber-200 px-3 py-1 text-sm font-semibold text-amber-900">
                    {stall.category}
                  </span>
                )}
                {stall.isPopular && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-amber-700">
                    <Flame size={14} aria-hidden="true" /> Populer
                  </span>
                )}
              </div>
            </div>

            <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full bg-amber-300 text-center text-ink">
              <span className="text-4xl font-extrabold leading-none">
                {stall.avgRating.toFixed(1)}
              </span>
              <span className="mt-1 text-xs font-medium">dari {stall.reviewCount} ulasan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dua kolom */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-5">
        {/* Kiri */}
        <div className="space-y-4 lg:col-span-2">
          <article className="rounded-3xl bg-amber-200 p-6">
            <h2 className="text-sm font-bold text-amber-900">Tentang warung</h2>
            <p className="mt-1 text-lg font-semibold leading-snug text-ink">
              {stall.description ?? 'Belum ada deskripsi.'}
            </p>
          </article>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white p-5">
              <p className="text-3xl font-extrabold text-ink">{menus.length}</p>
              <p className="text-sm text-brand-dark">menu</p>
            </div>
            <div className="rounded-3xl bg-white p-5">
              <p className="text-3xl font-extrabold text-ink">{stall.reviewCount}</p>
              <p className="text-sm text-brand-dark">ulasan</p>
            </div>
          </div>

          {canEditStall(user, stall) && (
            <Link
              to={`/stalls/${stall.id}/edit`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <Pencil size={15} aria-hidden="true" /> Ubah warung ini
            </Link>
          )}
        </div>

        {/* Kanan: papan menu */}
        <section className="rounded-3xl bg-white p-6 shadow-[0_6px_0_0_theme(colors.sky)] lg:col-span-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-brand-dark">
              <Utensils size={18} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-extrabold text-ink">Menu</h2>
          </div>

          {menus.length === 0 ? (
            <div className="mt-4">
              <EmptyPanel title="Belum ada menu" description="Warung ini belum menambahkan menu." />
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {menus.map((menu, index) => (
                <li key={menu.id} className="flex items-center gap-3 text-base">
                  <span
                    className={
                      menu.isAvailable ? 'font-medium text-ink' : 'text-muted line-through'
                    }
                  >
                    {menu.name}
                  </span>
                  <span
                    className="min-w-6 flex-1 border-b-2 border-dotted border-ink/20"
                    aria-hidden="true"
                  />
                  {!menu.isAvailable && (
                    <span className="rounded-full bg-border px-2 py-0.5 text-xs text-muted">
                      Habis
                    </span>
                  )}
                  <span
                    className={`shrink-0 rounded-lg px-3 py-1 text-sm font-bold ${
                      index % 2 === 0
                        ? 'bg-sky text-brand-dark'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {formatRupiah(menu.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}