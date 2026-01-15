# Notes API

A REST API for managing users and their notes, built with Express, TypeScript and Prisma.

## 🚀 Getting Started

### Prerequisites
- Node.js
- MySQL
- Environment variables configured

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file with:
```
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=3000
NODE_ENV=development
```

### Database Migration
```bash
npx prisma migrate dev --name init
```

### Start Server
```bash
npm run dev
```

## 📚 API Documentation

### Interactive Swagger UI
Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/api-docs`

The Swagger documentation provides:
- **Interactive API testing** - Try endpoints directly from your browser
- **Complete request/response schemas** - See expected data formats
- **Parameter documentation** - Understand required and optional fields
- **Error response examples** - Know what to expect when things go wrong

### Available Endpoints

#### Users (`/api/users`)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get a user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

#### Notes (`/api/notes`)
- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get a note by ID
- `GET /api/notes/user/:userId` - List user's notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## 🗄️ Database Schema

### User
```typescript
{
  id: number;        // Auto-generated ID
  username: string;   // Unique username
  password: string;   // User password
}
```

### Note
```typescript
{
  id: number;        // Auto-generated ID
  titre: string;     // Note title
  contenu: string;   // Note content
  userId: number;    // Owner user ID
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 📝 Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── config/
│   ├── config.ts       # App configuration
│   ├── database.ts     # Prisma client
│   └── swagger.ts     # Swagger configuration
├── controllers/
│   ├── userController.ts    # User business logic
│   └── noteController.ts    # Note business logic
├── routes/
│   ├── userRoutes.ts        # User endpoints
│   └── noteRoutes.ts        # Note endpoints
└── middlewares/
    └── errorHandler.ts      # Error handling
```

## 🚨 Error Handling

The API uses centralized error handling:
- **404**: Resource not found
- **500**: Internal server error
- **201**: Resource created successfully
- **200**: Operation successful

## 🔐 Security Notes

- Passwords are stored in plain text (should be hashed with bcrypt)
- Basic input validation
- No authentication implemented (should be added)

## 📖 Using the API

1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: Navigate to `http://localhost:3000/api-docs`
3. **Test endpoints**: Use the interactive interface to try all API endpoints
4. **View schemas**: See complete request/response documentation

The Swagger UI provides the most up-to-date and interactive documentation for all API endpoints.
