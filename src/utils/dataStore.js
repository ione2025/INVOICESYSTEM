// In-memory data storage
// In production, this would be replaced with a database like PostgreSQL or MongoDB

class DataStore {
  constructor() {
    this.users = new Map();
    this.invoices = new Map();
    this.transactions = new Map();
  }

  // User operations
  addUser(user) {
    this.users.set(user.id, user);
    return user;
  }

  getUser(id) {
    return this.users.get(id);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  getUsersByType(type) {
    return Array.from(this.users.values()).filter(user => user.type === type);
  }

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (user) {
      Object.assign(user, updates);
      this.users.set(id, user);
      return user;
    }
    return null;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }

  // Invoice operations
  addInvoice(invoice) {
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  getInvoice(id) {
    return this.invoices.get(id);
  }

  getAllInvoices() {
    return Array.from(this.invoices.values());
  }

  getInvoicesBySeller(sellerId) {
    return Array.from(this.invoices.values()).filter(inv => inv.sellerId === sellerId);
  }

  getInvoicesByBuyer(buyerId) {
    return Array.from(this.invoices.values()).filter(inv => inv.buyerId === buyerId);
  }

  updateInvoice(id, updates) {
    const invoice = this.invoices.get(id);
    if (invoice) {
      Object.assign(invoice, updates);
      invoice.updatedAt = new Date().toISOString();
      this.invoices.set(id, invoice);
      return invoice;
    }
    return null;
  }

  deleteInvoice(id) {
    return this.invoices.delete(id);
  }

  // Transaction operations
  addTransaction(transaction) {
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  getTransaction(id) {
    return this.transactions.get(id);
  }

  getAllTransactions() {
    return Array.from(this.transactions.values());
  }

  getTransactionsByInvoice(invoiceId) {
    return Array.from(this.transactions.values()).filter(tx => tx.invoiceId === invoiceId);
  }

  getTransactionsByBuyer(buyerId) {
    return Array.from(this.transactions.values()).filter(tx => tx.buyerId === buyerId);
  }

  getTransactionsBySeller(sellerId) {
    return Array.from(this.transactions.values()).filter(tx => tx.sellerId === sellerId);
  }

  updateTransaction(id, updates) {
    const transaction = this.transactions.get(id);
    if (transaction) {
      Object.assign(transaction, updates);
      this.transactions.set(id, transaction);
      return transaction;
    }
    return null;
  }

  // Statistics
  getStatistics() {
    const invoices = Array.from(this.invoices.values());
    const transactions = Array.from(this.transactions.values());
    
    const totalRevenue = transactions
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalIoneCommission = transactions
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.ioneCommission, 0);
    
    return {
      totalUsers: this.users.size,
      totalBuyers: this.getUsersByType('buyer').length,
      totalSellers: this.getUsersByType('seller').length,
      totalInvoices: this.invoices.size,
      totalTransactions: this.transactions.size,
      totalRevenue,
      totalIoneCommission,
      invoicesByStatus: {
        pending: invoices.filter(inv => inv.status === 'pending').length,
        processing: invoices.filter(inv => inv.status === 'processing').length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        cancelled: invoices.filter(inv => inv.status === 'cancelled').length
      }
    };
  }
}

// Create singleton instance
const dataStore = new DataStore();

module.exports = dataStore;
