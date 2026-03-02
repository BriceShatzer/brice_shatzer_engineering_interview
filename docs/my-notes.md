

# My Notes

**To Dos:**  
- more accurate styling 
- check all sensitive data is sever side  
  - keys
  - account numbers
- tests  
- number formats  


---



- **SVELTE 4 !!**
- Money
  -

  ```javascript
  // --- Store and Calculate in Minor Units
  let priceInCents = 1050; // $10.50
  let taxInCents = 53; // $0.53
  let totalInCents = priceInCents + taxInCents; // 1103 (representing $11.03)

  // --- Displaing:
  let displayTotal = (totalInCents / 100).toFixed(2); // "11.03" (string)

  const amount = 123456.789;

  // Format as US Dollar
  const usdFormatted = new Intl.NumberFormat('en-US', {
  	style: 'currency',
  	currency: 'USD'
  }).format(amount);
  console.log(usdFormatted); // Expected output: "$123,456.79"

  // Format as Euro in Germany
  const eurFormatted = new Intl.NumberFormat('de-DE', {
  	style: 'currency',
  	currency: 'EUR'
  }).format(amount);
  console.log(eurFormatted); // Expected output: "123.456,79 €"
  ```

- mask acct numbers server side?

- API doesn't return pretty names ("Everyday Checking", "High-Yield Savings")

## ask about

- the discrepancy between the account names being returned by the API & what is shown on the figma with figma.
