import request from 'supertest';
import app from '../../app';
import { prismaMock } from '../jest.setup';
import { Prisma } from '@prisma/client';

describe('Note Controller', () => {
  const mockUserId = 1;

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        titre: 'Test Note',
        contenu: 'This is a test note content',
        userId: mockUserId,
      };

      const mockNote = { id: 1, ...noteData };
      prismaMock.note.create.mockResolvedValue(mockNote);

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(201);

      expect(response.body).toEqual(mockNote);
      expect(prismaMock.note.create).toHaveBeenCalledWith({
        data: noteData,
        include: { user: true },
      });
    });

    it('should return 400 for missing titre', async () => {
      const noteData = {
        contenu: 'This is a test note content',
        userId: mockUserId,
      };

      const validationError = new Prisma.PrismaClientValidationError(
        'Validation error: titre is required',
        { clientVersion: '6.19.2' },
      );
      prismaMock.note.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid data provided');
    });
  });

  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      const mockNotes = [
        {
          id: 1,
          titre: 'Test Note 1',
          contenu: 'Content 1',
          userId: mockUserId,
        },
        {
          id: 2,
          titre: 'Test Note 2',
          contenu: 'Content 2',
          userId: mockUserId,
        },
      ];

      prismaMock.note.findMany.mockResolvedValue(mockNotes);

      const response = await request(app).get('/api/notes').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(mockNotes);
      expect(prismaMock.note.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a note by ID', async () => {
      const mockNote = {
        id: 1,
        titre: 'Test Note',
        contenu: 'Test content',
        userId: mockUserId,
      };

      prismaMock.note.findUnique.mockResolvedValue(mockNote);

      const response = await request(app).get('/api/notes/1').expect(200);

      expect(response.body).toEqual(mockNote);
      expect(prismaMock.note.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true },
      });
    });

    it('should return 404 for non-existent note', async () => {
      prismaMock.note.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/notes/99999').expect(404);

      expect(response.body.message).toBe('Note not found');
    });
  });

  describe('GET /api/notes/user/:userId', () => {
    it('should return notes for specific user', async () => {
      const mockNotes = [
        {
          id: 1,
          titre: 'Test Note 1',
          contenu: 'Content 1',
          userId: mockUserId,
        },
        {
          id: 2,
          titre: 'Test Note 2',
          contenu: 'Content 2',
          userId: mockUserId,
        },
      ];

      prismaMock.note.findMany.mockResolvedValue(mockNotes);

      const response = await request(app)
        .get(`/api/notes/user/${mockUserId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach((note: any) => {
        expect(note.userId).toBe(mockUserId);
      });
      expect(prismaMock.note.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: { user: true },
      });
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const updateData = {
        titre: 'Updated Note',
        contenu: 'Updated content',
        userId: mockUserId,
      };

      const mockUpdatedNote = { id: 1, ...updateData };
      prismaMock.note.update.mockResolvedValue(mockUpdatedNote);

      const response = await request(app)
        .put('/api/notes/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedNote);
      expect(prismaMock.note.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        include: { user: true },
      });
    });

    it('should return 404 for non-existent note', async () => {
      const updateData = {
        titre: 'Updated Note',
        contenu: 'Updated content',
        userId: mockUserId,
      };

      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' },
      );
      prismaMock.note.update.mockRejectedValue(notFoundError);

      const response = await request(app)
        .put('/api/notes/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const mockDeletedNote = {
        id: 1,
        titre: 'Test Note',
        contenu: 'Test content',
        userId: mockUserId,
      };

      prismaMock.note.delete.mockResolvedValue(mockDeletedNote);

      const response = await request(app).delete('/api/notes/1').expect(200);

      expect(response.body).toEqual(mockDeletedNote);
      expect(prismaMock.note.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 for non-existent note', async () => {
      const notFoundError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '6.19.2' },
      );
      prismaMock.note.delete.mockRejectedValue(notFoundError);

      const response = await request(app)
        .delete('/api/notes/99999')
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});
