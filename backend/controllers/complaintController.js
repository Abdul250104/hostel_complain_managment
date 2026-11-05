const Complaint = require('../models/Complaint');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, roomNumber } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category',
      });
    }

    const validCategories = ['Electricity', 'Water', 'Cleaning', 'Wi-Fi', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      });
    }

    const complaint = await Complaint.create({
      studentId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      roomNumber: roomNumber ? roomNumber.trim() : '',
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    console.error('Create Complaint Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating complaint',
    });
  }
};

// @desc    Get all complaints of the logged-in student
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Get My Complaints Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching student complaints',
    });
  }
};

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Get All Complaints Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching complaints',
    });
  }
};

// @desc    Get complaint details by ID
// @route   GET /api/complaints/:id
// @access  Private (Owner Student or Admin)
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check permissions: Admin can view any; Student can only view their own
    const isOwner = complaint.studentId && complaint.studentId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own complaints',
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Get Complaint Details Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching complaint details',
    });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    complaint.status = status;
    await complaint.save();

    // Populate student info for response
    await complaint.populate('studentId', 'name email');

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint,
    });
  } catch (error) {
    console.error('Update Complaint Status Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating status',
    });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Student if Pending, or Admin)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = complaint.studentId.toString() === req.user._id.toString();

    // Admin can delete any complaint
    if (isAdmin) {
      await Complaint.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Complaint deleted by admin',
      });
    }

    // Student must be the owner
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete your own complaints',
      });
    }

    // Student can ONLY delete while status is "Pending"
    if (complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Complaints can only be deleted while status is Pending',
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    console.error('Delete Complaint Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting complaint',
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
};
