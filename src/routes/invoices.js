const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/invoiceController');

// Invoice routes
router.post('/', InvoiceController.createInvoice);
router.get('/', InvoiceController.getAllInvoices);
router.get('/:id', InvoiceController.getInvoiceById);
router.patch('/:id/status', InvoiceController.updateInvoiceStatus);
router.delete('/:id', InvoiceController.deleteInvoice);

module.exports = router;
