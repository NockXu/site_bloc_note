import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

describe('User Controller', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.password).toBe(userData.password);
    });

    it('should return 400 for missing username', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          username: 'testuser1',
          password: 'password123'
        }
      });
      await prisma.user.create({
        data: {
          username: 'testuser2',
          password: 'password456'
        }
      });
    });

    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/users/:id', () => {
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

    it('should return a user by ID', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.username).toBe('testuser');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
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

    it('should update a user', async () => {
      const updateData = {
        username: 'updateduser',
        password: 'newpassword123'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.username).toBe(updateData.username);
      expect(response.body.password).toBe(updateData.password);
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        username: 'updateduser',
        password: 'newpassword123'
      };

      const response = await request(app)
        .put('/api/users/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
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

    it('should delete a user', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/99999')
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});
