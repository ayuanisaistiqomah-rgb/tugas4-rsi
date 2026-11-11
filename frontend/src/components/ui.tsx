import { Loader2, AlertCircle, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export function LoadingPanel({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-14 text-center"
    >
      <Loader2 className="h-8 w-8 animate-spin text-brand" aria-hidden="true" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  )
}

export function ErrorPanel({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-14 text-center"
    >
      <AlertCircle className="h-8 w-8 text-danger" aria-hidden="true" />
      <p className="font-bold">Terjadi masalah</p>
      <p className="text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}

export function EmptyPanel({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-14 text-center">
      <Inbox className="h-8 w-8 text-muted" aria-hidden="true" />
      <p className="font-bold">{title}</p>
      {description && <p className="text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}

export function AlertBox({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      {message}
    </p>
  )
}