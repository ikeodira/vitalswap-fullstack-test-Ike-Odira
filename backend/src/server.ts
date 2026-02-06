import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface Account {
  id: string;
  bankName: string;
  isPrimary?: boolean;
  businessName: string;
  accountNumber: string;
  verified: boolean;
  settlementType: string;
  icon?: string | null;
  currency?: string;
}

// In-memory database 
let accounts: Account[] = [
  {
    id: "1",
    bankName: "GTBank Plc",
    isPrimary: true,
    businessName: "Akinsola Jegede Enterprises",
    accountNumber: "0123456789",
    verified: true,
    settlementType: "NGN Settlement",
    icon: "🏛️",
  },
  {
    id: "2",
    bankName: "Zenith Bank",
    businessName: "Akinsola Jegede Enterprises",
    accountNumber: "2008912345",
    verified: true,
    settlementType: "NGN Settlement",
    icon: "🏛️",
  },
  {
    id: "3",
    bankName: "Mercury (Evolve Bank & Trust)",
    businessName: "Akinsola Jegede Inc.",
    accountNumber: "2008912345",
    currency: "USD",
    verified: true,
    settlementType: "International Wire",
    icon: "🌐",
  },
];

// Helper function to generate unique IDs
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

// GET /api/accounts - Get all accounts
app.get("/api/accounts", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: accounts,
    count: accounts.length,
  });
});

// GET /api/accounts/:id - Get single account
app.get("/api/accounts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const account = accounts.find((acc) => acc.id === id);

  if (!account) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  res.json({
    success: true,
    data: account,
  });
});

// POST /api/accounts - Create new account
app.post("/api/accounts", (req: Request, res: Response) => {
  const {
    bankName,
    isPrimary,
    businessName,
    accountNumber,
    verified,
    settlementType,
    icon,
    currency,
  } = req.body;

  // Validation
  if (!bankName || !businessName || !accountNumber || !settlementType) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: bankName, businessName, accountNumber, settlementType",
    });
  }

  // If new account is primary, set all others to non-primary
  if (isPrimary) {
    accounts = accounts.map((acc) => ({ ...acc, isPrimary: false }));
  }

  const newAccount: Account = {
    id: generateId(),
    bankName,
    isPrimary: isPrimary || false,
    businessName,
    accountNumber,
    verified: verified || false,
    settlementType,
    icon: icon || null,
    currency,
  };

  accounts.push(newAccount);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: newAccount,
  });
});

// PUT /api/accounts/:id - Update account
app.put("/api/accounts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const accountIndex = accounts.findIndex((acc) => acc.id === id);

  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  const {
    bankName,
    isPrimary,
    businessName,
    accountNumber,
    verified,
    settlementType,
    icon,
    currency,
  } = req.body;

  // If setting this account as primary, set all others to non-primary
  if (isPrimary && !accounts[accountIndex].isPrimary) {
    accounts = accounts.map((acc) => ({ ...acc, isPrimary: false }));
  }

  // Update the account
  accounts[accountIndex] = {
    ...accounts[accountIndex],
    bankName: bankName || accounts[accountIndex].bankName,
    isPrimary:
      isPrimary !== undefined ? isPrimary : accounts[accountIndex].isPrimary,
    businessName: businessName || accounts[accountIndex].businessName,
    accountNumber: accountNumber || accounts[accountIndex].accountNumber,
    verified:
      verified !== undefined ? verified : accounts[accountIndex].verified,
    settlementType: settlementType || accounts[accountIndex].settlementType,
    icon: icon !== undefined ? icon : accounts[accountIndex].icon,
    currency:
      currency !== undefined ? currency : accounts[accountIndex].currency,
  };

  res.json({
    success: true,
    message: "Account updated successfully",
    data: accounts[accountIndex],
  });
});

// PATCH /api/accounts/:id/set-primary - Set account as primary
app.patch("/api/accounts/:id/set-primary", (req: Request, res: Response) => {
  const { id } = req.params;
  const accountIndex = accounts.findIndex((acc) => acc.id === id);

  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  // Set all accounts to non-primary
  accounts = accounts.map((acc) => ({ ...acc, isPrimary: false }));

  // Set this account as primary
  accounts[accountIndex].isPrimary = true;

  res.json({
    success: true,
    message: "Account set as primary successfully",
    data: accounts[accountIndex],
  });
});

// DELETE /api/accounts/:id - Delete account
app.delete("/api/accounts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const accountIndex = accounts.findIndex((acc) => acc.id === id);

  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  const deletedAccount = accounts[accountIndex];

  // Prevent deleting the primary account if it's the only one
  if (deletedAccount.isPrimary && accounts.length === 1) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete the only account",
    });
  }

  // If deleting primary account, set another as primary
  if (deletedAccount.isPrimary && accounts.length > 1) {
    accounts = accounts.filter((acc) => acc.id !== id);
    accounts[0].isPrimary = true;
  } else {
    accounts = accounts.filter((acc) => acc.id !== id);
  }

  res.json({
    success: true,
    message: "Account deleted successfully",
    data: deletedAccount,
  });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` API endpoints:`);
  console.log(`   GET    /api/accounts          - Get all accounts`);
  console.log(`   GET    /api/accounts/:id      - Get single account`);
  console.log(`   POST   /api/accounts          - Create new account`);
  console.log(`   PUT    /api/accounts/:id      - Update account`);
  console.log(`   PATCH  /api/accounts/:id/set-primary - Set as primary`);
  console.log(`   DELETE /api/accounts/:id      - Delete account`);
});

export default app;
