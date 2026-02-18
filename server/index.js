require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const collectionsRouter = require('./routes/collections');
const productsRouter = require('./routes/products');
const searchRouter = require('./routes/search');
const facetsRouter = require('./routes/facets');
const adminProductsRouter = require('./routes/admin-products');
const adminCollectionsRouter = require('./routes/admin-collections');
const adminUploadRouter = require('./routes/admin-upload');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/collections', collectionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api/facets', facetsRouter);

// Admin API Routes (Protected)
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/collections', adminCollectionsRouter);
app.use('/api/admin/upload', adminUploadRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Fitnlitt API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});
