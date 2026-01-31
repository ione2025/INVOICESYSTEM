const { v4: uuidv4 } = require('uuid');

class User {
  constructor({ id, name, email, type, address, phone, company }) {
    this.id = id || uuidv4();
    this.name = name;
    this.email = email;
    this.type = type; // 'buyer' or 'seller'
    this.address = address;
    this.phone = phone;
    this.company = company;
    this.createdAt = new Date().toISOString();
  }

  static validate(userData) {
    const errors = [];
    
    if (!userData.name) errors.push('Name is required');
    if (!userData.email) errors.push('Email is required');
    if (!userData.type || !['buyer', 'seller'].includes(userData.type)) {
      errors.push('Type must be either buyer or seller');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      type: this.type,
      address: this.address,
      phone: this.phone,
      company: this.company,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
