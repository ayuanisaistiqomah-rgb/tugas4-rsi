export type UserRole = 'admin' | 'owner' | 'customer'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginResult {
  token: string
  tokenType: 'Bearer'
  expiresIn: string
  user: User
}

export interface Stall {
  id: number
  ownerId: number
  name: string
  category: string | null
  location: string | null
  description: string | null
  avgRating: number
  reviewCount: number
  isPopular: boolean
}

export interface MenuItem {
  id: number
  stallId: number
  name: string
  price: number
  isAvailable: boolean
}

export interface StallInput {
  name: string
  category: string
  location: string
  description: string
}

// bentuk yang dikirim ke backend (field kosong dikirim sebagai null)
export interface StallPayload {
  name: string
  category: string | null
  location: string | null
  description: string | null
}

export interface StallQuery {
  search?: string
  category?: string
  page?: number
  limit?: number
}

export interface PageMeta {
  page: number
  limit: number
  total: number
}

export interface StallListResult {
  data: Stall[]
  meta: PageMeta
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  status: string
  data: T
}

export interface FieldIssue {
  field: string
  message: string
}