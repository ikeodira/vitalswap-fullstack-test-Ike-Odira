const BASE_URL = "https://vitalswap-fullstack-test-ike-odira.onrender.com/api";

export interface Account {
  id?: string; // Optional for creation
  bankName: string;
  isPrimary?: boolean;
  businessName: string;
  accountNumber: string;
  verified?: boolean; // Often driven by backend
  settlementType?: string; // default to 'NGN Settlement' if not provided
  icon?: string; // Optional, maybe derived on frontend
  currency?: string;
}

class ApiError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, errorBody || "Something went wrong");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const fetchAccounts = async (): Promise<Account[]> => {
  const res = await request<{ data: Account[] }>("/accounts");
  return res.data;
};

export const fetchAccount = async (id: string): Promise<Account> => {
  return request<Account>(`/accounts/${id}`);
};

export const createAccount = async (
  account: Omit<Account, "id">
): Promise<Account> => {
  return request<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(account),
  });
};

export const updateAccount = async (
  id: string,
  account: Partial<Account>
): Promise<Account> => {
  return request<Account>(`/accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(account),
  });
};

export const setPrimaryAccount = async (id: string): Promise<Account> => {
  return request<Account>(`/accounts/${id}/set-primary`, {
    method: "PATCH",
  });
};

export const deleteAccount = async (id: string): Promise<void> => {
  return request<void>(`/accounts/${id}`, {
    method: "DELETE",
  });
};
