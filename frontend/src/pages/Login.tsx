import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'
import { AlertBox } from '../components/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const justRegistered = (location.state as { registered?: boolean } | null)?.registered

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login({ email, password })
      const redirect = searchParams.get('redirect')
      navigate(redirect && redirect.startsWith('/') ? redirect : '/', { replace: true })
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand'

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-extrabold">Masuk</h1>
      <p className="mt-1 text-sm text-muted">Masuk untuk mengelola warung.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        {justRegistered && !error && (
          <p role="status" className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
            Registrasi berhasil. Silakan masuk.
          </p>
        )}
        {error && <AlertBox message={error} />}

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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="text-center text-sm text-muted">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-brand">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  )
}