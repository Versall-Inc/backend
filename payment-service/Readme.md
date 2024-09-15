# How to use

- You can now create a payment session by sending a POST request to /api/payment/session with the following payload:

```json
{
  "amount": 2000,
  "currency": "usd",
  "successUrl": "http://localhost:8080/success",
  "cancelUrl": "http://localhost:8080/cancel"
}
```
