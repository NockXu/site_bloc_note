import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Supprime tout pour repartir propre
  await prisma.note.deleteMany()
  await prisma.user.deleteMany()

  // Créer des utilisateurs
  const usersData = [
    { username: 'alice', password: 'password123' },
    { username: 'bob', password: 'secret456' }
  ]

  const users = []

  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10)
    const user = await prisma.user.create({
      data: {
        username: u.username,
        password: hashedPassword
      }
    })
    users.push(user)
  }

  // Créer des notes liées aux utilisateurs
  const notesData = [
    { titre: 'Note 1', contenu: 'Contenu de la note 1', userId: users[0].id },
    { titre: 'Note 2', contenu: 'Contenu de la note 2', userId: users[0].id },
    { titre: 'Note 3', contenu: 'Contenu de la note 3', userId: users[1].id }
  ]

  for (const n of notesData) {
    await prisma.note.create({ data: n })
  }

  console.log('Seed terminé ✅')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
