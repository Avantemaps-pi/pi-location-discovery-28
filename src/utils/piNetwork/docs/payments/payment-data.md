
# Payment Data

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
