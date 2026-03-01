require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const collectionsRouter = require('./routes/collections');
const productsRouter = require('./routes/products');
const searchRouter = require('./routes/search');
const facetsRouter = require('./routes/facets');
const adminProductsRouter = require('./routes/admin-products');
const adminCollectionsRouter = require('./routes/admin-collections');
const adminUploadRouter = require('./routes/admin-upload');
const cargoRouter = require('./routes/cargo');
const adminOrdersRouter = require('./routes/admin-orders');
const adminCustomersRouter = require('./routes/admin-customers');

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const IS_PRODUCTION = fs.existsSync(DIST_DIR);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files in production
if (IS_PRODUCTION) {
  app.use(express.static(DIST_DIR));
}

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

// Cargo tracking
app.use('/api/cargo', cargoRouter);

// Admin API Routes (Protected)
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/collections', adminCollectionsRouter);
app.use('/api/admin/upload', adminUploadRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/customers', adminCustomersRouter);

// SPA fallback — serve index.html for any non-API route in production
if (IS_PRODUCTION) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// 404 handler (API only — frontend handled above)
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
  console.log(`\n🚀 Fitnlitt Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${IS_PRODUCTION ? DIST_DIR : 'dev mode (Vite)'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});
