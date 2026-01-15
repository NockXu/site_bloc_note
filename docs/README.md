# API Documentation

> Generated automatically from source code comments

## Composables

### user.ts

```typescript
interface User {
  id: number
  username: string
  password?: string
  notes?: Note[]
  createdAt?: string
  updatedAt?: string
}
```

### user.ts

```typescript
interface CreateUserDto {
  username: string
  password: string
}
```

### user.ts

```typescript
interface UpdateUserDto {
  username?: string
  password?: string
}
```

### user.ts

```typescript
interface Note {
  id: number
  titre: string
  contenu: string
  userId: number
  user?: User
  createdAt?: string
  updatedAt?: string
}
```

## Types

### note.ts

```typescript
interface Note {
  id: number
  titre: string
  contenu: string
  userId: number
  user?: User
  createdAt?: string
  updatedAt?: string
}
```

### note.ts

```typescript
interface CreateNoteDto {
  titre: string
  contenu: string
  userId: number
}
```

### note.ts

```typescript
interface UpdateNoteDto {
  titre?: string
  contenu?: string
  userId?: number
}
```

### note.ts

```typescript
interface User {
  id: number
  username: string
  password?: string
  notes?: Note[]
  createdAt?: string
  updatedAt?: string
}
```

