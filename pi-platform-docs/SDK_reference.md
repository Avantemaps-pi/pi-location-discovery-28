
# Pi Network SDK Integration - Avante Maps

Avante Maps integrates the Pi Network SDK to authenticate users and process payments through Pi cryptocurrency. Below is a summary of how the Pi SDK is used in the app.

## SDK Initialization

To ensure that the Pi Network SDK is initialized properly, we load the SDK from the official Pi CDN:

```typescript
const script = document.createElement('script');
script.src = 'https://sdk.minepi.com/pi-sdk.js';
script.async = true;

script.onload = () => {
  console.log("Pi Network SDK loaded successfully");
  if (window.Pi) {
    window.Pi.init({ version: "2.0", sandbox: true })  // Sandbox mode for testing
      .then(() => {
        console.log("Pi Network SDK initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize Pi SDK:", error);
      });
  }
};

script.onerror = (error) => {
  console.error('Failed to load Pi Network SDK', error);
};
document.head.appendChild(script);
```

## User Authentication

We authenticate users via the `Pi.authenticate()` method to ensure that only valid Pi Network users can access premium features and make payments.

```typescript
Pi.authenticate()
  .then((user) => {
    console.log("User authenticated: ", user);
  })
  .catch((error) => {
    console.error("Authentication failed: ", error);
  });
```

## Pi Payment System

The `Pi.createPayment()` method is used to process payments:

```typescript
const paymentDetails = {
  amount: 10, // Amount in Pi
  currency: "PI", // Pi currency
  description: "Avante Maps Premium Features"
};

Pi.createPayment(paymentDetails)
  .then((transaction) => {
    console.log("Payment successful: ", transaction);
    // Unlock premium features
  })
  .catch((error) => {
    console.error("Payment failed: ", error);
  });
```

## Conclusion

The Pi Network SDK is integrated into Avante Maps to provide authentication and payment functionalities, ensuring that users can securely make purchases using Pi cryptocurrency. This integration supports both testnet and mainnet modes, allowing for thorough testing before deployment.
