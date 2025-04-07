
# Authentication

> **Warning:** The user information obtained with this method should not be passed to your backend and should
> only be used for presentation logic (e.g displaying the user's username).
> **On your backend, use the Platform API as the source of truth.** You can verify the user's
> identity by requesting the /me endpoint from your backend, using the access token obtained with this method.

```typescript
Pi.authenticate(scopes: Array<Scope>, onIncompletePaymentFound: Function<PaymentDTO>): Promise<AuthResult>
```

Return value:

```typescript
type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};
```

## `scopes`

Available scopes: `username`, `payments`, `wallet_address`

Here is a breakdown of various keys available on the `AuthResult['user']` object, and the scopes required for those keys
to be present:

|            Field | Description                                                                                                                                                     |  Required Scope  |
| ---------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------: |
|            `uid` | An app-local identifier for the user. This is specific to this user, and this app. It will change if the user revokes the permissions they granted to your app. |      (none)      |
|       `username` | The user's Pi username.                                                                                                                                         |    `username`    |
|       `payments` | Required if your app needs to make payments between your app and the users                                                                                      |    `payments`    |
| `wallet_address` | The wallet address of the user who authenticates on your app.                                                                                                   | `wallet_address` |

## `onIncompletePaymentFound`

Signature: `(payment: PaymentDTO) => void`

Every time when the user is authenticated, and when they try to start a new payment flow, the SDK checks that there is no
incomplete payment for this user. An incomplete payment, in this context, is a payment which has been submitted to
the Pi Blockchain, but where `status.developer_completed` is still `false` (i.e. the developer has not called the
`/complete` endpoint on this payment).

If an incomplete payment is found, this callback will be invoked with the payment's `PaymentDTO`.

When this callback is invoked, it is your responsibility to complete the corresponding payment (you should most
likely send the payment DTO to your server, and process it according to your business logic). You'll need to do
so before you can request a new payment from the user.
