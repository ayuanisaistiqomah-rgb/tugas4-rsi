import { Link } from 'react-router-dom'
import { EmptyPanel } from '../components/ui'

export function Forbidden() {
  return (
    <EmptyPanel
      title="403: Akses ditolak"
      description="Akunmu tidak punya izin untuk membuka halaman ini."
      action={
        <Link to="/" className="text-sm font-bold text-brand">
          Kembali ke beranda
        </Link>
      }
    />
  )
}

export function NotFound() {
  return (
    <EmptyPanel
      title="404: Halaman tidak ditemukan"
      action={
        <Link to="/" className="text-sm font-bold text-brand">
          Kembali ke beranda
        </Link>
      }
    />
  )
}