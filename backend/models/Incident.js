const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required'],
    },
    incidentTime: {
      type: String,
      required: [true, 'Incident time is required'],
    },
    category: {
      type: String,
      enum: [
        'Chemical Leak', 'Fire Hazard', 'Equipment Failure', 'Electrical Hazard',
        'Gas Leak', 'Near Miss', 'Unsafe Condition', 'PPE Violation', 'Oil Spill', 'Other',
      ],
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'Under Investigation', 'Assigned', 'Resolved', 'Closed'],
      default: 'Open',
    },
    images: [{ type: String }],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    managerRemarks: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      category: String,
      severityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
      },
      riskScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      rootCauses: [String],
      immediateActions: [String],
      preventiveMeasures: [String],
      requiredPPE: [String],
      environmentalImpact: String,
      recommendedInvestigation: String,
      executiveSummary: String,
      generatedAt: Date,
      isGenerated: {
        type: Boolean,
        default: false,
      },
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Open', 'Under Investigation', 'Assigned', 'Resolved', 'Closed'],
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

incidentSchema.index({ status: 1 });
incidentSchema.index({ reporter: 1 });
incidentSchema.index({ department: 1 });
incidentSchema.index({ 'aiAnalysis.riskScore': 1 });

module.exports = mongoose.model('Incident', incidentSchema);
