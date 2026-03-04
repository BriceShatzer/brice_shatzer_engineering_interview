

# My Notes


### Things to bring up:  


**API behavior**  
The response that is returned from a successful post to `/external/transfers/initiate` returns `source_account` with an empty `account_number` and `account_holder_name` fields. It also appears to swap the source and destination account routing numbers. We patch the response with correct data from the original request at the API boundary (`/api/transfers/+server.ts`), and cache the account data in-memory on the server so that the transfer history list also displays correct values for transfers the app initiated.  
*Note: the cache resets on server restart, so older transfers will still fall back to "Unknown"*.  

Additionally, the GET transfers list returns incorrect `source_account` & `destination_account` values for any transfer submitted via the API. To work around this, the transfer description is set to a structured format (`"Internal Transfer | from: <account_number> | to: <account_number>"`) when submitting. On the transfers page (`/routes/transfers/+page.svelte`), if a transfer's description starts with `"Internal Transfer |"`, we parse the account numbers from the description string and resolve display names from those instead of relying on the (incorrect) account objects in the response.



**Accessibility notes:**
- The design doc labels the amount field as "Transfer to", but that's the same label used for the destination account select. Changed the amount input's `<label>` to "Amount" so it has a distinct, accurate accessible name.
- `--input-focus-outline` in `tokens.css` references `var(--focus-border-size)` and `var(--focus-border-ci)` which are never defined in the token file. The token itself is unused by any component (all components define their own `:focus-visible` styles), so it resolves to a broken value. Left as-is since the tokens were provided, but this should be flagged if `--input-focus-outline` is ever consumed.


**To Dos:**


- merge activity & transfers on homepage.
  - get transfers based on last activity date and merge them in
  https://northwind.dev.array.io/external/transfers?page=1&per_page=20&date_from=2025-12-01&date_to=2026-03-05
- tests
- Check for vestigial stuff
  - unused css classes
  - invalid css vars
- redo commented out part of readme
- get execution paths for things (maybe with diagrams)
- Work backwards off of pending transactions to display the current balance??






---



- excludeAccountId in TransferForm.svelte & AccountSelect.svelte - does this serve a purpose?


---


<details><summary><h3>scratch paper</h3></summary>
        

- keep account numbers sever side?? 
  
- **SVELTE 4 !!**

- when you get all of the transfers, with the individual transfer objects appearing similar to the one below. **are internal transfers "INBOUND" or "OUTBOUND"? Does it mater?** 

```json
{
    "transfer_id": "36181861-d06f-4c16-b744-9c8072bb0bfa",
    "status": "COMPLETED",
    "reference_number": "EXT003",
    "amount": 2500,
    "currency": "USD",
    "direction": "INBOUND",
    "transfer_type": "SAME_DAY_ACH",
    "description": "Same-day ACH transfer",
    "initiated_date": "2026-02-27T13:26:41.241338Z",
    "processing_date": "2026-02-27T13:52:13.526517Z",
    "completed_date": "2026-02-27T13:52:59.177823Z",
    "expected_completion_date": "2026-02-27T13:26:41.241338Z",
    "fee": 1,
    "source_account": {
        "account_number": "2222222222",
        "routing_number": "021000021",
        "account_holder_name": "Michael Davis",
        "institution_name": "Wells Fargo"
    },
    "destination_account": {
        "account_number": "LQX79N-CH-003",
        "routing_number": "002772901",
        "account_holder_name": "Sarah Johnson",
        "institution_name": "Northwind Bank"
    }
},
```


- Money
  - [AutoNumeric.js](https://autonumeric.org/) 
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


</details> 
