const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
// Allow Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON payloads with a reasonable limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 2. STATIC FOLDERS
// ==========================================
// Serve uploaded files statically so they can be accessed via URL
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// 3. ROUTES (Entry Points)
// ==========================================
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const transactionRoutes = require('./routes/transaction.routes');

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the RPLibrary API! 🚀',
  });
});

// Configure API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);

// ==========================================
// 4. FALLBACK & ERROR HANDLING
// ==========================================

// Handle 404 Not Found
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.method} ${req.originalUrl} on this server.`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err); // Log the error trace for debugging

  // Formatting error response
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Optional: send stack trace only during development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
