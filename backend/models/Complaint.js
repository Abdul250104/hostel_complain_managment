const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a complaint description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
      enum: {
        values: ['Electricity', 'Water', 'Cleaning', 'Wi-Fi', 'Other'],
        message: 'Category must be Electricity, Water, Cleaning, Wi-Fi, or Other',
      },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Pending', 'In Progress', 'Resolved'],
        message: 'Status must be Pending, In Progress, or Resolved',
      },
      default: 'Pending',
    },
    roomNumber: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
