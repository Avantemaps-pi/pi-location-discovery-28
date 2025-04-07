
# Payment Callbacks

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
