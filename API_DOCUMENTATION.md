# IONE Invoice System - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. For production, implement JWT-based authentication.

---

## Users API

### Create User
Create a new buyer or seller.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "type": "buyer",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "address": "123 Main St"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Buyer created successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "buyer",
    "address": "123 Main St",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "createdAt": "2026-01-31T03:51:17.080Z"
  }
}
```

### Get All Users
Retrieve all users, optionally filtered by type.

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `type` (optional): Filter by user type (`buyer` or `seller`)

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

### Get User by ID
Retrieve a specific user by their ID.

**Endpoint:** `GET /api/users/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    ...
  }
}
```

### Update User
Update user information.

**Endpoint:** `PUT /api/users/:id`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

**Response:** `200 OK`

### Delete User
Delete a user.

**Endpoint:** `DELETE /api/users/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Invoices API

### Create Invoice
Create a new invoice.

**Endpoint:** `POST /api/invoices`

**Request Body:**
```json
{
  "sellerId": "seller-uuid",
  "buyerId": "buyer-uuid",
  "items": [
    {
      "description": "Product A",
      "quantity": 2,
      "unitPrice": 50.00
    },
    {
      "description": "Service B",
      "quantity": 1,
      "unitPrice": 75.00
    }
  ],
  "tax": 15.00,
  "dueDate": "2026-02-15",
  "notes": "Thank you for your business"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-1769831487250-782",
    "sellerId": "seller-uuid",
    "buyerId": "buyer-uuid",
    "items": [...],
    "subtotal": 175.00,
    "tax": 15.00,
    "total": 190.00,
    "status": "pending",
    "ioneCommission": 4.75,
    "ioneTransactionId": null,
    "dueDate": "2026-02-15",
    "notes": "Thank you for your business",
    "createdAt": "2026-01-31T03:51:27.250Z",
    "updatedAt": "2026-01-31T03:51:27.250Z"
  }
}
```

### Get All Invoices
Retrieve all invoices with optional filters.

**Endpoint:** `GET /api/invoices`

**Query Parameters:**
- `sellerId` (optional): Filter by seller ID
- `buyerId` (optional): Filter by buyer ID
- `status` (optional): Filter by status (`pending`, `processing`, `paid`, `cancelled`)

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Get Invoice by ID
Retrieve a specific invoice with buyer and seller details.

**Endpoint:** `GET /api/invoices/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-...",
    ...,
    "buyer": {...},
    "seller": {...}
  }
}
```

### Update Invoice Status
Update the status of an invoice.

**Endpoint:** `PATCH /api/invoices/:id/status`

**Request Body:**
```json
{
  "status": "paid"
}
```

**Valid statuses:** `pending`, `processing`, `paid`, `cancelled`

**Response:** `200 OK`

### Delete Invoice
Delete a pending invoice.

**Endpoint:** `DELETE /api/invoices/:id`

**Note:** Only invoices with status `pending` can be deleted.

**Response:** `200 OK`

---

## Transactions API

### Process Payment
Process payment for an invoice through IONE.

**Endpoint:** `POST /api/transactions/process`

**Request Body:**
```json
{
  "invoiceId": "invoice-uuid",
  "paymentMethod": "credit_card",
  "metadata": {
    "cardLast4": "4242"
  }
}
```

**Valid payment methods:** `credit_card`, `bank_transfer`, `paypal`, etc.

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Payment is being processed through IONE",
  "data": {
    "transaction": {
      "id": "uuid",
      "invoiceId": "invoice-uuid",
      "buyerId": "buyer-uuid",
      "sellerId": "seller-uuid",
      "amount": 297.50,
      "ioneCommission": 7.44,
      "sellerReceives": 290.06,
      "paymentMethod": "credit_card",
      "status": "pending",
      "metadata": {...},
      "createdAt": "2026-01-31T03:51:31.680Z",
      "completedAt": null
    },
    "invoice": {...},
    "breakdown": {
      "totalAmount": 297.50,
      "ioneCommission": 7.44,
      "sellerReceives": 290.06
    }
  }
}
```

### Get All Transactions
Retrieve all transactions with optional filters.

**Endpoint:** `GET /api/transactions`

**Query Parameters:**
- `invoiceId` (optional): Filter by invoice ID
- `buyerId` (optional): Filter by buyer ID
- `sellerId` (optional): Filter by seller ID
- `status` (optional): Filter by status (`pending`, `completed`, `failed`, `refunded`)

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### Get Transaction by ID
Retrieve a specific transaction with related data.

**Endpoint:** `GET /api/transactions/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceId": "invoice-uuid",
    ...,
    "invoice": {...},
    "buyer": {...},
    "seller": {...}
  }
}
```

### Refund Transaction
Refund a completed transaction.

**Endpoint:** `POST /api/transactions/:id/refund`

**Request Body:**
```json
{
  "reason": "Customer requested refund"
}
```

**Note:** Only transactions with status `completed` can be refunded.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Transaction refunded successfully",
  "data": {...}
}
```

### Get Platform Statistics
Get comprehensive statistics about the IONE platform.

**Endpoint:** `GET /api/transactions/statistics`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "totalBuyers": 6,
    "totalSellers": 4,
    "totalInvoices": 25,
    "totalTransactions": 20,
    "totalRevenue": 15000.00,
    "totalIoneCommission": 375.00,
    "invoicesByStatus": {
      "pending": 3,
      "processing": 1,
      "paid": 20,
      "cancelled": 1
    },
    "platform": "IONE",
    "commissionRate": "2.5%"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "errors": ["Error message 1", "Error message 2"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (development mode only)"
}
```

---

## Commission Calculation

IONE charges a **2.5% commission** on all transactions:

- **Formula:** `commission = total × 0.025`
- **Seller Receives:** `amount - commission`

**Example:**
- Invoice Total: $100.00
- IONE Commission: $2.50 (2.5%)
- Seller Receives: $97.50

---

## Status Workflows

### Invoice Status Flow
```
pending → processing → paid
   ↓
cancelled
```

### Transaction Status Flow
```
pending → completed
   ↓           ↓
failed     refunded
```

---

## Rate Limiting

For production deployment, implement rate limiting:
- Standard users: 100 requests per minute
- Premium users: 1000 requests per minute

---

## Webhooks (Future Feature)

Future versions will support webhooks for:
- Invoice created
- Invoice paid
- Transaction completed
- Transaction failed
- Refund processed

---

## Testing with cURL

### Complete Example Workflow

1. **Create a buyer:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","type":"buyer"}'
```

2. **Create a seller:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@example.com","type":"seller"}'
```

3. **Create an invoice:**
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId":"<seller-id>",
    "buyerId":"<buyer-id>",
    "items":[{"description":"Product","quantity":1,"unitPrice":100}],
    "tax":10
  }'
```

4. **Process payment:**
```bash
curl -X POST http://localhost:3000/api/transactions/process \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId":"<invoice-id>",
    "paymentMethod":"credit_card"
  }'
```

5. **View statistics:**
```bash
curl http://localhost:3000/api/transactions/statistics
```
