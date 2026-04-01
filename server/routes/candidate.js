const express = require('express');
const router = express.Router();
const candidatesController = require('../controllers/candidate');

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

module.exports = router;
