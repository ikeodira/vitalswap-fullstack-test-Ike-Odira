# VitalSwap Settlement Accounts API

A RESTful API for managing settlement accounts built with Node.js, Express, and TypeScript.

## Features

- ✅ Get all accounts
- ✅ Get single account by ID
- ✅ Create new account
- ✅ Update existing account
- ✅ Set account as primary
- ✅ Delete account
- ✅ TypeScript support
- ✅ CORS enabled
- ✅ Input validation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
cp .env.example .env
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Get All Accounts
**GET** `/api/accounts`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "bankName": "GTBank Plc",
      "isPrimary": true,
      "businessName": "Akinsola Jegede Enterprises",
      "accountNumber": "0123456789",
      "verified": true,
      "settlementType": "NGN Settlement",
      "icon": "🏛️"
    }
  ],
  "count": 3
}
```

### 2. Get Single Account
**GET** `/api/accounts/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "bankName": "GTBank Plc",
    "isPrimary": true,
    "businessName": "Akinsola Jegede Enterprises",
    "accountNumber": "0123456789",
    "verified": true,
    "settlementType": "NGN Settlement",
    "icon": "🏛️"
  }
}
```

### 3. Create New Account
**POST** `/api/accounts`

**Request Body:**
```json
{
  "bankName": "Access Bank",
  "businessName": "My Business Ltd",
  "accountNumber": "1234567890",
  "verified": true,
  "settlementType": "NGN Settlement",
  "icon": "🏦",
  "isPrimary": false,
  "currency": "NGN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": "generated-id",
    "bankName": "Access Bank",
    "businessName": "My Business Ltd",
    "accountNumber": "1234567890",
    "verified": true,
    "settlementType": "NGN Settlement",
    "icon": "🏦",
    "isPrimary": false,
    "currency": "NGN"
  }
}
```

### 4. Update Account
**PUT** `/api/accounts/:id`

**Request Body:**
```json
{
  "bankName": "Updated Bank Name",
  "accountNumber": "9876543210",
  "icon": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account updated successfully",
  "data": {
    "id": "1",
    "bankName": "Updated Bank Name",
    "accountNumber": "9876543210",
    "icon": null
  }
}
```

### 5. Set Account as Primary
**PATCH** `/api/accounts/:id/set-primary`

**Response:**
```json
{
  "success": true,
  "message": "Account set as primary successfully",
  "data": {
    "id": "2",
    "isPrimary": true
  }
}
```

### 6. Delete Account
**DELETE** `/api/accounts/:id`

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": {
    "id": "1",
    "bankName": "GTBank Plc"
  }
}
```

## Testing with cURL

### Get all accounts:
```bash
curl http://localhost:3000/api/accounts
```

### Create account:
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Access Bank",
    "businessName": "My Business",
    "accountNumber": "1234567890",
    "verified": true,
    "settlementType": "NGN Settlement",
    "icon": "🏦"
  }'
```

### Update account:
```bash
curl -X PUT http://localhost:3000/api/accounts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Updated Bank",
    "icon": null
  }'
```

### Set as primary:
```bash
curl -X PATCH http://localhost:3000/api/accounts/2/set-primary
```

### Delete account:
```bash
curl -X DELETE http://localhost:3000/api/accounts/1
```

## Project Structure

```
.
├── src/
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Notes

- The `icon` field can be `null` or a string (emoji/icon)
- Only one account can be primary at a time
- When setting an account as primary, all others automatically become non-primary
- When deleting a primary account, the first remaining account becomes primary
- Cannot delete the last remaining account

## License

ISC
