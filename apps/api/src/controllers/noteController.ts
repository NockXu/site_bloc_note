import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

// Create a note
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titre, contenu, userId } = req.body;
    const newNote = await prisma.note.create({
      data: { titre, contenu, userId: parseInt(userId, 10) },
      include: { user: true },
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// Get all notes
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await prisma.note.findMany({
      include: { user: true },
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// Get note by ID
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(idParam, 10);
    const note = await prisma.note.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

// Get notes by user ID
export const getNotesByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const userId = parseInt(userIdParam, 10);
    const notes = await prisma.note.findMany({
      where: { userId },
      include: { user: true },
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// Update note
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(idParam, 10);
    const { titre, contenu, userId } = req.body;
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { titre, contenu, userId: userId ? parseInt(userId, 10) : undefined },
      include: { user: true },
    });
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// Delete note
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(idParam, 10);
    const deletedNote = await prisma.note.delete({
      where: { id },
    });
    res.json(deletedNote);
  } catch (error) {
    next(error);
  }
};
