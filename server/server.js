require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { clerkMiddleware } = require('@clerk/express');

// Initialize Express
const app = express();

// Connect to PostgreSQL RDS
connectDB();

// Routes
const { clerkWebhooks } = require('./controllers/webhooks');

// Webhook route MUST come before express.json() to get raw body
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Populates req.auth for clerk users

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');

app.get('/', (req, res) => res.send('Job Portal API is running.'));
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});