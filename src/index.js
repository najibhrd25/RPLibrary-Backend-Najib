const app = require('./app');
const dotenv = require('dotenv');

// Ensure the environment variables are loaded before server starts
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start the Express server gracefully
const server = app.listen(PORT, () => {
  console.log(`[SERVER] 🚀 RPLibrary API is running perfectly on http://localhost:${PORT}`);
});

// Global catch for unhandled promise rejections to prevent silent crashes
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION] 💥 Shutting down gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
