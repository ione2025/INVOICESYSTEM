const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const invoiceRoutes = require('./routes/invoices');
const transactionRoutes = require('./routes/transactions');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/transactions', transactionRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to IONE Invoice System API',
    version: '1.0.0',
    description: 'Professional invoice system for e-commerce transactions between buyers and sellers',
    endpoints: {
      users: '/api/users',
      invoices: '/api/invoices',
      transactions: '/api/transactions'
    },
    features: [
      'User management (buyers and sellers)',
      'Invoice creation and management',
      'Payment processing through IONE intermediary',
      'Automatic commission calculation (2.5%)',
      'Transaction tracking and reporting',
      'Real-time statistics'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     IONE INVOICE SYSTEM - Professional E-Commerce         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Server running on port ${PORT}
API Documentation: http://localhost:${PORT}/api

Available Endpoints:
  - Users:        http://localhost:${PORT}/api/users
  - Invoices:     http://localhost:${PORT}/api/invoices
  - Transactions: http://localhost:${PORT}/api/transactions

Features:
  ✓ Buyer/Seller Management
  ✓ Invoice Creation & Tracking
  ✓ Payment Processing via IONE
  ✓ Automated Commission (2.5%)
  ✓ Transaction History
  ✓ Real-time Statistics

Ready to accept requests!
`);
});

module.exports = app;
