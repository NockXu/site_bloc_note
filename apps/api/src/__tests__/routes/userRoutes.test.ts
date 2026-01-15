import request from 'supertest';
import app from '../../app';

describe('User Routes', () => {
  describe('GET /api/users', () => {
    it('should return 200 for getting all users', async () => {
      await request(app)
        .get('/api/users')
        .expect(200);
    });
  });

  describe('POST /api/users', () => {
    it('should return 201 for creating a user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/99999')
        .expect(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should return 404 for updating non-existent user', async () => {
      const updateData = {
        username: 'updateduser',
        password: 'newpassword123'
      };

      await request(app)
        .put('/api/users/99999')
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 404 for deleting non-existent user', async () => {
      await request(app)
        .delete('/api/users/99999')
        .expect(404);
    });
  });
});
