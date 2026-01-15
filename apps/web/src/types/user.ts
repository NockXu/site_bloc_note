export interface User {
  id: number
  username: string
  password?: string
  notes?: Note[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserDto {
  username: string
  password: string
}

export interface UpdateUserDto {
  username?: string
  password?: string
}

export interface Note {
  id: number
  titre: string
  contenu: string
  userId: number
  user?: User
  createdAt?: string
  updatedAt?: string
}
