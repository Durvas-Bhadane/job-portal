const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const Company = require('./Company');

// ── Associations ──────────────────────────────────────────────

// Employer (User) → Jobs (one employer posts many jobs)
User.hasMany(Job, { foreignKey: 'employerId', as: 'postedJobs', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

// Job → Applications (one job has many applications)
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Applicant (User) → Applications (one user submits many applications)
User.hasMany(Application, { foreignKey: 'applicantId', as: 'myApplications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

// Company → Jobs (a company can also own jobs via companyId)
Company.hasMany(Job, { foreignKey: 'companyId', as: 'companyJobs', onDelete: 'CASCADE' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Company → Applications (a company sees all applications for their jobs)
Company.hasMany(Application, { foreignKey: 'companyId', as: 'companyApplications', onDelete: 'CASCADE' });
Application.belongsTo(Company, { foreignKey: 'companyId', as: 'hiringCompany' });

module.exports = { User, Job, Application, Company };
