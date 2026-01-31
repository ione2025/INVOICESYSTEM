const Transaction = require('../models/Transaction');
const dataStore = require('../utils/dataStore');

class TransactionController {
  // Process payment through IONE
  static processPayment(req, res) {
    try {
      const { invoiceId, paymentMethod, metadata } = req.body;

      // Get invoice
      const invoice = dataStore.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      // Check if invoice is already paid
      if (invoice.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Invoice is already paid'
        });
      }

      // Verify buyer and seller
      const buyer = dataStore.getUser(invoice.buyerId);
      const seller = dataStore.getUser(invoice.sellerId);

      if (!buyer || !seller) {
        return res.status(400).json({
          success: false,
          message: 'Invalid buyer or seller'
        });
      }

      // Create transaction through IONE
      const transaction = new Transaction({
        invoiceId: invoice.id,
        buyerId: invoice.buyerId,
        sellerId: invoice.sellerId,
        amount: invoice.total,
        ioneCommission: invoice.ioneCommission,
        paymentMethod,
        metadata: {
          ...metadata,
          buyerName: buyer.name,
          sellerName: seller.name,
          invoiceNumber: invoice.invoiceNumber,
          processedBy: 'IONE'
        }
      });

      // Update invoice status to processing
      invoice.updateStatus('processing');
      invoice.ioneTransactionId = transaction.id;
      dataStore.updateInvoice(invoice.id, invoice);

      // Simulate payment processing
      setTimeout(() => {
        // In a real system, this would integrate with payment gateways
        transaction.complete();
        dataStore.updateTransaction(transaction.id, transaction);
        
        // Update invoice status to paid
        invoice.updateStatus('paid');
        dataStore.updateInvoice(invoice.id, invoice);
      }, 100);

      dataStore.addTransaction(transaction);

      res.status(201).json({
        success: true,
        message: 'Payment is being processed through IONE',
        data: {
          transaction: transaction.toJSON(),
          invoice: invoice.toJSON(),
          breakdown: {
            totalAmount: invoice.total,
            ioneCommission: invoice.ioneCommission,
            sellerReceives: transaction.sellerReceives
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error processing payment',
        error: error.message
      });
    }
  }

  // Get all transactions
  static getAllTransactions(req, res) {
    try {
      const { invoiceId, buyerId, sellerId, status } = req.query;
      
      let transactions = dataStore.getAllTransactions();

      if (invoiceId) {
        transactions = transactions.filter(tx => tx.invoiceId === invoiceId);
      }

      if (buyerId) {
        transactions = transactions.filter(tx => tx.buyerId === buyerId);
      }

      if (sellerId) {
        transactions = transactions.filter(tx => tx.sellerId === sellerId);
      }

      if (status) {
        transactions = transactions.filter(tx => tx.status === status);
      }

      res.json({
        success: true,
        count: transactions.length,
        data: transactions.map(tx => tx.toJSON())
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching transactions',
        error: error.message
      });
    }
  }

  // Get transaction by ID
  static getTransactionById(req, res) {
    try {
      const transaction = dataStore.getTransaction(req.params.id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      // Get related invoice and users
      const invoice = dataStore.getInvoice(transaction.invoiceId);
      const buyer = dataStore.getUser(transaction.buyerId);
      const seller = dataStore.getUser(transaction.sellerId);

      res.json({
        success: true,
        data: {
          ...transaction.toJSON(),
          invoice: invoice ? invoice.toJSON() : null,
          buyer: buyer ? buyer.toJSON() : null,
          seller: seller ? seller.toJSON() : null
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching transaction',
        error: error.message
      });
    }
  }

  // Refund transaction
  static refundTransaction(req, res) {
    try {
      const { reason } = req.body;
      const transaction = dataStore.getTransaction(req.params.id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      if (transaction.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Only completed transactions can be refunded'
        });
      }

      transaction.refund(reason);
      dataStore.updateTransaction(transaction.id, transaction);

      // Update invoice status
      const invoice = dataStore.getInvoice(transaction.invoiceId);
      if (invoice) {
        invoice.updateStatus('cancelled');
        dataStore.updateInvoice(invoice.id, invoice);
      }

      res.json({
        success: true,
        message: 'Transaction refunded successfully',
        data: transaction.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error refunding transaction',
        error: error.message
      });
    }
  }

  // Get IONE statistics
  static getIoneStatistics(req, res) {
    try {
      const stats = dataStore.getStatistics();

      res.json({
        success: true,
        data: {
          ...stats,
          platform: 'IONE',
          commissionRate: '2.5%'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }
}

module.exports = TransactionController;
