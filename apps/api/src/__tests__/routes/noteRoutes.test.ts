import request from 'supertest';
import app from '../../app';
import { prismaMock } from '../jest.setup';
import { Prisma } from '@prisma/client';

describe('Note Routes', () => {
  const now = new Date();
  const createMockNote = (overrides: any = {}) => ({
    id: 1,
    titre: 'Test Note',
    contenu: 'Test content',
    userId: 1,
    createdAt: now,
    updatedAt: null,
    parentId: null,
    ...overrides,
  });

  describe('GET /api/notes', () => {
    it('should return 200 for getting all notes', async () => {
      const mockNotes = [
        createMockNote({ id: 1, titre: 'Note 1', contenu: 'Content 1' }),
        createMockNote({ id: 2, titre: 'Note 2', contenu: 'Content 2' }),
      ];

      prismaMock.note.findMany.mockResolvedValue(mockNotes);

      await request(app).get('/api/notes').expect(200);
    });
  });

  describe('POST /api/notes', () => {
    it('should return 201 for creating a note', async () => {
      const noteData = {
        titre: 'Test Note',
        contenu: 'Test content',
        userId: 1,
      };

      const mockNote = { id: 1, ...noteData };
      prismaMock.note.create.mockResolvedValue(mockNote);

      await request(app).post('/api/notes').send(noteData).expect(201);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return 404 for non-existent note', async () => {
      prismaMock.note.findUnique.mockResolvedValue(null);

      await request(app).get('/api/notes/99999').expect(404);
    });
  });

  describe('GET /api/notes/user/:userId', () => {
    it('should return 200 for getting user notes', async () => {
      const mockNotes = [
        createMockNote({ id: 1, titre: 'Note 1', contenu: 'Content 1' }),
        createMockNote({ id: 2, titre: 'Note 2', contenu: 'Content 2' }),
      ];

      prismaMock.note.findMany.mockResolvedValue(mockNotes);

      await request(app).get('/api/notes/user/1').expect(200);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should return 404 for updating non-existent note', async () => {
      const updateData = {
        titre: 'Updated Note',
        contenu: 'Updated content',
        userId: 1,
      };

      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' },
      );
      prismaMock.note.update.mockRejectedValue(notFoundError);

      await request(app).put('/api/notes/99999').send(updateData).expect(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should return 404 for deleting non-existent note', async () => {
      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' },
      );
      prismaMock.note.delete.mockRejectedValue(notFoundError);

      await request(app).delete('/api/notes/99999').expect(404);
    });
  });
});
