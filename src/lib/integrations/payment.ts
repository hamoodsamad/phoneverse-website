export type PaymentProviderType = 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank_transfer';

export interface PaymentInitiationResult {
  paymentId: string;
  provider: PaymentProviderType;
  status: 'pending' | 'requires_action' | 'paid' | 'failed';
  redirectUrl?: string;
  instructions?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId?: string;
  amountPkr: number;
  paidAt?: string;
  errorMessage?: string;
}

export class PaymentGatewayService {
  private activeProvider: PaymentProviderType;

  constructor() {
    this.activeProvider = (process.env.PAYMENT_GATEWAY_PROVIDER as PaymentProviderType) || 'cod';
  }

  /**
   * Initializes order payment according to selected method
   */
  async initiatePayment(orderId: string, amountPkr: number, method: PaymentProviderType): Promise<PaymentInitiationResult> {
    switch (method) {
      case 'cod':
        // Cash on delivery: Validated on fulfillment
        return {
          paymentId: `COD_${orderId}`,
          provider: 'cod',
          status: 'pending',
          instructions: 'Pay in exact cash to the courier upon delivery anywhere in Pakistan. Open parcel policy available upon request.'
        };

      case 'bank_transfer':
        return {
          paymentId: `IBFT_${orderId}`,
          provider: 'bank_transfer',
          status: 'pending',
          instructions: 'Please transfer to Meezan Bank / HBL. Account: 0102-1234567890 (PhoneVerse Pakistan). Send payment screenshot to orders@phoneverse.com with your order number.'
        };

      case 'jazzcash':
      case 'easypaisa':
        // If credentials not set, flag as pending setup
        if (!process.env.PAYMENT_GATEWAY_SECRET_KEY) {
          return {
            paymentId: `MWALLET_${orderId}`,
            provider: method,
            status: 'pending',
            instructions: `${method.toUpperCase()} gateway sandbox mode: Enter your mobile wallet account number at courier hand-over or direct QR checkout.`
          };
        }
        return {
          paymentId: `PAY_${Date.now()}`,
          provider: method,
          status: 'requires_action',
          redirectUrl: `https://payment-gateway.example.com/checkout?order=${orderId}`
        };

      case 'card':
      default:
        return {
          paymentId: `CARD_${orderId}`,
          provider: 'card',
          status: 'pending',
          instructions: 'Secure 3D-secure card verification.'
        };
    }
  }

  /**
   * Verifies payment webhook or confirmation
   */
  async verifyPayment(paymentId: string): Promise<PaymentVerificationResult> {
    // Never falsely mark an unverified order as paid
    if (paymentId.startsWith('COD_')) {
      return {
        success: false,
        amountPkr: 0,
        errorMessage: 'Cash on Delivery orders are marked paid strictly after delivery carrier settlement.'
      };
    }

    return {
      success: false,
      amountPkr: 0,
      errorMessage: 'External payment confirmation signature required.'
    };
  }
}

export const paymentGatewayService = new PaymentGatewayService();
