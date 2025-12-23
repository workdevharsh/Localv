const express = require('express');
const router = express.Router();
const {
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    updateOpportunity,
    deleteOpportunity,
} = require('../controller/opportunityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getOpportunities)
    .post(protect, authorize('organization'), createOpportunity);

router.route('/:id')
    .get(getOpportunityById)
    .put(protect, authorize('organization'), updateOpportunity)
    .delete(protect, authorize('organization'), deleteOpportunity);

module.exports = router;
