import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { db } from '../config/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/notes
 * Get all notes for the authenticated user
 * Query params: category, limit
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { category, limit: limitParam } = req.query;

    let query = db.collection('users').doc(userId).collection('notes');

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    // Order by creation date descending
    query = query.orderBy('createdAt', 'desc');

    // Apply limit
    if (limitParam) {
      query = query.limit(parseInt(limitParam));
    }

    const snapshot = await query.get();
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    res.json({ 
      success: true, 
      data: notes,
      count: notes.length 
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notes',
      message: error.message 
    });
  }
});

/**
 * GET /api/notes/search
 * Search notes by title or content
 * Query param: q (search query)
 */
router.get('/search', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { q } = req.query;

    if (!q || !q.trim()) {
      // Return all notes if no search query
      return router.handle({ ...req, path: '/' }, res);
    }

    // Get all notes (Firestore doesn't support full-text search)
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .get();

    const queryLower = q.toLowerCase().trim();
    const notes = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      }))
      .filter(note =>
        note.title.toLowerCase().includes(queryLower) ||
        note.content.toLowerCase().includes(queryLower)
      );

    res.json({ 
      success: true, 
      data: notes,
      count: notes.length,
      query: q 
    });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search notes',
      message: error.message 
    });
  }
});

/**
 * GET /api/notes/:id
 * Get a single note by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const docRef = db.collection('users').doc(userId).collection('notes').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Note not found' 
      });
    }

    const data = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate().toISOString(),
      updatedAt: docSnap.data().updatedAt?.toDate().toISOString(),
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch note',
      message: error.message 
    });
  }
});

/**
 * POST /api/notes
 * Create a new note
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, content, category } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Note title is required' 
      });
    }
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Note content is required' 
      });
    }
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Note category is required' 
      });
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .add(noteData);

    console.log(`✅ Note created: ${docRef.id}`);

    res.status(201).json({ 
      success: true, 
      message: 'Note created successfully',
      data: { id: docRef.id, ...noteData }
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create note',
      message: error.message 
    });
  }
});

/**
 * PUT /api/notes/:id
 * Update a note
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const { title, content, category } = req.body;

    const docRef = db.collection('users').doc(userId).collection('notes').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Note not found' 
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;
    updateData.updatedAt = Timestamp.now();

    await docRef.update(updateData);

    console.log(`✅ Note updated: ${id}`);

    res.json({ 
      success: true, 
      message: 'Note updated successfully',
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update note',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const docRef = db.collection('users').doc(userId).collection('notes').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Note not found' 
      });
    }

    await docRef.delete();

    console.log(`✅ Note deleted: ${id}`);

    res.json({ 
      success: true, 
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete note',
      message: error.message 
    });
  }
});

export default router;

