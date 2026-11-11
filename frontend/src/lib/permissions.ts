import type { Stall, User } from '../types/api'

export function canCreateStall(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'owner'
}

export function canEditStall(user: User | null, stall: Stall): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.role === 'owner' && stall.ownerId === user.id
}

export function canDeleteStall(user: User | null): boolean {
  return user?.role === 'admin'
}