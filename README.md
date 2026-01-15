# Site Bloc Note

Site servant d'exercice de maintenance applicative

## Description

API REST TypeScript construite avec Node.js et Express, implémentant un système CRUD simple pour gérer des items.

## Groupe de dev 1

[DAVID Gabriel](https://github.com/NockXu)
[GUILMIN Leny](https://github.com/TarzanHR)

## Technologies

- **Node.js** - Runtime JavaScript
- **TypeScript** - Typage statique
- **Express** - Framework web
- **ESLint** - Linting
- **Prettier** - Formatage de code
- **Nodemon** - Auto-reload en développement

## Structure du projet

```
site_bloc_note/
├── src/
│   ├── config/          # Configuration et variables d'environnement
│   ├── controllers/     # Logique métier CRUD
│   ├── middlewares/     # Middlewares (gestion d'erreurs)
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes Express
│   ├── app.ts           # Configuration de l'application
│   └── server.ts        # Point d'entrée du serveur
├── dist/                # Code compilé (généré)
├── .env                 # Variables d'environnement
├── tsconfig.json        # Configuration TypeScript
├── .eslintrc.js         # Configuration ESLint
└── .prettierrc          # Configuration Prettier
```

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet :

```env
PORT=3000
NODE_ENV=development
```

## Scripts disponibles

- `npm run build` - Compile le TypeScript en JavaScript
- `npm start` - Démarre le serveur en production (nécessite le build)
- `npm run dev` - Démarre le serveur en mode développement avec auto-reload
- `npm run lint` - Vérifie le code avec ESLint

## Démarrage

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm run build
npm start
```

Le serveur démarre sur `http://localhost:3000`

## API Endpoints

### Items

- `GET /api/items` - Récupérer tous les items
- `GET /api/items/:id` - Récupérer un item par ID
- `POST /api/items` - Créer un nouvel item
  - Body: `{ "name": "Item name" }`
- `PUT /api/items/:id` - Mettre à jour un item
  - Body: `{ "name": "Updated name" }`
- `DELETE /api/items/:id` - Supprimer un item

## Exemples d'utilisation

### Créer un item

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Mon premier item"}'
```

### Récupérer tous les items

```bash
curl http://localhost:3000/api/items
```

### Mettre à jour un item

```bash
curl -X PUT http://localhost:3000/api/items/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"name": "Item mis à jour"}'
```

### Supprimer un item

```bash
curl -X DELETE http://localhost:3000/api/items/1234567890
```

## Déploiement avec Docker

### Créer l'image

```bash
docker build -t site-bloc-note .
```

### Lancer le conteneur

```bash
docker run -p 3000:3000 site-bloc-note
```

## Licence

ISC
