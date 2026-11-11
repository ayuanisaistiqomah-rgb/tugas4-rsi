import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { stallApi, getErrorMessage, getFieldIssues, isNotFound } from '../lib/api'
import { AlertBox, EmptyPanel, ErrorPanel, LoadingPanel } from '../components/ui'
import type { StallInput } from '../types/api'

type FieldErrors = Partial<Record<keyof StallInput, string>>

export default function StallForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<StallInput>({
    name: '',
    category: '',
    location: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!id) return

    stallApi
      .detail(Number(id))
      .then((stall) =>
        setForm({
          name: stall.name,
          category: stall.category ?? '',
          location: stall.location ?? '',
          description: stall.description ?? '',
        }),
      )
      .catch((caughtError) => {
        if (isNotFound(caughtError)) setNotFound(true)
        else setLoadError(getErrorMessage(caughtError))
      })
      .finally(() => setIsLoading(false))
  }, [id])

  function handleChange(field: keyof StallInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setSubmitError(null)
    setFieldErrors({})

    // field kosong dikirim sebagai null, bukan string kosong
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || null,
      location: form.location.trim() || null,
      description: form.description.trim() || null,
    }

    try {
      if (isEdit) await stallApi.update(Number(id), payload)
      else await stallApi.create(payload)
      navigate('/')
    } catch (caughtError) {
      // 400: pesan per field dari validasi backend. 403/404/dll: pesan umum.
      const issues = getFieldIssues(caughtError)
      if (issues.length > 0) {
        const next: FieldErrors = {}
        for (const issue of issues) {
          if (issue.field in form) next[issue.field as keyof StallInput] = issue.message
        }
        setFieldErrors(next)
      }
      setSubmitError(getErrorMessage(caughtError))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingPanel message="Memuat data warung..." />
  if (notFound) {
    return (
      <EmptyPanel
        title="Warung tidak ditemukan"
        action={
          <Link to="/" className="text-sm font-bold text-brand">
            Kembali ke daftar
          </Link>
        }
      />
    )
  }
  if (loadError) return <ErrorPanel message={loadError} />

  const inputClass =
    'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand'

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold">{isEdit ? 'Ubah Warung' : 'Tambah Warung'}</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        {submitError && <AlertBox message={submitError} />}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold">
            Nama warung
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-danger">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-semibold">
            Kategori
          </label>
          <input
            id="category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Contoh: Nasi, Bakso, Minuman"
            className={inputClass}
          />
          {fieldErrors.category && (
            <p className="mt-1 text-xs text-danger">{fieldErrors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-semibold">
            Lokasi
          </label>
          <input
            id="location"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Contoh: Kantin FKIP"
            className={inputClass}
          />
          {fieldErrors.location && (
            <p className="mt-1 text-xs text-danger">{fieldErrors.location}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-semibold">
            Deskripsi
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={inputClass}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-danger">{fieldErrors.description}</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link
            to="/"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}