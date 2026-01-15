import request from 'supertest';
import app from '../../app';

describe('Note Routes', () => {
  describe('GET /api/notes', () => {
    it('should return 200 for getting all notes', async () => {
      await request(app)
        .get('/api/notes')
        .expect(200);
    });
  });

  describe('POST /api/notes', () => {
    it('should return 201 for creating a note', async () => {
      const noteData = {
        titre: 'Test Note',
        contenu: 'Test content',
        userId: 1
      };

      await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(201);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return 404 for non-existent note', async () => {
      await request(app)
        .get('/api/notes/99999')
        .expect(404);
    });
  });

  describe('GET /api/notes/user/:userId', () => {
    it('should return 200 for getting user notes', async () => {
      await request(app)
        .get('/api/notes/user/1')
        .expect(200);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should return 404 for updating non-existent note', async () => {
      const updateData = {
        titre: 'Updated Note',
        contenu: 'Updated content',
        userId: 1
      };

      await request(app)
        .put('/api/notes/99999')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should return 404 for deleting non-existent note', async () => {
      await request(app)
        .delete('/api/notes/99999')
        .expect(404);
    });
  });
});
