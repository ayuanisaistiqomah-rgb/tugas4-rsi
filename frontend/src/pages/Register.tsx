import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getFieldIssues } from '../lib/api'
import { AlertBox } from '../components/ui'
import type { FieldIssue } from '../types/api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [issues, setIssues] = useState<FieldIssue[]>([])

  function issueFor(field: string): string | undefined {
    return issues.find((issue) => issue.field === field)?.message
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIssues([])

    try {
      await register({ name, email, password })
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (caughtError) {
      setIssues(getFieldIssues(caughtError))
      setError(getErrorMessage(caughtError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand'

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-extrabold">Daftar</h1>
      <p className="mt-1 text-sm text-muted">Akun baru otomatis berperan sebagai customer.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        {error && <AlertBox message={error} />}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold">
            Nama
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          {issueFor('name') && <p className="mt-1 text-xs text-danger">{issueFor('name')}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          {issueFor('email') && <p className="mt-1 text-xs text-danger">{issueFor('email')}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">Minimal 8 karakter.</p>
          {issueFor('password') && (
            <p className="mt-1 text-xs text-danger">{issueFor('password')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="text-center text-sm text-muted">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-brand">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  )
}