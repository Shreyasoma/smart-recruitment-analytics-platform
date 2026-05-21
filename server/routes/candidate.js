const express = require('express');
const router = express.Router();
const candidatesController = require('../controllers/candidate');
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  predictCandidate,
} = require('../controllers/candidate');

// Add candidate
router.post('/', candidatesController.createCandidate);
// View all
router.get('/', candidatesController.getAllCandidates);
// View one
router.get('/:id', candidatesController.getCandidateById);
// Update
router.put('/:id', candidatesController.updateCandidate);
// Delete
router.delete('/:id', candidatesController.deleteCandidate);
// Predict hire probability
router.post('/:id/predict', predictCandidate);

module.exports = router;
