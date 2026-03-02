## Developing

Ensure you're using node version ^24.12.0

IMPORTANT NOTE:

This project uses Svelte v4, the legacy docs for this are available [here](https://svelte.dev/docs/svelte/legacy-overview)

Once you've created a project and installed dependencies with `npm install`, start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.



---


# My Notes 

- **SVELTE 4 !!**
- Money
  - 
  ```javascript

    
    // --- Store and Calculate in Minor Units
    let priceInCents = 1050; // $10.50
    let taxInCents = 53;     // $0.53
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
-  the discrepancy between the account names being returned by the API &  what is shown on the figma with figma. 