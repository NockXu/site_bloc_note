import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

describe('Note Controller', () => {
  let userId: number;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: 'password123'
      }
    });
    userId = user.id;
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        titre: 'Test Note',
        contenu: 'This is a test note content',
        userId: userId
      };

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.titre).toBe(noteData.titre);
      expect(response.body.contenu).toBe(noteData.contenu);
      expect(response.body.userId).toBe(noteData.userId);
    });

    it('should return 500 for missing titre', async () => {
      const noteData = {
        contenu: 'This is a test note content',
        userId: userId
      };

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/notes', () => {
    beforeEach(async () => {
      await prisma.note.create({
        data: {
          titre: 'Test Note 1',
          contenu: 'Content 1',
          userId: userId
        }
      });
      await prisma.note.create({
        data: {
          titre: 'Test Note 2',
          contenu: 'Content 2',
          userId: userId
        }
      });
    });

    it('should return all notes', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/notes/:id', () => {
    let noteId: number;

    beforeEach(async () => {
      const note = await prisma.note.create({
        data: {
          titre: 'Test Note',
          contenu: 'Test content',
          userId: userId
        }
      });
      noteId = note.id;
    });

    it('should return a note by ID', async () => {
      const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .expect(200);

      expect(response.body.id).toBe(noteId);
      expect(response.body.titre).toBe('Test Note');
      expect(response.body.contenu).toBe('Test content');
    });

    it('should return 404 for non-existent note', async () => {
      const response = await request(app)
        .get('/api/notes/99999')
        .expect(404);

      expect(response.body.message).toBe('Note not found');
    });
  });

  describe('GET /api/notes/user/:userId', () => {
    beforeEach(async () => {
      await prisma.note.create({
        data: {
          titre: 'Test Note 1',
          contenu: 'Content 1',
          userId: userId
        }
      });
      await prisma.note.create({
        data: {
          titre: 'Test Note 2',
          contenu: 'Content 2',
          userId: userId
        }
      });
    });

    it('should return notes for specific user', async () => {
      const response = await request(app)
        .get(`/api/notes/user/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach((note: any) => {
        expect(note.userId).toBe(userId);
      });
    });
  });

  describe('PUT /api/notes/:id', () => {
    let noteId: number;

    beforeEach(async () => {
      const note = await prisma.note.create({
        data: {
          titre: 'Test Note',
          contenu: 'Test content',
          userId: userId
        }
      });
      noteId = note.id;
    });

    it('should update a note', async () => {
      const updateData = {
        titre: 'Updated Note',
        contenu: 'Updated content',
        userId: userId
      };

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(noteId);
      expect(response.body.titre).toBe(updateData.titre);
      expect(response.body.contenu).toBe(updateData.contenu);
    });

    it('should return 404 for non-existent note', async () => {
      const updateData = {
        titre: 'Updated Note',
        contenu: 'Updated content',
        userId: userId
      };

      const response = await request(app)
        .put('/api/notes/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Note not found');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    let noteId: number;

    beforeEach(async () => {
      const note = await prisma.note.create({
        data: {
          titre: 'Test Note',
          contenu: 'Test content',
          userId: userId
        }
      });
      noteId = note.id;
    });

    it('should delete a note', async () => {
      const response = await request(app)
        .delete(`/api/notes/${noteId}`)
        .expect(200);

      expect(response.body.id).toBe(noteId);
    });

    it('should return 404 for non-existent note', async () => {
      const response = await request(app)
        .delete('/api/notes/99999')
        .expect(404);

      expect(response.body.message).toBe('Note not found');
    });
  });
});
