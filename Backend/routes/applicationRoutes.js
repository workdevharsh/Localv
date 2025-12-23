const express = require('express');
const router = express.Router();
const {
    applyForOpportunity,
    getMyApplications,
    getOpportunityApplications,
    updateApplicationStatus,
} = require('../controller/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('volunteer'), applyForOpportunity);
router.get('/my', protect, authorize('volunteer'), getMyApplications);
router.get('/opportunity/:id', protect, authorize('organization'), getOpportunityApplications);
router.put('/:id/status', protect, authorize('organization'), updateApplicationStatus);

module.exports = router;
