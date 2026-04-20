const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');

// ── Associations ──────────────────────────────────────────────

// Employer → Jobs (one employer posts many jobs)
User.hasMany(Job, { foreignKey: 'employerId', as: 'postedJobs', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

// Job → Applications (one job has many applications)
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Applicant → Applications (one user submits many applications)
User.hasMany(Application, { foreignKey: 'applicantId', as: 'myApplications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

module.exports = { User, Job, Application };
