const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');

// Transaction routes
router.post('/process', TransactionController.processPayment);
router.get('/', TransactionController.getAllTransactions);
router.get('/statistics', TransactionController.getIoneStatistics);
router.get('/:id', TransactionController.getTransactionById);
router.post('/:id/refund', TransactionController.refundTransaction);

module.exports = router;
