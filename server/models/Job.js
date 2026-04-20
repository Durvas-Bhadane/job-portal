const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define(
  'Job',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
    },
    responsibilities: {
      type: DataTypes.TEXT,
    },
    // Employer (User) FK — set via associations in models/index.js
    employerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Company FK — set via associations in models/index.js
    companyId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING(200),
    },
    companyLogo: {
      type: DataTypes.STRING(500),
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    jobType: {
      type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
      defaultValue: 'full-time',
    },
    category: {
      type: DataTypes.STRING(100),
    },
    level: {
      // experience level alias used by company controller (entry/mid/senior etc.)
      type: DataTypes.STRING(50),
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    salary: {
      type: DataTypes.INTEGER,
    },
    salaryMin: {
      type: DataTypes.INTEGER,
    },
    salaryMax: {
      type: DataTypes.INTEGER,
    },
    salaryCurrency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    experience: {
      type: DataTypes.ENUM('entry', 'mid', 'senior', 'lead', 'any'),
      defaultValue: 'any',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Visibility toggle used by company dashboard
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deadline: {
      type: DataTypes.DATE,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Unix timestamp for legacy compatibility
    date: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: 'jobs',
    timestamps: true,
  }
);

module.exports = Job;
