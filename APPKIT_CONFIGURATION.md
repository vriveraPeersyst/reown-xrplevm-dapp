# AppKit Social Login Configuration for XRPL EVM Testnet

## Summary

The `reown-xrplevm-dapp` has been configured with **Reown AppKit** social login support for **XRPL EVM Testnet**, matching the implementation in the `web` app from the kiniela-monorepo.

## What Was Configured

### 1. **Updated Configuration** (`src/config/wagmi.ts`)

**Changes Made:**
- Simplified configuration to focus on **XRPL EVM Testnet only**
- Removed mainnet references to match the web app's approach
- Configured Wagmi adapter with cookie storage and SSR support

**Configuration:**
```typescript
export const networks = [xrplevmTestnet]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
})
```

### 2. **Updated Context Provider** (`src/contexts/ContextProvider.tsx`)

**Changes Made:**
- Set default network to `xrplevmTestnet`
- Enabled social login providers: Google, X (Twitter), GitHub, Discord, Apple
- Disabled email login to match web app configuration
- Configured MetaMask as featured wallet

**Social Login Configuration:**
```typescript
features: {
  analytics: true,
  email: false,  // Disabled like in web app
  socials: [
    'google',
    'x',
    'github',
    'discord',
    'apple',
  ],
  emailShowWallets: true,
}
```

### 3. **Updated Connect Wallet Component** (`src/components/ConnectWallet.tsx`)

**Changes Made:**
- Removed mainnet references
- Simplified network detection to focus on XRPL EVM Testnet
- Network status shows "XRPL EVM Testnet" when connected correctly
- Switch network button for wrong networks

### 4. **Created Network Utilities** (`src/utils/network.ts`)

**New File Created:**
- `switchToXRPLEVM()` function to programmatically switch networks
- Handles both network switching and adding XRPL EVM Testnet to wallet
- TypeScript declarations for window.ethereum

### 5. **Created Comprehensive README**

**Documentation Includes:**
- Quick start guide
- Detailed Reown Cloud setup instructions
- Social provider configuration (Google, GitHub, X, Discord, Apple)
- Local development with ngrok
- Production deployment guide
- Troubleshooting section
- XRPL EVM Testnet details

## Social Login Flow

1. **User clicks "Connect Wallet"**
   - AppKit modal opens with social and wallet options

2. **User selects social provider** (e.g., Google)
   - OAuth flow initiated through Reown

3. **User authorizes in provider** (e.g., Google login)
   - Redirects back to app via `/__reown/auth`

4. **Smart contract wallet created**
   - Reown creates account abstraction wallet
   - No seed phrase needed

5. **User is connected!**
   - Can interact with XRPL EVM Testnet
   - Send XRP, interact with smart contracts

## Network Configuration

**XRPL EVM Testnet:**
- Chain ID: `1440002`
- RPC: `https://rpc.testnet.xrplevm.org`
- Explorer: `https://explorer.testnet.xrplevm.org`
- Native Currency: XRP (18 decimals)

## Required Environment Variables

```bash
# Reown Project ID (get from cloud.reown.com)
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# App URL for OAuth callbacks
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Reown Cloud Setup Required

For social login to work, you need to:

1. **Create Reown Cloud Project**
   - Sign up at https://cloud.reown.com
   - Create new AppKit project
   - Copy Project ID

2. **Configure Social Providers**
   - Enable each provider (Google, GitHub, X, Discord, Apple)
   - Add redirect URIs: `https://your-domain.com/__reown/auth`
   - Configure OAuth credentials from each provider

3. **Set Allowed Origins**
   - Add your app URL(s) to allowed origins
   - Development: ngrok URL
   - Production: your domain

## Key Differences from Web App

| Feature | Web App | reown-xrplevm-dapp |
|---------|---------|-------------------|
| Networks | XRPL EVM Testnet only | XRPL EVM Testnet only ✅ |
| Social Providers | 5 (Google, X, GitHub, Discord, Apple) | 5 (Google, X, GitHub, Discord, Apple) ✅ |
| Email Login | Disabled | Disabled ✅ |
| Featured Wallets | MetaMask, Keplr | MetaMask ✅ |
| Analytics | Enabled | Enabled ✅ |
| Default Network | xrplevmTestnet | xrplevmTestnet ✅ |

## Testing Social Login

### Local Development

1. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

2. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok-free.app
   ```

3. **Update Reown Dashboard:**
   - Add ngrok URL to allowed origins
   - Add redirect URI: `https://abc123.ngrok-free.app/__reown/auth`

4. **Start dev server:**
   ```bash
   npm run dev
   ```

5. **Test social login:**
   - Visit ngrok URL
   - Click "Connect Wallet"
   - Select social provider
   - Authorize and verify wallet creation

### Production

1. Deploy to Vercel or your hosting platform
2. Update `NEXT_PUBLIC_APP_URL` to production URL
3. Update Reown dashboard with production URLs
4. Configure social providers with production redirect URIs
5. Test on live site

## Files Modified/Created

### Modified:
- ✏️ `src/config/wagmi.ts` - Simplified to testnet only
- ✏️ `src/contexts/ContextProvider.tsx` - Updated network config
- ✏️ `src/components/ConnectWallet.tsx` - Removed mainnet logic

### Created:
- ✨ `src/utils/network.ts` - Network switching utilities
- 📄 `README.md` - Comprehensive documentation
- 📄 `APPKIT_CONFIGURATION.md` - This file

## Next Steps

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
   ```

2. **Set up Reown Cloud**
   - Create project at https://cloud.reown.com
   - Configure social providers
   - Get Project ID

3. **Configure Environment**
   - Create `.env.local`
   - Add Project ID and App URL

4. **Test Locally**
   - Use ngrok for local testing
   - Test each social provider

5. **Deploy**
   - Deploy to production
   - Update Reown config with production URLs
   - Test social login on live site

## Support

- **Reown Documentation**: https://docs.reown.com/appkit/overview
- **XRPL EVM Docs**: https://docs.xrplevm.org
- **Wagmi Docs**: https://wagmi.sh

---

**Status**: ✅ Configuration Complete - Ready for testing after Reown Cloud setup
