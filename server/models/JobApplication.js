// JobApplication.js — Legacy alias kept for backwards compatibility.
// The canonical model is Application.js (used by controllers/application.js).
// This file re-exports Application so any leftover imports of JobApplication
// continue to work without errors.
const Application = require('./Application');
module.exports = Application;