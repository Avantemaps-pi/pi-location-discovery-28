
/**
 * Payment API types
 */

export interface PaymentRequest {
  paymentId: string;
  userId: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  txid?: string;
  status?: PaymentStatus;
}

export interface PaymentStatus {
  paymentId: string;
  txid?: string;
  verified: boolean;
  completed: boolean;
  cancelled: boolean;
  error?: string;
}

export interface StoredPayment {
  id: string;
  userId: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  txid?: string;
  status: {
    verified: boolean;
    completed: boolean;
    cancelled: boolean;
    error?: string;
  };
  createdAt: number;
  updatedAt: number;
}
