
const express = require('express');
const { Course, Facility, Staff, Announcement } = require('../database/database');
const { authenticateToken, authorize } = require('../middleware/auth');

// This router needs access to the `io` object from Socket.io
const createCmsRouter = (io) => {
  const router = express.Router();

  // Middleware to protect all CMS routes
  router.use(authenticateToken);
  router.use(authorize(['admin', 'staff']));

  // Generic CRUD endpoint generator
  const createCrudEndpoints = (model, modelName) => {
    const crudRouter = express.Router();

    // Get all
    crudRouter.get('/', async (req, res) => {
      try {
        const items = await model.getAll();
        res.json(items);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
      }
    });

    // Get one by ID
    crudRouter.get('/:id', async (req, res) => {
      try {
        const item = await model.getById(req.params.id);
        if (item) {
          res.json(item);
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
      }
    });

    // Create new
    crudRouter.post('/', async (req, res) => {
      try {
        const payload = { ...req.body, author_id: req.user.id };
        let newItem = await model.create(payload);

        // If a new announcement is created, broadcast it
        if (modelName === 'announcements' && io) {
          // Re-fetch the item to get all fields, including the timestamp
          const completeNewItem = await model.getById(newItem.id);
          console.log('Broadcasting new announcement:', completeNewItem);
          io.emit('new_announcement', completeNewItem);
        }

        res.status(201).json(newItem);
      } catch (error) {
        res.status(500).json({ message: `Error creating ${modelName}`, error });
      }
    });

    // Update
    crudRouter.put('/:id', async (req, res) => {
      try {
        const result = await model.update(req.params.id, req.body);
        if (result.changes > 0) {
          res.json({ message: 'Item updated successfully' });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
      }
    });

    // Delete
    crudRouter.delete('/:id', async (req, res) => {
      try {
        const result = await model.delete(req.params.id);
        if (result.changes > 0) {
          res.status(204).send();
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
      }
    });

    return crudRouter;
  };

  // Create and use CRUD routes for each model
  router.use('/courses', createCrudEndpoints(Course, 'courses'));
  router.use('/facilities', createCrudEndpoints(Facility, 'facilities'));
  router.use('/staff', createCrudEndpoints(Staff, 'staff'));
  router.use('/announcements', createCrudEndpoints(Announcement, 'announcements'));

  return router;
};

module.exports = createCmsRouter;
