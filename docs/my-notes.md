

# My Notes


**Things to bring up:**  

- transfer api — The POST `/external/transfers/initiate` response returns `source_account` with empty `account_number` and `account_holder_name` fields. It also appears to swap the source and destination account routing numbers. We patch the response with correct data from the original request at the API boundary (`/api/transfers/+server.ts`), and cache the account data in-memory on the server so that the transfer history list also displays correct values for transfers the app initiated.  
*Note: the cache resets on server restart, so older transfers will still fall back to "Unknown"*.




**To Dos:**  


- merge activity & transfers
- pretty view for transfers
- tests  
- number formats  
- README!!
- more accurate styling 
- get execution paths for things
- keep account numbers sever side  




---



- **SVELTE 4 !!**
- Money
  - [dinero.js](https://www.dinerojs.com/)

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

- excludeAccountId in TransferForm.svelte & AccountSelect.svelte - does this serve a purpose?

## ask about

- the discrepancy between the account names being returned by the API & what is shown on the figma with figma.
