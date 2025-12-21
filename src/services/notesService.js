import { notesAPI } from './api';

/**
 * Add a new note via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} noteData - Note data
 * @param {string} noteData.title - Note title
 * @param {string} noteData.content - Note content
 * @param {string} noteData.category - Note category
 * @returns {Promise<{success: boolean, noteId: string | null, error: string | null}>}
 */
export const addNote = async (userId, noteData) => {
  try {
    // Validate required fields
    if (!noteData.title || !noteData.title.trim()) {
      throw new Error('Note title is required');
    }
    if (!noteData.content) {
      throw new Error('Note content is required');
    }
    if (!noteData.category) {
      throw new Error('Note category is required');
    }

    const result = await notesAPI.create({
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      category: noteData.category,
    });

    if (result.success) {
      console.log('✅ Note added:', result.noteId);
    }
    return result;
  } catch (error) {
    console.error('❌ Add note error:', error);
    return { success: false, noteId: null, error: error.message };
  }
};

/**
 * Get all notes for a user via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {object} [filters] - Optional filters
 * @param {string} [filters.category] - Filter by category
 * @param {number} [filters.limit] - Limit number of results
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getNotes = async (userId, filters = {}) => {
  try {
    const result = await notesAPI.getAll(filters);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects for compatibility
    const notes = result.data.map((item) => ({
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
    }));

    console.log(`✅ Retrieved ${notes.length} notes`);
    return { data: notes, error: null };
  } catch (error) {
    console.error('❌ Get notes error:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get a single note by ID via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} noteId - Note ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export const getNote = async (userId, noteId) => {
  try {
    if (!noteId) {
      throw new Error('Note ID is required');
    }

    const result = await notesAPI.getById(noteId);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects
    const data = {
      ...result.data,
      createdAt: result.data.createdAt ? new Date(result.data.createdAt) : null,
      updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt) : null,
    };

    return { data, error: null };
  } catch (error) {
    console.error('❌ Get note error:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Update a note via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} noteId - Note ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const updateNote = async (userId, noteId, updates) => {
  try {
    if (!noteId) {
      throw new Error('Note ID is required');
    }

    const updateData = { ...updates };
    if (updateData.title) {
      updateData.title = updateData.title.trim();
    }
    if (updateData.content) {
      updateData.content = updateData.content.trim();
    }

    const result = await notesAPI.update(noteId, updateData);
    
    if (result.success) {
      console.log('✅ Note updated:', noteId);
    }
    return result;
  } catch (error) {
    console.error('❌ Update note error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a note via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} noteId - Note ID
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const deleteNote = async (userId, noteId) => {
  try {
    if (!noteId) {
      throw new Error('Note ID is required');
    }

    const result = await notesAPI.delete(noteId);
    
    if (result.success) {
      console.log('✅ Note deleted:', noteId);
    }
    return result;
  } catch (error) {
    console.error('❌ Delete note error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get notes by category via API
 * @param {string} userId - User ID (kept for compatibility)
 * @param {string} category - Category name
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const getNotesByCategory = async (userId, category) => {
  return getNotes(userId, { category });
};

/**
 * Search notes by title or content via API
 * @param {string} userId - User ID (kept for compatibility, but not used - API handles auth)
 * @param {string} searchQuery - Search query string
 * @returns {Promise<{data: Array, error: string | null}>}
 */
export const searchNotes = async (userId, searchQuery) => {
  try {
    if (!searchQuery || !searchQuery.trim()) {
      // Return all notes if search query is empty
      return getNotes(userId);
    }

    const result = await notesAPI.search(searchQuery);
    
    if (result.error) {
      return result;
    }

    // Convert date strings back to Date objects
    const notes = result.data.map((item) => ({
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
    }));

    console.log(`✅ Found ${notes.length} notes matching "${searchQuery}"`);
    return { data: notes, error: null };
  } catch (error) {
    console.error('❌ Search notes error:', error);
    return { data: [], error: error.message };
  }
};

