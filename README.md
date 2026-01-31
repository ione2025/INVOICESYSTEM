# IONE Invoice System

A professional invoice management system for e-commerce companies, facilitating transactions between buyers and sellers through the IONE intermediary platform.

## 🚀 Features

- **User Management**: Register and manage buyers and sellers
- **Invoice Creation**: Create detailed invoices with multiple line items
- **Payment Processing**: Process payments through IONE with automated commission (2.5%)
- **Transaction Tracking**: Monitor all transactions with detailed history
- **Status Management**: Track invoice status (pending, processing, paid, cancelled)
- **Real-time Statistics**: View platform statistics and revenue metrics
- **Professional UI**: Modern, responsive web interface

## 📋 System Architecture

The system operates with three main entities:
- **Buyers**: Customers who purchase goods/services
- **Sellers**: Vendors who provide goods/services
- **IONE**: Third-party intermediary that processes payments and charges 2.5% commission

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/ione2025/INVOICESYSTEM.git
cd INVOICESYSTEM
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on port 3000 (or the PORT environment variable if set).

## 📖 Usage

### Web Interface

Access the web interface at `http://localhost:3000`

The interface provides:
- Dashboard with system statistics
- User management (create buyers and sellers)
- Invoice creation and management
- Transaction history and monitoring

### API Endpoints

#### Users API

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (optional: ?type=buyer or ?type=seller)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Invoices API

- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices` - Get all invoices (optional filters: ?sellerId, ?buyerId, ?status)
- `GET /api/invoices/:id` - Get invoice by ID
- `PATCH /api/invoices/:id/status` - Update invoice status
- `DELETE /api/invoices/:id` - Delete invoice (only pending)

#### Transactions API

- `POST /api/transactions/process` - Process payment through IONE
- `GET /api/transactions` - Get all transactions (optional filters: ?invoiceId, ?buyerId, ?sellerId, ?status)
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions/:id/refund` - Refund a transaction
- `GET /api/transactions/statistics` - Get platform statistics

## 📝 API Examples

### Create a Buyer

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "type": "buyer",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "address": "123 Main St"
  }'
```

### Create a Seller

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "type": "seller",
    "phone": "+1987654321",
    "company": "Supplies Inc",
    "address": "456 Oak Ave"
  }'
```

### Create an Invoice

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "seller-uuid",
    "buyerId": "buyer-uuid",
    "items": [
      {
        "description": "Product A",
        "quantity": 2,
        "unitPrice": 50.00
      },
      {
        "description": "Product B",
        "quantity": 1,
        "unitPrice": 75.00
      }
    ],
    "tax": 15.00,
    "notes": "Thank you for your business"
  }'
```

### Process Payment

```bash
curl -X POST http://localhost:3000/api/transactions/process \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "invoice-uuid",
    "paymentMethod": "credit_card"
  }'
```

## 💰 Commission Structure

IONE charges a **2.5% commission** on all transactions:

- Total Invoice Amount: $100.00
- IONE Commission (2.5%): $2.50
- Seller Receives: $97.50

The commission is automatically calculated and tracked in all invoices and transactions.

## 🔧 Technical Stack

- **Backend**: Node.js + Express
- **Data Storage**: In-memory (can be easily replaced with PostgreSQL/MongoDB)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API**: RESTful JSON API

## 📊 Data Models

### User
- id, name, email, type (buyer/seller), address, phone, company, createdAt

### Invoice
- id, invoiceNumber, sellerId, buyerId, items[], subtotal, tax, total, status, ioneCommission, ioneTransactionId, dueDate, notes, createdAt, updatedAt

### Transaction
- id, invoiceId, buyerId, sellerId, amount, ioneCommission, sellerReceives, paymentMethod, status, metadata, createdAt, completedAt

## 🔒 Security Considerations

For production use, consider implementing:
- User authentication (JWT tokens)
- Authorization and role-based access control
- HTTPS encryption
- Input validation and sanitization
- Rate limiting
- Database with proper indexing
- Payment gateway integration (Stripe, PayPal, etc.)
- Audit logging

## 🚦 Status Workflow

### Invoice Statuses
1. **pending** - Invoice created, awaiting payment
2. **processing** - Payment is being processed
3. **paid** - Payment completed successfully
4. **cancelled** - Invoice cancelled or refunded

### Transaction Statuses
1. **pending** - Transaction initiated
2. **completed** - Payment successful
3. **failed** - Payment failed
4. **refunded** - Transaction refunded

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@ione.com or open an issue in the repository.