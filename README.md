# XRPL EVM Reown DApp

A Next.js dApp with **social login** (Google, X/Twitter, GitHub, Discord, Apple) and XRP transfers on **XRPL EVM Testnet**, powered by Reown AppKit (formerly WalletConnect).

## Features

✨ **Social Authentication**
- Sign in with Google, X (Twitter), GitHub, Discord, or Apple
- No seed phrases required for non-crypto users
- Seamless onboarding experience

🔐 **Wallet Support**
- MetaMask and other browser wallets
- WalletConnect v2 compatible wallets
- Account abstraction for social users

💸 **XRP Transfers**
- Send XRP on XRPL EVM Testnet
- Real-time balance updates
- Transaction history

🎨 **Modern UI**
- Responsive design with Tailwind CSS
- Gradient themes matching XRPL branding
- Mobile-friendly interface

## Prerequisites

- Node.js 18+ and npm/yarn
- [Reown Cloud Account](https://cloud.reown.com) (free)
- For local development: [ngrok](https://ngrok.com) or similar tunneling tool

## Quick Start

### 1. Clone and Install

```bash
cd reown-xrplevm-dapp
npm install
# or
yarn install
```

### 2. Configure Environment

Create a `.env.local` file:

```bash
# Get your Project ID from https://cloud.reown.com
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here

# For local development with ngrok
NEXT_PUBLIC_APP_URL=https://your-subdomain.ngrok-free.app

# For production
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Set Up Reown Cloud

1. Go to [https://cloud.reown.com](https://cloud.reown.com)
2. Create a new project
3. Copy your **Project ID** to `.env.local`
4. Configure social providers (see below)

### 4. Run Development Server

```bash
npm run dev
```

For local development with social login, use ngrok:

```bash
# In a separate terminal
ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok-free.app)
# Update NEXT_PUBLIC_APP_URL in .env.local
# Restart your dev server
```

## Social Login Configuration

### In Reown Cloud Dashboard

1. Navigate to your project
2. Go to **Settings** → **Authentication**
3. Enable **Social Login**
4. Configure each provider:

#### Allowed Origins
Add these URLs:
- Development: `https://your-subdomain.ngrok-free.app`
- Production: `https://yourdomain.com`

#### Redirect URIs
The redirect URI format for Reown is:
```
https://your-domain.com/__reown/auth
```

Add:
- Development: `https://your-subdomain.ngrok-free.app/__reown/auth`
- Production: `https://yourdomain.com/__reown/auth`

### Social Provider Setup

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-domain.com/__reown/auth`
4. Copy Client ID to Reown dashboard

#### GitHub
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL:
   - `https://your-domain.com/__reown/auth`
4. Copy Client ID and Secret to Reown dashboard

#### X (Twitter)
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create an app with OAuth 2.0
3. Add redirect URI:
   - `https://your-domain.com/__reown/auth`
4. Copy Client ID and Secret to Reown dashboard

#### Discord
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Add OAuth2 redirect:
   - `https://your-domain.com/__reown/auth`
4. Copy Client ID and Secret to Reown dashboard

#### Apple
1. Go to [Apple Developer](https://developer.apple.com)
2. Create Services ID
3. Configure Sign in with Apple
4. Add return URL:
   - `https://your-domain.com/__reown/auth`
5. Copy Service ID and configure in Reown dashboard

## Architecture

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Web3**: Wagmi v2 + Viem v2
- **Authentication**: Reown AppKit v1.7.6
- **State Management**: TanStack Query v5
- **Styling**: Tailwind CSS
- **TypeScript**: Latest

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with ContextProvider
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ConnectWallet.tsx   # Wallet connection component
│   └── TransferXRP.tsx     # XRP transfer component
├── config/
│   └── wagmi.ts           # Wagmi & AppKit configuration
├── contexts/
│   └── ContextProvider.tsx # Web3 context provider
└── utils/
    └── network.ts         # Network switching utilities
```

### Key Configuration Files

#### `src/config/wagmi.ts`
Configures Wagmi adapter for XRPL EVM Testnet:
```typescript
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { xrplevmTestnet } from '@reown/appkit/networks'

export const networks = [xrplevmTestnet]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
})
```

#### `src/contexts/ContextProvider.tsx`
Creates AppKit modal with social login:
```typescript
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [xrplevmTestnet],
  defaultNetwork: xrplevmTestnet,
  features: {
    analytics: true,
    email: false,
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    emailShowWallets: true,
  },
})
```

## XRPL EVM Testnet Details

- **Chain ID**: 1440002
- **Network Name**: XRPL EVM Testnet
- **Currency**: XRP
- **RPC URL**: https://rpc.testnet.xrplevm.org
- **Explorer**: https://explorer.testnet.xrplevm.org
- **Faucet**: https://faucet.testnet.xrplevm.org

### Getting Testnet XRP

1. Connect your wallet
2. Copy your wallet address
3. Visit the [XRPL EVM Testnet Faucet](https://faucet.testnet.xrplevm.org)
4. Paste your address and request testnet XRP

## Usage

### Connect with Social Login

1. Click "Connect Wallet"
2. Select "Social" tab in the modal
3. Choose your preferred provider (Google, X, GitHub, etc.)
4. Authorize the connection
5. Your wallet is created automatically!

### Transfer XRP

1. Ensure you're connected and on XRPL EVM Testnet
2. Enter recipient address
3. Enter amount in XRP
4. Click "Send XRP"
5. Confirm the transaction

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_PROJECT_ID`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Deploy!

### Update Reown Configuration

After deployment:
1. Update Reown Cloud dashboard with production URL
2. Update all social provider redirect URIs
3. Test social login on production

## Troubleshooting

### Social Login Not Working

**Issue**: Social login modal appears but authentication fails

**Solutions**:
1. Verify `NEXT_PUBLIC_APP_URL` matches your actual URL
2. Check Reown dashboard has correct redirect URIs
3. Ensure all social providers are properly configured
4. For local dev, verify ngrok URL hasn't changed

### Wrong Network

**Issue**: App shows "Wrong Network"

**Solutions**:
1. Click "Switch Network" button
2. Approve network addition in your wallet
3. Or manually add XRPL EVM Testnet to your wallet

### Transaction Failures

**Issue**: Transfers fail or don't confirm

**Solutions**:
1. Ensure you have testnet XRP
2. Check you're on XRPL EVM Testnet (Chain ID: 1440002)
3. Verify recipient address is valid
4. Try with a smaller amount

### Build Errors

**Issue**: TypeScript or build errors

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Or with yarn
rm -rf node_modules .next
yarn install
```

## Resources

- [Reown AppKit Docs](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh)
- [XRPL EVM Documentation](https://docs.xrplevm.org)
- [Next.js Documentation](https://nextjs.org/docs)

## Security Notes

⚠️ **Important**:
- Never commit `.env.local` or expose your Project ID unnecessarily
- Use environment variables for all sensitive data
- This is a testnet application - do not use with real funds
- Always verify recipient addresses before sending

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this code for your own projects!

---

Built with ❤️ using Reown AppKit and XRPL EVM Testnet
