
# Payments

Create a new payment:

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

## `paymentData` keys:

### `amount`

This is the amount that the user is requested to pay to your app.

Example: `3.1415`.

### `memo`

A memo for this payment. This will be visible to the user in the payment confirmation page.
Use this to briefly explain what the user is paying for.

Example: `Digital kitten #1234`.

### `metadata`

An arbitrary Javascript object that you can attach to this payment. This is for your own use.
You should use this object as a way to link this payment with your internal
business logic.

Example: `{ orderId: 1234, itemIds: [11, 42, 314] }`

## `callbacks` keys:

### `onReadyForServerApproval`

Signature: `(paymentId: string) => void`

This is called when the payment identifier (paymentId) is obtained from Pi Servers. During the approval time period, this callback will be invoked multiple times in case of failure.
If the initial trial fails, the Pi SDK will continue to invoke the function roughly every 10 seconds until the approval timer ends.

Use this callback to send the paymentId to your backend for **Server-Side Approval**.
Read more about Server-Side Approval and the full payment flow below.

### `onReadyForServerCompletion`

Signature: `(paymentId: string, txid: string) => void`

This is called when the user has submitted the transaction to the Pi Blockchain. During the completion time period, this callback will be invoked multiple times in case of failure.
If the initial trial fails, the Pi SDK will continue to invoke the function roughly every 10 seconds until the completion timer ends.

Use this callback to send the blockchain transaction identifier (txid), along with the paymentId
to your backend for **Server-Side Completion**.
Read more about Server-Side Completion and the full payment flow below.

### `onCancel`

Signature: `(paymentId: string) => void`

This is called when the payment is cancelled (by a user action, or programmatically).

The payment may be cancelled either because the user manually rejected it, or because
of some other blocking situation: the user doesn't have enough funds on their account
to make the payment, another payment has been created concurrently...

### `onError`

Signature: `(error: Error, payment?: PaymentDTO) => void`

This is called when an error occurs and the payment cannot be made. If the payment has been
created, the second argument will be present and you may use it to investigate the error.
Otherwise, only the first argument will be provided.

## The Payment flow

After they're created, payments go through 3 major phases:

1. Payment creation and Server-Side Approval
2. User interaction and blockchain transaction
3. Server-Side Completion

**Phase I - Payment creation and Server-Side Approval**

1. `createPayment`: Your app's frontend creates the payment. The Payment Flow UI opens, but cannot be interacted with until the payment is approved by your server.

2. `onReadyForServerApproval`: The JS SDK has obtained the payment identifier (PaymentID) and is passing it to your app for Server-Side approval.

3. Your app's frontend sends the PaymentID to your app's server. This implementation is your responsibility.

4. Server-Side Approval: Your app's server approves the payment with Pi Servers through the `/approve` API call. This enables the user to submit the blockchain transaction.

**Phase II - User interaction and blockchain transaction**

At this stage, the payment dialog becomes interactive and enables the
user to confirm the transaction, sign it, and submit it to the Pi Blockchain.

You do not have anything to do at this stage, everything is handled by the Pi
Apps Platform and the Pi Wallet.

After the blockchain transaction is submitted, the payment flow will not close.
You need to acknowledge the payment through Server-Side completion before your
app is visible again.

**Phase III - Server-Side Completion**

5. `onReadyForServerCompletion`: The JS SDK passes the blockchain transaction identifier (TxID) to your app's frontend. You need this value for the Server-Side Completion flow.

6. Your app's frontend sends the TxID to your app's server. This implementation is your responsibility.

7. Server-Side Completion: Your app's server acknowledges the payment with Pi Servers through the `/complete` API call. This enables you to check whether the blockchain transaction has actually happened, and to let Pi know that
you're aware of it.

8. The payment flow closes. Your app is now visible to the user again.
Your app's server and your app's frontend can exchange data, and
update the app interface to show a confirmation screen to the user.
This implementation is your responsibility.

> **The user might be lying to your app!**
>
> Users might be running a hacked version of the SDK, pretending that they
> have made a payment. If the API call for Server-Side completion
> returns a non-200 error code, **do not** mark the payment as complete on your
> side, and **do not** deliver whatever the user was trying to buy.

## Simplified flow

This diagram shows the same payment flow from your app's point of view in a simplified manner.

1. Use the Pi SDK function to initiate the payment
2. A callback function that gets called automatically by the Pi SDK (letting your App Server know that it needs to make an approve API request)
3. An API request from your App Server to the Pi Server to approve the payment (letting the Pi Server know that you are aware of this payment)
4. The Pi browser shows the payment detail page to a user, and we are waiting until the user signs the transaction
5. A callback function that gets called automatically by the Pi SDK (letting your App Server know that it needs to make an complete API request)
6. An API request from your App Server to the Pi Server to complete the payment (letting the Pi Server know that you completed this payment)

## Type `PaymentDTO`

This type is for the arguments that are passed to `onIncompletePaymentFound` and `onError`.

```typescript
type PaymentDTO = {
  // Payment data:
  identifier: string; // payment identifier
  user_uid: string; // user's app-specific ID
  amount: number; // payment amount
  memo: string; // a string provided by the developer, shown to the user
  metadata: Object; // an object provided by the developer for their own usage
  from_address: string; // sender address of the blockchain transaction
  to_address: string; // recipient address of the blockchain transaction
  direction: Direction; // direction of the payment
  created_at: string; // payment's creation timestamp
  network: AppNetwork; // a network of the payment

  // Status flags representing the current state of this payment
  status: {
    developer_approved: boolean; // Server-Side Approval
    transaction_verified: boolean; // blockchain transaction verified
    developer_completed: boolean; // server-Side Completion
    cancelled: boolean; // cancelled by the developer or by Pi Network
    user_cancelled: boolean; // cancelled by the user
  };

  // Blockchain transaction data:
  transaction: null | {
    // This is null if no transaction has been made yet
    txid: string; // id of the blockchain transaction
    verified: boolean; // true if the transaction matches the payment, false otherwise
    _link: string; // a link to the operation on the Blockchain API
  };
};
```

## Type `Direction`

A developer can check the direction of the payment with this type.

```typescript
type Direction = "user_to_app" | "app_to_user";
```

## Type `AppNetwork`

Shows which network the payment is being made on.

```typescript
type AppNetwork = "Pi Network" | "Pi Testnet";
```
