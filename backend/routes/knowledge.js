const express = require('express');
const { KnowledgeBase } = require('../database/database');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Middleware to protect all knowledge base routes, only admin can access
router.use(authenticateToken);
router.use(authorize(['admin']));

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
      const newItem = await model.create(req.body);
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
router.use('/', createCrudEndpoints(KnowledgeBase, 'knowledge_base'));

module.exports = router;
