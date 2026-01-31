const { v4: uuidv4 } = require('uuid');

class Invoice {
  constructor({ 
    id, 
    invoiceNumber,
    sellerId, 
    buyerId, 
    items, 
    subtotal, 
    tax,
    total,
    status,
    dueDate,
    notes 
  }) {
    this.id = id || uuidv4();
    this.invoiceNumber = invoiceNumber || this.generateInvoiceNumber();
    this.sellerId = sellerId;
    this.buyerId = buyerId;
    this.items = items || [];
    this.subtotal = subtotal || this.calculateSubtotal();
    this.tax = tax || 0;
    this.total = total || this.calculateTotal();
    this.status = status || 'pending'; // pending, paid, cancelled, processing
    this.dueDate = dueDate;
    this.notes = notes;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    
    // IONE intermediary tracking
    this.ioneTransactionId = null;
    this.ioneCommission = this.calculateIoneCommission();
  }

  generateInvoiceNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${timestamp}-${random}`;
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  }

  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    return subtotal + this.tax;
  }

  calculateIoneCommission() {
    // IONE charges 2.5% commission as intermediary
    const total = this.calculateTotal();
    return total * 0.025;
  }

  addItem(item) {
    this.items.push({
      id: uuidv4(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice
    });
    this.updateCalculations();
  }

  updateCalculations() {
    this.subtotal = this.calculateSubtotal();
    this.total = this.calculateTotal();
    this.ioneCommission = this.calculateIoneCommission();
    this.updatedAt = new Date().toISOString();
  }

  updateStatus(newStatus) {
    const validStatuses = ['pending', 'processing', 'paid', 'cancelled'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      this.updatedAt = new Date().toISOString();
    }
  }

  static validate(invoiceData) {
    const errors = [];
    
    if (!invoiceData.sellerId) errors.push('Seller ID is required');
    if (!invoiceData.buyerId) errors.push('Buyer ID is required');
    if (!invoiceData.items || invoiceData.items.length === 0) {
      errors.push('At least one item is required');
    }
    
    // Validate items
    if (invoiceData.items) {
      invoiceData.items.forEach((item, index) => {
        if (!item.description) errors.push(`Item ${index + 1}: Description is required`);
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
        }
        if (!item.unitPrice || item.unitPrice <= 0) {
          errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      sellerId: this.sellerId,
      buyerId: this.buyerId,
      items: this.items,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      status: this.status,
      dueDate: this.dueDate,
      notes: this.notes,
      ioneTransactionId: this.ioneTransactionId,
      ioneCommission: this.ioneCommission,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Invoice;
