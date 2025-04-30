
# Pi Network Payment Integration - Avante Maps

Avante Maps uses the Pi Network SDK to facilitate in-app payments, allowing users to make purchases using Pi cryptocurrency. The payment system is fully integrated with the Pi Network to ensure a seamless and secure transaction experience.

## Payment Flow

### 1. **User Authentication**
Before initiating a payment, users must authenticate via Pi Network. Authentication ensures that the user is logged in to their Pi Network account.

```typescript
import { Pi } from 'pi-sdk';

Pi.authenticate()
  .then((user) => {
    console.log("User authenticated: ", user);
  })
  .catch((error) => {
    console.error("Authentication failed: ", error);
  });
```

### 2. **Initiate Payment**
Once authenticated, users can initiate a payment. The payment flow is powered by the `Pi.createPayment()` method.

```typescript
const paymentDetails = {
  amount: 10, // Amount in Pi
  currency: "PI", // Pi currency
  description: "Avante Maps Premium Features"
};

Pi.createPayment(paymentDetails)
  .then((transaction) => {
    console.log("Payment successful: ", transaction);
    // Process successful payment (e.g., unlock premium features)
  })
  .catch((error) => {
    console.error("Payment failed: ", error);
  });
```

### 3. **Server-side Approval**
Once the payment is completed, server-side approval ensures that the transaction was processed and the appropriate features are unlocked for the user.

---

## Additional Notes:
- Payments are only available in the Pi Network ecosystem.
- Pi Network requires users to complete KYC (Know Your Customer) for full payment functionalities.

For further information on the Pi Network SDK, refer to the official Pi documentation: [https://sdk.minepi.com](https://sdk.minepi.com).
