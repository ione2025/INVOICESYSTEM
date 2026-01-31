const Invoice = require('../models/Invoice');
const dataStore = require('../utils/dataStore');

class InvoiceController {
  // Create a new invoice
  static createInvoice(req, res) {
    try {
      const validation = Invoice.validate(req.body);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      // Verify buyer and seller exist
      const buyer = dataStore.getUser(req.body.buyerId);
      const seller = dataStore.getUser(req.body.sellerId);

      if (!buyer || buyer.type !== 'buyer') {
        return res.status(400).json({
          success: false,
          message: 'Invalid buyer ID'
        });
      }

      if (!seller || seller.type !== 'seller') {
        return res.status(400).json({
          success: false,
          message: 'Invalid seller ID'
        });
      }

      const invoice = new Invoice(req.body);
      dataStore.addInvoice(invoice);

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating invoice',
        error: error.message
      });
    }
  }

  // Get all invoices
  static getAllInvoices(req, res) {
    try {
      const { sellerId, buyerId, status } = req.query;
      
      let invoices = dataStore.getAllInvoices();

      if (sellerId) {
        invoices = invoices.filter(inv => inv.sellerId === sellerId);
      }

      if (buyerId) {
        invoices = invoices.filter(inv => inv.buyerId === buyerId);
      }

      if (status) {
        invoices = invoices.filter(inv => inv.status === status);
      }

      res.json({
        success: true,
        count: invoices.length,
        data: invoices.map(inv => inv.toJSON())
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching invoices',
        error: error.message
      });
    }
  }

  // Get invoice by ID
  static getInvoiceById(req, res) {
    try {
      const invoice = dataStore.getInvoice(req.params.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      // Get buyer and seller details
      const buyer = dataStore.getUser(invoice.buyerId);
      const seller = dataStore.getUser(invoice.sellerId);

      res.json({
        success: true,
        data: {
          ...invoice.toJSON(),
          buyer: buyer ? buyer.toJSON() : null,
          seller: seller ? seller.toJSON() : null
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching invoice',
        error: error.message
      });
    }
  }

  // Update invoice status
  static updateInvoiceStatus(req, res) {
    try {
      const { status } = req.body;
      const invoice = dataStore.getInvoice(req.params.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      const validStatuses = ['pending', 'processing', 'paid', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      invoice.updateStatus(status);
      dataStore.updateInvoice(invoice.id, invoice);

      res.json({
        success: true,
        message: 'Invoice status updated successfully',
        data: invoice.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating invoice status',
        error: error.message
      });
    }
  }

  // Delete invoice
  static deleteInvoice(req, res) {
    try {
      const invoice = dataStore.getInvoice(req.params.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      // Only allow deletion of pending invoices
      if (invoice.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending invoices can be deleted'
        });
      }

      dataStore.deleteInvoice(req.params.id);

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting invoice',
        error: error.message
      });
    }
  }
}

module.exports = InvoiceController;
