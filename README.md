# XRPL EVM Reown DApp

A modern decentralized application (dApp) built with Next.js, Reown AppKit, and Wagmi, designed for seamless social login and XRP transfers on the XRPL EVM Sidechain.

## ⚠️ Important: Dependency Versions

**This project requires EXACT dependency versions to function properly.** The Reown AppKit ecosystem and Wagmi libraries are highly sensitive to version compatibility. Using different versions may result in:

- Runtime errors and type mismatches
- Connection issues with wallets
- React hydration errors
- Build failures
- Unexpected behavior in production

### Critical Version Requirements

Please ensure you use **exactly** these versions:

```json
{
  "@reown/appkit": "1.7.6",
  "@reown/appkit-adapter-wagmi": "1.7.6",
  "@tanstack/react-query": "5.81.5",
  "next": "15.3.3",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "viem": "2.30.0",
  "wagmi": "2.15.4"
}
```

**DO NOT** upgrade dependencies without thoroughly testing. The `package.json` includes specific overrides to ensure compatibility:

```json
"overrides": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@types/react": "^18.3.1",
  "@types/react-dom": "^18.3.1",
  "@wagmi/core": "2.17.2",
  "@wagmi/connectors": "5.8.3"
}
```

These overrides are **critical** for preventing conflicts in the dependency tree.

## Features

✨ **Social Login Integration**
- Seamless authentication with popular social providers
- Powered by Reown AppKit

🔗 **Multi-Wallet Support**
- Compatible with MetaMask, WalletConnect, and other popular wallets
- Easy wallet connection and management

💸 **XRP Transfers**
- Fast and low-cost XRP transfers on XRPL EVM Testnet
- Real-time balance updates
- User-friendly transfer interface

🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Beautiful gradient effects
- Mobile-first approach

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (recommended: 20.x)
- **npm**: Version 9.x or higher (or yarn/pnpm)
- **Git**: For cloning the repository

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd reown-xrpl-dapp
```

### 2. Install Dependencies

**⚠️ IMPORTANT:** Use the `--legacy-peer-deps` flag or `--force` if needed to ensure exact versions are installed:

```bash
npm install
```

If you encounter peer dependency conflicts:

```bash
npm install --legacy-peer-deps
```

**DO NOT** use `npm install --save` or `npm update` as this may upgrade packages to incompatible versions.

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Or create it manually with the following variables:

```env
# Reown Project ID (Get this from https://cloud.reown.com)
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# App URL for social auth callbacks
NEXT_PUBLIC_APP_URL=http://localhost:3000

# XRPL EVM Testnet RPC URL
NEXT_PUBLIC_XRPL_RPC_URL=https://rpc.testnet.xrplevm.org/
```

#### Getting Your Reown Project ID

1. Visit [Reown Cloud](https://cloud.reown.com)
2. Create a new project or use an existing one
3. Copy your Project ID
4. Paste it into the `NEXT_PUBLIC_PROJECT_ID` variable in `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
reown-xrpl-dapp/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── ConnectWallet.tsx    # Wallet connection component
│   │   └── TransferXRP.tsx      # XRP transfer component
│   ├── config/
│   │   └── wagmi.ts             # Wagmi and Reown AppKit configuration
│   └── contexts/
│       └── ContextProvider.tsx  # React Context providers
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Key Technologies

- **Next.js 15.3.3**: React framework with App Router
- **React 18.3.1**: UI library
- **TypeScript 5.7.2**: Type safety
- **Reown AppKit 1.7.6**: Wallet connection and social login
- **Wagmi 2.15.4**: React hooks for Ethereum
- **Viem 2.30.0**: TypeScript Ethereum library
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query 5.81.5**: Data fetching and state management

## Configuration Files

### `src/config/wagmi.ts`

Contains the Wagmi and Reown AppKit configuration, including:
- Network configuration (XRPL EVM Testnet)
- Chain setup
- AppKit metadata
- Wallet adapters

### `src/contexts/ContextProvider.tsx`

Sets up the necessary providers:
- WagmiProvider
- QueryClientProvider
- AppKit integration

## Troubleshooting

### Dependency Issues

If you encounter errors related to dependencies:

1. **Delete node_modules and lock file:**
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. **Reinstall with exact versions:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Verify versions:**
   ```bash
   npm list @reown/appkit wagmi viem
   ```

### Common Errors

**React Hydration Error:**
- Ensure React versions match exactly (18.3.1)
- Check that overrides in package.json are applied

**Wallet Connection Fails:**
- Verify your `NEXT_PUBLIC_PROJECT_ID` is correct
- Check browser console for errors
- Ensure you're using the correct dependency versions

**Build Errors:**
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

## Network Information

### XRPL EVM Testnet

- **Chain ID**: 1440002
- **RPC URL**: https://rpc.testnet.xrplevm.org/
- **Explorer**: https://evm-sidechain.xrpl.org/
- **Currency**: XRP

### Getting Testnet XRP

To test the application, you'll need testnet XRP:
1. Connect your wallet to the XRPL EVM Testnet
2. Visit the [XRPL EVM Faucet](https://faucet.xrplevm.org/)
3. Request testnet XRP tokens

## Contributing

When contributing to this project:

1. **Never modify dependency versions** without extensive testing
2. Follow the existing code style
3. Test thoroughly on XRPL EVM Testnet
4. Update documentation if needed

## License

This project is available for educational and demonstration purposes.

## Support

For issues related to:
- **Reown AppKit**: [Reown Documentation](https://docs.reown.com/)
- **Wagmi**: [Wagmi Documentation](https://wagmi.sh/)
- **XRPL**: [XRPL Documentation](https://xrpl.org/)

## Acknowledgments

Built with:
- [Reown (formerly WalletConnect)](https://reown.com/)
- [XRPL EVM Sidechain](https://xrplevm.org/)
- [Wagmi](https://wagmi.sh/)
- [Next.js](https://nextjs.org/)
