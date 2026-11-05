const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All complaint routes require authentication
router.use(protect);

// Student routes
router.post('/', createComplaint);
router.get('/my', getMyComplaints);

// Admin route to get all complaints
router.get('/', adminOnly, getAllComplaints);

// Specific complaint details (Student owner or Admin)
router.get('/:id', getComplaintById);

// Admin route to update complaint status
router.patch('/:id/status', adminOnly, updateComplaintStatus);

// Delete route (Student can delete if Pending, Admin can delete any)
router.delete('/:id', deleteComplaint);

module.exports = router;
