import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Flame, MapPin, Pencil, Search, Sparkles, Trash2 } from 'lucide-react'
import { stallApi, getErrorMessage } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { canDeleteStall, canEditStall } from '../lib/permissions'
import { AlertBox, EmptyPanel, ErrorPanel, LoadingPanel } from '../components/ui'
import type { PageMeta, Stall } from '../types/api'

const LIMIT = 6
const CATEGORIES = ['Nasi', 'Bakso', 'Mie', 'Kwetiau', 'Minuman', 'Western', 'Sate', 'Soto']

const TONES = [
  {
    edge: 'border-l-sky',
    avatar: 'bg-sky text-brand-dark',
    rating: 'rotate-3 bg-sun text-sun-deep',
    tag: 'bg-brand-soft text-brand-dark',
  },
  {
    edge: 'border-l-sun',
    avatar: 'bg-sun text-sun-deep',
    rating: '-rotate-3 bg-sky text-brand-dark',
    tag: 'bg-sun/40 text-sun-deep',
  },
]

export default function StallList() {
  const { user } = useAuth()
  const [stalls, setStalls] = useState<Stall[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadData(): Promise<void> {
      setIsLoading(true)
      setError(null)

      try {
        const result = await stallApi.list({
          search: keyword || undefined,
          category: category || undefined,
          page,
          limit: LIMIT,
        })
        if (cancelled) return
        setStalls(result.data)
        setMeta(result.meta)
      } catch (caughtError) {
        if (!cancelled) setError(getErrorMessage(caughtError))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [keyword, category, page, reloadKey])

  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1
  const isFiltering = Boolean(keyword || category)

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setPage(1)
    setKeyword(search.trim())
  }

  function handleCategory(value: string) {
    setPage(1)
    setCategory(value)
  }

  function resetFilters() {
    setSearch('')
    setKeyword('')
    setCategory('')
    setPage(1)
  }

  async function handleDelete(stall: Stall) {
    if (!window.confirm(`Hapus warung "${stall.name}"?`)) return

    setActionError(null)
    try {
      await stallApi.remove(stall.id)
      // kalau yang dihapus satu-satunya data di halaman ini, mundur satu halaman
      if (stalls.length === 1 && page > 1) setPage(page - 1)
      else setReloadKey((current) => current + 1)
    } catch (caughtError) {
      setActionError(getErrorMessage(caughtError))
    }
  }

  const catBase = 'rounded-xl px-3 py-1.5 text-left text-sm font-semibold transition'
  const catOff = 'text-ink hover:bg-white/70'
  const catOn = 'bg-ink text-white'

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
      <aside className="rounded-3xl bg-sky p-5 lg:sticky lg:top-6">
        <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-bold text-brand-dark">
          <Sparkles size={14} aria-hidden="true" /> Lapar.in Kampus
        </span>
        <h1 className="mb-2 mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink">
          Cari makan, <span className="rounded-lg bg-sun px-1.5">gas</span> sekarang.
        </h1>
        <p className="mb-4 text-sm text-brand-dark">
          Lihat warung, menu, dan rating dari teman-teman kampus sebelum kamu antre.
        </p>

        <form onSubmit={handleSearch} className="flex items-center gap-1 rounded-2xl bg-white p-1.5">
          <Search size={18} className="ml-2 shrink-0 text-brand" aria-hidden="true" />
          <label htmlFor="stall-search" className="sr-only">
            Cari warung
          </label>
          <input
            id="stall-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama warung..."
            className="w-full min-w-0 bg-transparent px-1 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Cari
          </button>
        </form>

        {meta && (
          <div className="mt-4 flex gap-2">
            <div className="flex-1 rounded-2xl bg-white px-3 py-2">
              <p className="text-2xl font-extrabold leading-none">{meta.total}</p>
              <p className="text-xs text-muted">warung</p>
            </div>
            <div className="flex-1 rounded-2xl bg-white px-3 py-2">
              <p className="text-2xl font-extrabold leading-none">{CATEGORIES.length}</p>
              <p className="text-xs text-muted">kategori</p>
            </div>
          </div>
        )}

        <p className="mb-2 mt-5 text-xs font-bold text-brand-dark">Kategori</p>
        <div
          className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1"
          role="group"
          aria-label="Filter kategori"
        >
          <button
            type="button"
            onClick={() => handleCategory('')}
            className={`${catBase} ${category === '' ? catOn : catOff}`}
          >
            Semua
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleCategory(item)}
              className={`${catBase} ${category === item ? catOn : catOff}`}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0">
        {actionError && (
          <div className="mb-4">
            <AlertBox message={actionError} />
          </div>
        )}

        {isLoading ? (
          <LoadingPanel message="Memuat daftar warung..." />
        ) : error ? (
          <ErrorPanel message={error} onRetry={() => setReloadKey((current) => current + 1)} />
        ) : stalls.length === 0 ? (
          <EmptyPanel
            title={isFiltering ? 'Warung tidak ditemukan' : 'Belum ada warung'}
            description={
              isFiltering ? 'Coba kata kunci atau kategori lain.' : 'Data warung akan muncul di sini.'
            }
            action={
              isFiltering ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  Reset pencarian
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <p className="mb-3 px-1 text-sm text-muted">
              Menampilkan <span className="font-semibold text-text">{stalls.length}</span> dari{' '}
              <span className="font-semibold text-text">{meta?.total ?? stalls.length}</span> warung
            </p>

            <div className="flex flex-col gap-3">
              {stalls.map((stall, index) => {
                const tone = TONES[index % 2]

                return (
                  <article
                    key={stall.id}
                    className={`flex flex-wrap items-center gap-3 rounded-3xl border-l-[6px] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-nowrap ${tone.edge}`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold ${tone.avatar}`}
                    >
                      {stall.name.charAt(0).toUpperCase()}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-extrabold">{stall.name}</h2>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        {stall.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} aria-hidden="true" /> {stall.location}
                          </span>
                        )}
                        {stall.category && (
                          <span className={`rounded-md px-2 py-0.5 font-bold ${tone.tag}`}>
                            {stall.category}
                          </span>
                        )}
                        {stall.isPopular && (
                          <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 font-bold text-amber-700">
                            <Flame size={12} aria-hidden="true" /> Populer
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-ink/80">
                        {stall.description ?? 'Belum ada deskripsi.'}
                        <span className="text-muted"> · {stall.reviewCount} ulasan</span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-xl px-3 py-1.5 text-center ${tone.rating}`}>
                        <span className="block text-lg font-extrabold leading-none">
                          {stall.avgRating.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-semibold">rating</span>
                      </span>

                      <Link
                        to={`/stalls/${stall.id}`}
                        className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
                      >
                        Detail
                      </Link>
                      {canEditStall(user, stall) && (
                        <Link
                          to={`/stalls/${stall.id}/edit`}
                          title="Ubah warung"
                          aria-label={`Ubah ${stall.name}`}
                          className="rounded-xl border border-border p-2.5 text-muted transition hover:bg-brand-soft hover:text-brand-dark"
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </Link>
                      )}
                      {canDeleteStall(user) && (
                        <button
                          type="button"
                          onClick={() => handleDelete(stall)}
                          title="Hapus warung"
                          aria-label={`Hapus ${stall.name}`}
                          className="rounded-xl border border-border p-2.5 text-danger transition hover:bg-danger/10"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-xl border border-border bg-white px-5 py-2 font-semibold text-muted transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <span className="text-muted">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-xl border border-border bg-white px-5 py-2 font-semibold text-muted transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}