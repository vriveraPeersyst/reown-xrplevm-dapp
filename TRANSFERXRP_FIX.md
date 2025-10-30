# TransferXRP Fix - CSP and RPC Configuration Issues

## Problem Summary

The `TransferXRP` component was failing with CSP (Content Security Policy) violations when attempting to transfer XRP on the XRPL EVM mainnet. The error messages showed:

```
Refused to connect to 'https://rpc.xrplevm.org/' because it violates the following Content Security Policy directive
CA Error: Error finding transaction route: Error: Error preparing chainAbstraction transaction
```

## Root Cause

The issue had multiple interconnected causes:

### 1. **WalletConnect CSP Limitations**
WalletConnect's modal (running in an iframe at `secure.walletconnect.org`) has a hardcoded Content Security Policy that doesn't include `https://rpc.xrplevm.org/` in its `connect-src` directive. This means the modal cannot make direct connections to the XRPL EVM mainnet RPC endpoint.

### 2. **Chain Abstraction Feature**
The Reown AppKit was attempting to use WalletConnect's Chain Abstraction feature, which routes transactions through WalletConnect's infrastructure. This requires the RPC endpoint to be whitelisted in WalletConnect's CSP, which `rpc.xrplevm.org` is not.

### 3. **Missing Explicit Transports**
The wagmi configuration wasn't explicitly defining HTTP transports for each network, causing wagmi to potentially rely on WalletConnect's RPC infrastructure instead of making direct connections.

### 4. **Application CSP Headers**
The Next.js application wasn't setting proper CSP headers to allow connections to XRPL EVM endpoints from the client side.

## Solutions Implemented

### 1. **Added Explicit HTTP Transports** (`src/config/wagmi.ts`)

```typescript
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [xrplevmMainnet.id]: http('https://rpc.xrplevm.org/', {
      batch: false, // Disable batching to avoid issues
    }),
    [xrplevmTestnet.id]: http('https://rpc.testnet.xrplevm.org/', {
      batch: false,
    }),
  },
})
```

This ensures wagmi uses direct HTTP connections to the XRPL EVM RPC endpoints, bypassing WalletConnect's infrastructure.

### 2. **Configured Next.js CSP Headers** (`next.config.ts`)

Added proper Content Security Policy headers to the Next.js application to allow connections to:
- `https://rpc.xrplevm.org` (mainnet)
- `https://rpc.testnet.xrplevm.org` (testnet)
- `https://explorer.xrplevm.org` (mainnet explorer)
- `https://explorer.testnet.xrplevm.org` (testnet explorer)
- All necessary WalletConnect/Reown endpoints

### 3. **Disabled Problematic Features** (`src/contexts/ContextProvider.tsx`)

Removed the chain abstraction hint and disabled features that might interfere:

```typescript
features: {
  analytics: true,
  email: false,
  socials: ['google', 'x', 'github', 'discord', 'apple'],
  emailShowWallets: true,
  onramp: false,
  swaps: false,
},
enableWalletGuide: false,
enableOnramp: false,
```

### 4. **Enhanced Transaction Logging** (`src/components/TransferXRP.tsx`)

Added better logging to help debug transaction issues:

```typescript
console.log('🚀 Initiating transfer:', {
  to: recipient,
  amount: amount,
  valueWei: value.toString(),
  chainId,
  address,
})
```

## How It Works Now

1. **User connects wallet** → AppKit modal opens with social login options
2. **User initiates transfer** → `TransferXRP` component calls `useSendTransaction` hook
3. **Wagmi processes transaction** → Uses the explicit HTTP transport defined in config
4. **Direct RPC connection** → Makes direct HTTPS request to `rpc.xrplevm.org`
5. **Wallet signs transaction** → User approves in their connected wallet (MetaMask, social wallet, etc.)
6. **Transaction broadcast** → Sent directly to XRPL EVM network via RPC
7. **Receipt confirmation** → `useWaitForTransactionReceipt` monitors the transaction

## Key Differences from Working Implementation

The working `web` app only uses XRPL EVM **Testnet**, which is already whitelisted in WalletConnect's CSP (as it's a predefined network in `@reown/appkit/networks`). The `reown-xrplevm-dapp` supports both Mainnet and Testnet, requiring custom RPC configuration and the fixes above.

## Testing

To verify the fix works:

1. Start the development server: `npm run dev`
2. Connect a wallet (MetaMask or social login)
3. Ensure you're on XRPL EVM Mainnet or Testnet
4. Enter a recipient address and amount
5. Click "Send Transfer"
6. Check browser console for "🚀 Initiating transfer" log
7. Approve in wallet
8. Wait for "✅ Transaction successful!" log

## Environment Variables

Make sure you have a `.env.local` file with:

```bash
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
```

Optional variables:
```bash
NEXT_PUBLIC_XRPL_MAINNET_RPC=https://rpc.xrplevm.org/
NEXT_PUBLIC_XRPL_RPC_URL=https://rpc.testnet.xrplevm.org/
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Additional Notes

- The `batch: false` option in HTTP transport configuration prevents potential batching issues with some RPC endpoints
- Social login wallets (Google, X, GitHub, etc.) work the same as injected wallets (MetaMask) because wagmi handles the provider abstraction
- The CSP headers are applied server-side by Next.js, allowing the client-side code to make the necessary RPC connections
- Gas estimation is handled automatically by wagmi (`gas: undefined`)

## Future Improvements

If WalletConnect/Reown adds `rpc.xrplevm.org` to their CSP whitelist, some of these workarounds may not be necessary. However, explicit transport configuration is still a best practice for custom networks.
