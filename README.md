# Site Bloc Note

Notes management application with users - Application maintenance exercise

## Description

Monorepo using Turborepo with:

- **API Backend**: TypeScript REST API with Node.js, Express and Prisma
- **Web Frontend**: Vue.js 3 application with TypeScript and Vite
- **Database**: MySQL with Prisma ORM

## Dev Team 4

[DAVID Gabriel](https://github.com/NockXu)
[GUILMIN Leny](https://github.com/TarzanHR)

## Dev Team <numéro du groupe>

[]()
[]()

## Technologies

### Backend (API)

- **Node.js** - JavaScript runtime
- **TypeScript** - Static typing
- **Express** - Web framework
- **Prisma** - ORM for MySQL
- **Swagger** - API documentation
- **Jest** - Testing framework
- **jest-mock-extended** - Mocking for Prisma
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-reload in development

### Frontend (Web)

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Static typing
- **Vite** - Ultra-fast build tool
- **Composition API** - Modern Vue.js API

### Database

- **MySQL** - Relational database
- **Prisma** - Modern ORM for TypeScript

### Monorepo

- **Turborepo** - High-performance build system
- **npm workspaces** - Package management

## Project Structure

```
site_bloc_note/
├── apps/
│   ├── api/                    # Express TypeScript Backend
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   ├── src/
│   │   │   ├── __tests__/      # Jest tests
│   │   │   │   ├── jest.setup.ts       # Mock configuration
│   │   │   │   ├── database/           # Database tests
│   │   │   │   ├── notes/              # Note controller tests
│   │   │   │   ├── routes/             # Route tests
│   │   │   │   └── users/              # User controller tests
│   │   │   ├── config/         # Configuration (DB, Swagger)
│   │   │   ├── controllers/    # Business logic CRUD
│   │   │   ├── middlewares/    # Middlewares (error handler)
│   │   │   ├── routes/         # Express routes
│   │   │   ├── app.ts          # App configuration
│   │   │   └── server.ts       # Entry point
│   │   ├── dist/               # Compiled code
│   │   ├── jest.config.js      # Jest configuration
│   │   ├── tsconfig.json       # TypeScript configuration
│   │   └── package.json
│   │
│   └── web/                    # Vue.js Frontend
│       ├── src/
│       │   ├── components/     # Vue components
│       │   ├── views/          # Views/Pages
│       │   ├── App.vue         # Main component
│       │   ├── main.ts         # Entry point
│       │   └── style.css       # Global styles
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
│
├── turbo.json                  # Turborepo configuration
├── package.json                # Root package.json
└── README.md
```

## Installation

Install all monorepo dependencies:

```bash
npm install
cd apps/api
npm install
cd ../web
npm install
cd ../..
```

## Configuration

### API Backend

Create a `.env` file in `apps/api/`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://user:password@host:3306/database_name"
```

**Important**: Replace the values with your MySQL credentials (or ask us for them).

### Database

#### 1. Generate Prisma client

```bash
cd apps/api
npm run prisma:generate
```

#### 2. Sync schema with database

```bash
npm run prisma:migrate
```

#### 3. View database (optional)

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` to explore your data.

## Data Model

### User

- `id`: Integer (auto-incremented)
- `username`: String (unique)
- `password`: String
- `notes`: Relation to Note[]

### Note

- `id`: Integer (auto-incremented)
- `titre`: String
- `contenu`: String
- `userId`: Integer (foreign key)
- `user`: Relation to User

## Available Scripts

### Monorepo Commands (at root)

```bash
npm run dev        # Run API + Web in parallel
npm run build      # Build API + Web
npm run lint       # Lint all projects
npm run test       # Test all projects
```

### API Commands (in apps/api/)

```bash
npm run dev              # Development mode with hot-reload
npm run build            # Compile TypeScript → JavaScript
npm start                # Start server (requires build)
npm run lint             # Check code with ESLint
npm test                 # Run all tests
npm run test:watch       # Tests in watch mode
npm run test:coverage    # Tests with coverage report
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio
```

### Web Commands (in apps/web/)

```bash
npm run dev        # Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Quick Start

### 1. Configure database

```bash
cd apps/api
npm run prisma:generate
npm run prisma:migrate
```

### 2. Start the monorepo

```bash
npm run dev
```

This launches:

- **API** on `http://localhost:3000`
- **Web** on `http://localhost:5173`
- **Swagger UI** on `http://localhost:3000/api-docs`

### 3. Use the application

- **Web interface**: `http://localhost:5173`
- **API documentation**: `http://localhost:3000/api-docs`

## API Documentation (Swagger)

The API is fully documented with Swagger/OpenAPI 3.0.

Access the interactive documentation at: **http://localhost:3000/api-docs**

Swagger UI allows you to:

- View all available endpoints
- Test requests directly from the interface
- View data schemas
- See request/response examples

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a user by ID
- `GET /api/users/username/:username` - Get a user by username
- `POST /api/users` - Create a new user
  - Body: `{ "username": "john_doe", "password": "password123" }`
- `PUT /api/users/:id` - Update a user
  - Body: `{ "username": "new_name", "password": "new_password" }`
- `DELETE /api/users/:id` - Delete a user

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a note by ID
- `GET /api/notes/user/:userId` - Get all notes for a user
- `POST /api/notes` - Create a new note
  - Body: `{ "titre": "My note", "contenu": "Note content", "userId": 1 }`
- `PUT /api/notes/:id` - Update a note
  - Body: `{ "titre": "Updated title", "contenu": "New content", "userId": 1 }`
- `DELETE /api/notes/:id` - Delete a note

### Health Check

- `GET /health` - Check server status

## API Usage Examples

### Create a user

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'
```

### Create a note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"titre": "My first note", "contenu": "This is the content", "userId": 1}'
```

### Get all notes for a user

```bash
curl http://localhost:3000/api/notes/user/1
```

## Tests

The API has a complete test suite using Jest with Prisma mocks.

### Run tests

```bash
cd apps/api
npm test
```

### Tests with code coverage

```bash
npm run test:coverage
```

### Tests in watch mode

```bash
npm run test:watch
```

### Test Organization

- **35 tests** covering all endpoints
- **Prisma Mocks**: Tests don't use a real database
- **Isolated tests**: Each test is independent
- **Fast tests**: Execution in ~3 seconds

Tests cover:

- ✅ User controllers (9 tests)
- ✅ Note controllers (10 tests)
- ✅ User routes (5 tests)
- ✅ Note routes (6 tests)
- ✅ Database connection (5 tests)

## Architecture & Features

### Turborepo

Turborepo optimizes builds and tasks:

- Intelligent build caching
- Parallel task execution
- Package dependency management

### Prisma ORM

Prisma provides:

- **Type-safety**: Automatically generated TypeScript types
- **Migrations**: Schema change management
- **Prisma Studio**: Web interface to explore data
- **Relations**: Automatic relationship management between tables

### Error Handling

The API has a centralized error handling middleware that handles:

- **Prisma Errors**:
  - `P2025` → 404 Not Found
  - `P2002` → 409 Conflict (unique constraint)
  - `P2003` → 400 Bad Request (foreign key constraint)
  - Validation → 400 Bad Request
- **Generic errors** → 500 Internal Server Error

### Test Mocking

Tests use `jest-mock-extended` to mock Prisma:

- Configuration in `jest.setup.ts`
- Global mock shared across all tests
- Automatic reset before each test
- No dependency on a real database

## Development

### Add a new feature

1. **Schema**: Update `prisma/schema.prisma` if needed
2. **Backend**: Add your route/controller in `apps/api/src/`
3. **Tests**: Create tests in `apps/api/src/__tests__/`
4. **Frontend**: Create your components in `apps/web/src/components/`
5. **Documentation**: Add Swagger annotations in routes

Changes are automatically reloaded thanks to nodemon and Vite.

### Commit Structure

Use conventional commit messages:

```
feat(api): add user authentication
fix(web): correct note deletion
test(api): add tests for note controller
docs: update API documentation
```

## Troubleshooting

### API server won't start

**Error**: `host.fileExists is not a function`

- **Solution**: Verify that `ts-node` is version `^10.9.2` in `package.json`

**Error**: `@prisma/client did not initialize yet`

- **Solution**: Run `npm run prisma:generate`

### Database connection errors

- Verify MySQL is running
- Check credentials in `.env` file
- Verify the database exists
- Test connection: `npx prisma db pull`

### Tests fail

- Ensure `jest.setup.ts` is properly configured
- Verify `setupFilesAfterEnv` is defined in `jest.config.js`
- Run `npm install` to install `jest-mock-extended`

### Web interface won't connect to API

- Ensure API is running on port 3000
- Check proxy configuration in `vite.config.ts`
- Open developer console to see network errors

### Build errors

```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules
npm install

# Regenerate Prisma
cd apps/api
npm run prisma:generate
```

## Deployment

### Production build

```bash
# Build everything
npm run build

# API: compiled code in apps/api/dist/
# Web: build in apps/web/dist/
```

### Production environment variables

Make sure to define:

- `DATABASE_URL`: MySQL connection URL
- `NODE_ENV=production`
- `PORT`: Server port (default 3000)

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com/)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)
- [Jest Documentation](https://jestjs.io/)

## License

ISC
