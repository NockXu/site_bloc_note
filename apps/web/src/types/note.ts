export interface Note {
  id: number
  titre: string
  contenu: string
  userId: number
  user?: User
  createdAt?: string
  updatedAt?: string
}

export interface CreateNoteDto {
  titre: string
  contenu: string
  userId: number
}

export interface UpdateNoteDto {
  titre?: string
  contenu?: string
  userId?: number
}

export interface User {
  id: number
  username: string
  password?: string
  notes?: Note[]
  createdAt?: string
  updatedAt?: string
}
