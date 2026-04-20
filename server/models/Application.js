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
      type: DataTypes.UUID,
      allowNull: false,
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
        'withdrawn'
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
