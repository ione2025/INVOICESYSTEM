const { v4: uuidv4 } = require('uuid');

class Transaction {
  constructor({ 
    id,
    invoiceId,
    buyerId,
    sellerId,
    amount,
    ioneCommission,
    paymentMethod,
    status,
    metadata
  }) {
    this.id = id || uuidv4();
    this.invoiceId = invoiceId;
    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.amount = amount;
    this.ioneCommission = ioneCommission;
    this.sellerReceives = amount - ioneCommission; // Amount seller receives after IONE commission
    this.paymentMethod = paymentMethod; // 'credit_card', 'bank_transfer', 'paypal', etc.
    this.status = status || 'pending'; // pending, completed, failed, refunded
    this.metadata = metadata || {};
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
  }

  complete() {
    this.status = 'completed';
    this.completedAt = new Date().toISOString();
  }

  fail(reason) {
    this.status = 'failed';
    this.metadata.failureReason = reason;
  }

  refund(reason) {
    this.status = 'refunded';
    this.metadata.refundReason = reason;
    this.metadata.refundedAt = new Date().toISOString();
  }

  static validate(transactionData) {
    const errors = [];
    
    if (!transactionData.invoiceId) errors.push('Invoice ID is required');
    if (!transactionData.buyerId) errors.push('Buyer ID is required');
    if (!transactionData.sellerId) errors.push('Seller ID is required');
    if (!transactionData.amount || transactionData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    if (!transactionData.paymentMethod) {
      errors.push('Payment method is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      invoiceId: this.invoiceId,
      buyerId: this.buyerId,
      sellerId: this.sellerId,
      amount: this.amount,
      ioneCommission: this.ioneCommission,
      sellerReceives: this.sellerReceives,
      paymentMethod: this.paymentMethod,
      status: this.status,
      metadata: this.metadata,
      createdAt: this.createdAt,
      completedAt: this.completedAt
    };
  }
}

module.exports = Transaction;
