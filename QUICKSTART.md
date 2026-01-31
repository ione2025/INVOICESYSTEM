# Quick Start Guide - IONE Invoice System

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 3: Access the Web Interface
Open your browser and navigate to: **http://localhost:3000**

---

## 📱 Using the Web Interface

### Dashboard
View real-time statistics:
- Total users, invoices, and transactions
- Total revenue and IONE commission
- Paid invoices count

### Create Users
1. Click **"Create User"** tab
2. Fill in the form (name, email, type: buyer/seller)
3. Optional: Add phone, company, address
4. Click **"Create User"**

### Create Invoices
1. Click **"Create Invoice"** tab
2. Select seller and buyer from dropdowns
3. Add invoice items (description, quantity, price)
4. Optional: Add tax, due date, notes
5. Click **"+ Add Item"** for multiple items
6. Click **"Create Invoice"**

### Process Payments
1. Go to **"Invoices"** tab
2. Find a pending invoice
3. Click **"Process Payment"** button
4. Payment processes through IONE (2.5% commission)

### View Transactions
1. Click **"Transactions"** tab
2. Filter by status: All, Completed, Pending
3. View commission breakdown for each transaction

---

## 🧪 Test with Sample Data

Run these commands to create test data:

### Create a Buyer
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@techcorp.com",
    "type": "buyer",
    "company": "Tech Corp"
  }'
```

### Create a Seller
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@supplies.com",
    "type": "seller",
    "company": "Supplies Inc"
  }'
```

Note: Copy the IDs from the responses to use in the next step.

### Create an Invoice
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "PASTE_SELLER_ID_HERE",
    "buyerId": "PASTE_BUYER_ID_HERE",
    "items": [
      {
        "description": "Premium Widget",
        "quantity": 5,
        "unitPrice": 25.00
      }
    ],
    "tax": 10.00
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:3000/api/transactions/process \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "PASTE_INVOICE_ID_HERE",
    "paymentMethod": "credit_card"
  }'
```

---

## 📊 Understanding IONE Commission

**Commission Rate:** 2.5%

**Example Transaction:**
- Invoice Total: $100.00
- IONE Commission: $2.50 (2.5% of $100)
- Seller Receives: $97.50

The commission is automatically calculated and displayed in:
- Invoice details (ioneCommission field)
- Transaction breakdown
- Platform statistics

---

## 🔧 API Endpoints

Base URL: `http://localhost:3000/api`

### Main Endpoints:
- **Users**: `/api/users` - Manage buyers and sellers
- **Invoices**: `/api/invoices` - Create and manage invoices
- **Transactions**: `/api/transactions` - Process payments and view history
- **Statistics**: `/api/transactions/statistics` - Platform metrics

See **API_DOCUMENTATION.md** for complete API reference.

---

## 💡 Common Use Cases

### Scenario 1: New Customer Purchase
1. Create buyer (if new customer)
2. Create invoice with items
3. Process payment
4. View transaction confirmation

### Scenario 2: Multiple Items Invoice
1. Create invoice
2. Use "+ Add Item" to add multiple products/services
3. System automatically calculates subtotal and IONE commission
4. Process payment

### Scenario 3: View Seller Earnings
1. Go to Transactions tab
2. Check "Seller Receives" amount
3. View Statistics to see total revenue minus commission

---

## 🎨 Features Highlight

✅ **Automatic Calculations**
- Subtotals calculated from items
- Tax added to subtotal
- IONE commission (2.5%) automatically computed

✅ **Status Tracking**
- Invoices: pending → processing → paid
- Transactions: pending → completed

✅ **Professional Interface**
- Modern gradient design
- Responsive layout
- Real-time updates
- Filter and search capabilities

✅ **Data Validation**
- Email format validation
- Required field checks
- Positive number validation for prices

---

## 🔒 Security Notes

For production deployment:
- [ ] Add user authentication (JWT tokens)
- [ ] Implement HTTPS
- [ ] Add database (PostgreSQL/MongoDB)
- [ ] Integrate real payment gateway
- [ ] Add rate limiting
- [ ] Implement audit logging

---

## 📞 Need Help?

- Review **README.md** for detailed documentation
- Check **API_DOCUMENTATION.md** for API reference
- Open an issue on GitHub for support

---

## 🎯 Next Steps

After running the system:
1. Explore the web interface
2. Create sample users and invoices
3. Test the payment processing
4. Review the API documentation
5. Customize for your business needs

**Happy invoicing with IONE! 🚀**
