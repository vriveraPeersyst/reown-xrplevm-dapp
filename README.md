# XRPL EVM Reown DApp Example

A simple decentralized application (dApp) demonstrating social login integration using Reown AppKit (formerly WalletConnect) for XRPL EVM Testnet with transfer functionality.

## Features

- **Social Login**: Connect with Google, X (Twitter), GitHub, Discord, Apple
- **Traditional Wallets**: Support for MetaMask and other Web3 wallets
- **XRPL EVM Testnet**: Built specifically for XRPL EVM sidechain
- **XRP Transfers**: Send testnet XRP to any address
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2 + Viem
- **Authentication**: Reown AppKit v1.7.6
- **State Management**: TanStack Query v5
- **Language**: TypeScript

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd reown-xrpl-dapp
npm install
```

### 2. Get a Reown Project ID

1. Go to [Reown Cloud](https://cloud.reown.com)
2. Create a new project
3. Select "AppKit" as the project type
4. Copy your Project ID

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required: Your Reown Project ID
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here

# Optional: App URL (defaults to localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Custom RPC URL (uses default if not provided)
NEXT_PUBLIC_XRPL_RPC_URL=https://rpc.testnet.xrplevm.org/
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Setting Up Social Login (Optional)

For social login to work properly, you need to configure OAuth providers in your Reown Cloud dashboard:

### Reown Cloud Configuration

1. Go to your [Reown Cloud dashboard](https://cloud.reown.com)
2. Select your project
3. Navigate to **Settings** → **Authentication**
4. Enable **Social Login**
5. Configure each provider you want to use:

#### Google OAuth
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `https://rpc.walletconnect.org/social/callback`

#### X (Twitter) OAuth
- Go to [Twitter Developer Portal](https://developer.twitter.com)
- Create a new app with OAuth 2.0
- Set callback URL: `https://rpc.walletconnect.org/social/callback`

#### GitHub OAuth
- Go to [GitHub Settings](https://github.com/settings/developers)
- Create new OAuth app
- Set authorization callback URL: `https://rpc.walletconnect.org/social/callback`

#### Discord OAuth
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Create new application
- Add redirect URI: `https://rpc.walletconnect.org/social/callback`

#### Apple Sign In
- Go to [Apple Developer](https://developer.apple.com)
- Configure Sign in with Apple
- Set up Service ID and domains

## Getting Testnet XRP

To test transfers, you'll need testnet XRP:

1. Connect your wallet to the dApp
2. Copy your wallet address
3. Visit the [XRPL EVM Testnet Faucet](https://faucet.testnet.xrplevm.org)
4. Request testnet XRP for your address

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with context providers
│   ├── page.tsx           # Main page with dApp interface
│   └── globals.css        # Global styles
├── components/
│   ├── ConnectWallet.tsx  # Wallet connection component
│   └── TransferXRP.tsx    # XRP transfer component
├── config/
│   └── wagmi.ts          # Wagmi and Reown configuration
└── contexts/
    └── ContextProvider.tsx # React context provider
```

## Key Components

### ConnectWallet Component
- Handles wallet connection via Reown AppKit
- Displays connection status and account info
- Shows wallet balance
- Supports both social and traditional wallet connections

### TransferXRP Component
- Form for entering recipient address and amount
- Input validation and error handling
- Transaction status tracking
- Links to block explorer for completed transactions

### Configuration
- XRPL EVM Testnet network setup
- Reown AppKit configuration with social providers
- Wagmi adapter setup for Web3 functionality

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## Environment Networks

The dApp is configured for XRPL EVM Testnet:

- **Network Name**: XRPL EVM Testnet
- **Chain ID**: 1449000
- **RPC URL**: https://rpc.testnet.xrplevm.org/
- **Currency**: XRP
- **Explorer**: https://explorer.testnet.xrplevm.org

## Troubleshooting

### Common Issues

**"Project ID is not defined"**
- Make sure you've added `NEXT_PUBLIC_PROJECT_ID` to your `.env.local` file
- Restart the development server after adding environment variables

**Social login not working**
- Verify OAuth providers are configured in Reown Cloud dashboard
- Check that callback URLs are correctly set in each provider
- For local development, consider using ngrok for HTTPS

**MetaMask network not found**
- The dApp will prompt to add XRPL EVM Testnet to MetaMask
- You can also add it manually using the network details above

**No testnet XRP**
- Visit the [XRPL EVM Testnet Faucet](https://faucet.testnet.xrplevm.org)
- Make sure you're connected to the correct network

### Getting Help

- [Reown Documentation](https://docs.reown.com/appkit/react/core/installation)
- [Wagmi Documentation](https://wagmi.sh)
- [XRPL EVM Documentation](https://docs.xrplevm.org)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
