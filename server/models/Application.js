const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define(
  'Application',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // FKs set in models/index.js
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    applicantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Company that owns this job (denormalized for quick company-level queries)
    companyId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Application content
    coverLetter: {
      type: DataTypes.TEXT,
    },
    resumeUrl: {
      type: DataTypes.STRING(500), // S3 URL
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'reviewing',
        'shortlisted',
        'interviewed',
        'offered',
        'rejected',
        'withdrawn',
        // legacy statuses used by old company controller
        'Pending',
        'Accepted',
        'Rejected'
      ),
      defaultValue: 'pending',
    },
    employerNote: {
      type: DataTypes.TEXT,
    },
    appliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Unix timestamp for legacy compatibility
    date: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'applications',
    timestamps: true,
    indexes: [
      {
        // Prevent duplicate applications
        unique: true,
        fields: ['jobId', 'applicantId'],
      },
    ],
  }
);

module.exports = Application;
