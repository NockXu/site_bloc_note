import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

// Create a note (or reply to another note)
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titre, contenu, userId, parentId } = req.body;
    const newNote = await prisma.note.create({
      data: {
        titre,
        contenu,
        userId: parseInt(userId, 10),
        parentId: parentId ? parseInt(parentId, 10) : null
      },
      include: {
        user: true,
        parent: {
          include: { user: true }
        }
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// Get all notes (only top-level notes, not replies)
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await prisma.note.findMany({
      where: { parentId: null },
      include: {
        user: true,
        replies: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// Get note by ID (with all replies)
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(idParam, 10);
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        user: true,
        replies: {
          include: {
            user: true
          },
          orderBy: { createdAt: 'asc' }
        },
        parent: {
          include: { user: true }
        }
      },
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

// Get notes by user ID (only top-level notes)
export const getNotesByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const userId = parseInt(userIdParam, 10);
    const notes = await prisma.note.findMany({
      where: {
        userId,
        parentId: null
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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

// Get replies for a specific note
export const getRepliesByNoteId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteIdParam = Array.isArray(req.params.noteId) ? req.params.noteId[0] : req.params.noteId;
    const noteId = parseInt(noteIdParam, 10);
    const replies = await prisma.note.findMany({
      where: { parentId: noteId },
      include: {
        user: true
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(replies);
  } catch (error) {
    next(error);
  }
};
