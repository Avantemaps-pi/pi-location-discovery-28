
# Payments

Payments are wrappers around blockchain transactions, which enable your app,
the Pi Blockchain, and the Pi Servers to be all synchronized when the user 
submits a blockchain transaction to pay for something in your app.

They enable you, the developer of the app, to have full confidence that the
user has actually made the transaction, while not having to
bother with the technicalities involved when interacting with the Pi Blockchain.

## Create a new payment

```typescript
type PaymentData = {
  amount: number,
  memo: string,
  metadata: Object,
};

type PaymentCallbacks = {
  onReadyForServerApproval: (paymentId: string) => void,
  onReadyForServerCompletion: (paymentId: string, txid: string) => void,
  onCancel: (paymentId: string) => void,
  onError: (error: Error, payment?: PaymentDTO) => void,
};

Pi.createPayment(paymentData: PaymentData, callbacks: PaymentCallbacks): void;
```

The `createPayment` method takes two argument: `paymentData` and `callbacks`.

It will immediately start the payment flow, which will open on top of your app, enabling the user to review
the payment and submit the blockchain transaction, or reject it.

> **Warning: concurrent payments:**
>
> When creating a new payment, if there is already an open payment with your app for the current user:
>
> - If the user has not yet made the blockchain transaction, the open payment will be cancelled.
> - If the user has already made the blockchain transaction, the new payment will be rejected
>   (`onError` will be called) and the `onIncompletePaymentFound` callback that was passed to the `authenticate`
>   method will be called with the existing payment (use this callback to resolve the situation, e.g by sending
>   the previous payment to your server for server-side completion).
