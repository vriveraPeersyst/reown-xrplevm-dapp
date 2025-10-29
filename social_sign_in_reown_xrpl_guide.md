# Social Sign-In with Reown for XRPL EVM Testnet

## Complete Integration Guide for Next.js + Wagmi + Reown AppKit

This guide covers integrating social authentication (Google, X/Twitter, GitHub, Discord, Apple) using Reown AppKit (formerly WalletConnect) for XRPL EVM testnet in your Next.js application.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Reown Cloud Setup](#reown-cloud-setup)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Implementation](#implementation)
7. [Testing & Debugging](#testing--debugging)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Reown AppKit?

Reown AppKit (formerly WalletConnect AppKit) is a comprehensive web3 authentication solution that provides:

- **Social Login**: OAuth integration with Google, X, GitHub, Discord, Apple
- **Email Login**: Magic link authentication
- **Wallet Connect**: Traditional crypto wallet connections
- **Account Abstraction**: Smart contract wallets for social users
- **Multi-chain Support**: Including XRPL EVM testnet

### Current Tech Stack

Your application uses:
- **Frontend**: Next.js 14+ (App Router)
- **Web3 Library**: Wagmi v2.15.4
- **State Management**: TanStack Query v5
- **Reown AppKit**: v1.7.6
- **Network**: XRPL EVM Testnet
- **TypeScript**: Latest

---

## Prerequisites

### 1. Reown Cloud Account

Sign up at [https://cloud.reown.com](https://cloud.reown.com)

### 2. Domain Requirements

For social login to work properly:
- **Development**: Use ngrok or a similar tunneling service
- **Production**: Use a valid HTTPS domain
- Social providers require valid callback URLs

### 3. Environment Variables

You already have the base setup. Add these to `.env.local`:

```bash
# Reown Project ID (already configured)
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here

# App URL (required for social auth callbacks)
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
# For local development with ngrok:
# NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok-free.app

# Other existing variables...
```

---

## Reown Cloud Setup

### Step 1: Create a Reown Cloud Project

1. Go to [https://cloud.reown.com](https://cloud.reown.com)
2. Sign in with your account
3. Click **"Create New Project"**
4. Enter project details:
   - **Name**: `your-app-name` (or your app name)
   - **Type**: Select "Web3Modal/AppKit"
5. Copy the **Project ID** to your `.env.local` as `NEXT_PUBLIC_PROJECT_ID`

### Step 2: Configure Social Providers

In your Reown Cloud dashboard:

#### A. Navigate to Social Providers
1. Select your project
2. Go to **Settings** → **Authentication**
3. Enable **"Social Login"**

#### B. Configure Each Provider

##### Google OAuth

1. Enable Google in Reown dashboard
2. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com):
   - Go to **APIs & Services** → **Credentials**
   - Create **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     https://rpc.walletconnect.org/social/callback
     https://yourapp.vercel.app
     https://your-ngrok-url.ngrok-free.app (for local dev)
     ```
3. Copy **Client ID** and **Client Secret** to Reown dashboard

##### X (Twitter) OAuth

1. Enable X/Twitter in Reown dashboard
2. Go to [Twitter Developer Portal](https://developer.twitter.com):
   - Create a new App
   - Enable **OAuth 2.0**
   - Set callback URL:
     ```
     https://rpc.walletconnect.org/social/callback
     ```
   - Set website URL to your app URL
3. Copy **Client ID** and **Client Secret** to Reown dashboard

##### GitHub OAuth

1. Enable GitHub in Reown dashboard
2. Go to [GitHub Settings](https://github.com/settings/developers):
   - Click **New OAuth App**
   - Application name: `your-app-name`
   - Homepage URL: Your app URL
   - Authorization callback URL:
     ```
     https://rpc.walletconnect.org/social/callback
     ```
3. Copy **Client ID** and **Client Secret** to Reown dashboard

##### Discord OAuth

1. Enable Discord in Reown dashboard
2. Go to [Discord Developer Portal](https://discord.com/developers/applications):
   - Create **New Application**
   - Go to **OAuth2** section
   - Add redirect:
     ```
     https://rpc.walletconnect.org/social/callback
     ```
3. Copy **Client ID** and **Client Secret** to Reown dashboard

##### Apple Sign In

1. Enable Apple in Reown dashboard
2. Go to [Apple Developer](https://developer.apple.com):
   - Create **App ID**
   - Enable **Sign in with Apple**
   - Configure **Service ID**
   - Add domains and redirect URLs
3. Configure in Reown dashboard with:
   - Service ID
   - Team ID
   - Key ID
   - Private Key

### Step 3: Configure Networks in Reown Dashboard

1. In Reown dashboard, go to **Networks**
2. Add **XRPL EVM Testnet**:
   - Network Name: `XRPL EVM Testnet`
   - Chain ID: `1449000`
   - RPC URL: `https://rpc.testnet.xrplevm.org/`
   - Currency Symbol: `XRP`
   - Block Explorer URL: `https://explorer.testnet.xrplevm.org`
3. Set as **default network** for your project

---

## Installation

Your dependencies are already installed! Verify you have:

```json
{
  "@reown/appkit": "^1.7.6",
  "@reown/appkit-adapter-wagmi": "^1.7.6",
  "wagmi": "^2.15.4",
  "viem": "^2.30.0",
  "@tanstack/react-query": "^5.81.5"
}
```

If you need to reinstall or update:

```bash
npm install @reown/appkit@latest @reown/appkit-adapter-wagmi@latest wagmi@latest viem@latest
```

---

## Configuration

### Current Configuration Analysis

Your existing configuration in `/apps/web/src/contexts/index.tsx` is **90% complete**! Here's what you have:

✅ **Already Configured:**
- Wagmi adapter with XRPL EVM testnet
- Social providers enabled (Google, X, GitHub, Discord, Apple)
- Email disabled
- Analytics enabled
- Featured wallets (MetaMask, Keplr)

### Enhancements Needed

#### 1. Update Context Provider for Server-Side Support

Your current implementation passes `cookies={null}` in `layout.tsx`. Update it:

**File: `/apps/web/src/app/layout.tsx`**

```tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import React, { ReactNode } from "react";
import Nav from "@/components/Nav";
import ContextProvider from "@/contexts";
import Footer from "@/components/Footer";
import { headers } from 'next/headers'; // Add this import

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookies = headers().get('cookie'); // Get cookies for SSR
  
  return (
    <html lang="en">
      <body 
        className="min-h-screen flex flex-col bg-softwhite font-sans antialiased"
        suppressHydrationWarning={true}
      >
        <Nav />
        <ContextProvider cookies={cookies}>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </ContextProvider>
        <Footer />
      </body>
    </html>
  );
}
```

#### 2. Enhanced Context Configuration

**File: `/apps/web/src/contexts/index.tsx`**

Update your social configuration with additional options:

```tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { xrplevmTestnet } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Enhanced metadata
const metadata = {
  name: 'Your App',
  description: 'Your App - Decentralized Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/212396159?s=400&u=e6209e7288089b693ce17849cf4ea1e895ec3729&v=4']
}

// Create the modal with enhanced configuration
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [xrplevmTestnet],
  defaultNetwork: xrplevmTestnet,
  metadata: metadata,
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb', // Keplr
  ],
  features: {
    analytics: true,
    email: false, // Disabled as per your config
    socials: [
      'google',
      'x',
      'github',
      'discord',
      'apple',
    ],
    emailShowWallets: true,
  },
  themeMode: 'light', // or 'dark', 'auto'
  themeVariables: {
    // Optional: Customize to match your brand
    '--w3m-accent': '#1a73e8',
    '--w3m-border-radius-master': '4px',
  },
  // Enable wallet detection
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
```

#### 3. Network Configuration

**File: `/apps/web/src/config/index.tsx`**

Your config is already optimal! But here's an enhanced version with comments:

```tsx
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { xrplevmTestnet } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Define networks - XRPL EVM Testnet
export const networks = [xrplevmTestnet];

// Configure Wagmi adapter with SSR support
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage, // Persists connection across page reloads
  }),
  ssr: true, // Enable server-side rendering support
  projectId,
  networks,
  // Optional: Configure custom transports for better performance
  transports: {
    [xrplevmTestnet.id]: http('https://rpc.testnet.xrplevm.org/')
  }
});

export const config = wagmiAdapter.wagmiConfig;
```

---

## Implementation

### Using the Connect Button

Reown provides pre-built UI components. Here are different ways to implement them:

#### Option 1: Default Connect Button (Recommended)

```tsx
import { useAppKit } from '@reown/appkit/react'

export function ConnectButton() {
  const { open } = useAppKit()
  
  return (
    <button onClick={() => open()}>
      Connect Wallet
    </button>
  )
}
```

#### Option 2: AppKit Button Component

```tsx
import { AppKit } from '@reown/appkit/react'

export function ConnectSection() {
  return (
    <div>
      <h2>Connect Your Account</h2>
      <w3m-button />
    </div>
  )
}
```

#### Option 3: Custom Button with Connection State

```tsx
'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'

export function CustomConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Sign In
    </button>
  )
}
```

### Update Your Nav Component

**File: `/apps/web/src/components/Nav.tsx`**

Add the connect button to your navigation:

```tsx
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

export default function Nav() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">Your App</div>
        
        <div className="flex items-center gap-4">
          {/* Other nav items */}
          
          {/* Connect Button */}
          <button
            onClick={() => open()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isConnected 
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
              : 'Connect'
            }
          </button>
        </div>
      </div>
    </nav>
  )
}
```

### Accessing User Account Information

#### Hook: useAccount

```tsx
'use client'

import { useAccount } from 'wagmi'

export function UserProfile() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()

  if (isConnecting) return <div>Connecting...</div>
  if (isDisconnected) return <div>Please connect your account</div>

  return (
    <div>
      <h2>Welcome!</h2>
      <p>Address: {address}</p>
    </div>
  )
}
```

#### Hook: useAccount with Chain Info

```tsx
'use client'

import { useAccount, useChainId } from 'wagmi'

export function AccountDetails() {
  const { address, isConnected, connector } = useAccount()
  const chainId = useChainId()

  if (!isConnected) return null

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Account Details</h3>
      <p>Address: {address}</p>
      <p>Chain ID: {chainId}</p>
      <p>Connected via: {connector?.name}</p>
    </div>
  )
}
```

### Working with Social Authentication

When a user connects via social login (Google, X, etc.), they get a smart contract wallet address. You can detect the connection method:

```tsx
'use client'

import { useAccount } from 'wagmi'

export function ConnectionInfo() {
  const { address, connector, isConnected } = useAccount()

  if (!isConnected) return null

  const isSocialLogin = connector?.name?.includes('WalletConnect')
  
  return (
    <div>
      <p>Connected with: {connector?.name}</p>
      {isSocialLogin && (
        <p className="text-green-600">✓ Signed in with social account</p>
      )}
      <p>Wallet: {address}</p>
    </div>
  )
}
```

### Signing Messages & Transactions

#### Signing Messages

```tsx
'use client'

import { useSignMessage } from 'wagmi'
import { useState } from 'react'

export function SignMessage() {
  const [message, setMessage] = useState('')
  const { signMessage, data, isPending, isSuccess } = useSignMessage()

  const handleSign = () => {
    signMessage({ message })
  }

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message to sign"
      />
      <button onClick={handleSign} disabled={isPending}>
        {isPending ? 'Signing...' : 'Sign Message'}
      </button>
      
      {isSuccess && (
        <div>
          <p>Signature:</p>
          <code>{data}</code>
        </div>
      )}
    </div>
  )
}
```

#### Sending Transactions

```tsx
'use client'

import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

export function SendTransaction() {
  const { sendTransaction, data: hash, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSend = () => {
    sendTransaction({
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      value: parseEther('0.01'),
    })
  }

  return (
    <div>
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Transaction'}
      </button>
      
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isSuccess && <div>Transaction confirmed!</div>}
    </div>
  )
}
```

### Contract Interactions

Your app already has contract addresses. Here's how to interact with them:

```tsx
'use client'

import { useReadContract, useWriteContract } from 'wagmi'

// Read from contract
export function ReadContract() {
  const { data, isLoading } = useReadContract({
    address: process.env.NEXT_PUBLIC_FOOTBALL_DATA_PROVIDER_ADDRESS as `0x${string}`,
    abi: footballDataProviderABI, // Import your ABI
    functionName: 'getMatchday',
    args: [1n],
  })

  if (isLoading) return <div>Loading...</div>

  return <div>Matchday Data: {JSON.stringify(data)}</div>
}

// Write to contract
export function WriteContract() {
  const { writeContract, isPending } = useWriteContract()

  const handleCreate = () => {
    writeContract({
      address: process.env.NEXT_PUBLIC_PRIVATE_FACTORY_ADDRESS as `0x${string}`,
      abi: privateFactoryABI,
      functionName: 'createGroup',
      args: [/* your args */],
    })
  }

  return (
    <button onClick={handleCreate} disabled={isPending}>
      {isPending ? 'Creating...' : 'Create Group'}
    </button>
  )
}
```

---

## Testing & Debugging

### Local Development with ngrok

Social auth requires HTTPS. Use ngrok for local testing:

#### 1. Install ngrok

```bash
brew install ngrok
# or
npm install -g ngrok
```

#### 2. Start your Next.js app

```bash
cd /path/to/your/app
npm run dev
```

#### 3. Create ngrok tunnel

```bash
ngrok http 3000
```

#### 4. Update environment variables

```bash
NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok-free.app
```

#### 5. Update Reown & OAuth Providers

Add the ngrok URL to:
- Reown Cloud Dashboard → Settings → Allowed Origins
- Google OAuth → Authorized redirect URIs
- Other social providers' callback URLs

### Testing Checklist

- [ ] Connect with Google
- [ ] Connect with X/Twitter  
- [ ] Connect with GitHub
- [ ] Connect with Discord
- [ ] Connect with Apple
- [ ] Connect with MetaMask (traditional wallet)
- [ ] Sign message with social account
- [ ] Send transaction with social account
- [ ] Read from contract
- [ ] Write to contract
- [ ] Disconnect and reconnect
- [ ] Test on mobile browser

### Debugging Tools

#### 1. Reown AppKit Modal Debugger

```tsx
import { useAppKit } from '@reown/appkit/react'

export function DebugModal() {
  const { open } = useAppKit()
  
  return (
    <button onClick={() => open({ view: 'Account' })}>
      Open Account View
    </button>
  )
}
```

Available views:
- `'Connect'` - Connection options
- `'Account'` - Account details
- `'Networks'` - Network switcher

#### 2. Console Logging

Add to your context provider:

```tsx
import { useAccount, useChainId } from 'wagmi'
import { useEffect } from 'react'

export function DebugInfo() {
  const account = useAccount()
  const chainId = useChainId()

  useEffect(() => {
    console.log('Account:', account)
    console.log('Chain ID:', chainId)
  }, [account, chainId])

  return null
}
```

#### 3. Wagmi DevTools (Development Only)

```bash
npm install @wagmi/dev
```

```tsx
import { WagmiDevTools } from '@wagmi/dev'

// In your ContextProvider
<WagmiProvider config={wagmiAdapter.wagmiConfig}>
  <QueryClientProvider client={queryClient}>
    {children}
    {process.env.NODE_ENV === 'development' && <WagmiDevTools />}
  </QueryClientProvider>
</WagmiProvider>
```

---

## Production Deployment

### Vercel Deployment

Your app is already deployed on Vercel. Update:

#### 1. Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
NEXT_PUBLIC_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

#### 2. Update Reown Cloud

In Reown Dashboard:
- Add production domain to Allowed Origins:
  ```
  https://yourapp.vercel.app
  ```

#### 3. Update OAuth Providers

Add production callback URLs to all social providers:
- Google: Add `https://yourapp.vercel.app`
- X/Twitter: Add production domain
- GitHub: Add production domain
- Discord: Add production domain
- Apple: Add production domain

#### 4. Deploy

```bash
git add .
git commit -m "Add social sign-in with Reown"
git push origin main
```

Vercel will automatically deploy.

### Security Best Practices

#### 1. Environment Variables

✅ **DO:**
- Store Project ID in environment variables
- Use different Project IDs for dev/staging/prod
- Never commit `.env.local` to git

❌ **DON'T:**
- Hardcode Project IDs
- Share Project IDs publicly
- Use production keys in development

#### 2. Domain Configuration

✅ **DO:**
- Whitelist specific domains in Reown dashboard
- Use HTTPS in production
- Configure CORS properly

❌ **DON'T:**
- Allow all origins (wildcard *)
- Use HTTP in production
- Expose internal endpoints

#### 3. Smart Contract Security

✅ **DO:**
- Validate all user inputs
- Use try/catch for contract calls
- Show clear error messages

```tsx
try {
  await writeContract({
    // contract call
  })
} catch (error) {
  console.error('Transaction failed:', error)
  // Show user-friendly error
}
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: "Project ID not defined"

**Error:**
```
Error: Project ID is not defined
```

**Solution:**
1. Check `.env.local` has `NEXT_PUBLIC_PROJECT_ID`
2. Restart dev server: `npm run dev`
3. Verify environment variable is loaded:
   ```tsx
   console.log('Project ID:', process.env.NEXT_PUBLIC_PROJECT_ID)
   ```

#### Issue 2: Social login button doesn't appear

**Symptoms:**
- Only wallet options shown
- No Google/Twitter/etc buttons

**Solution:**
1. Verify social providers are configured in Reown dashboard
2. Check your context configuration has:
   ```tsx
   features: {
     socials: ['google', 'x', 'github', 'discord', 'apple'],
   }
   ```
3. Clear browser cache and reload

#### Issue 3: OAuth redirect fails

**Error:**
```
redirect_uri_mismatch
```

**Solution:**
1. Check callback URL in OAuth provider matches:
   ```
   https://rpc.walletconnect.org/social/callback
   ```
2. Add your app domain to authorized domains
3. For ngrok, update URL in all providers when tunnel restarts

#### Issue 4: Network switching fails

**Error:**
```
User rejected network switch
```

**Solution:**
1. Ensure XRPL EVM Testnet is configured in Reown dashboard
2. Add network to MetaMask manually:
   - Network Name: `XRPL EVM Testnet`
   - RPC URL: `https://rpc.testnet.xrplevm.org/`
   - Chain ID: `1449000`
   - Currency Symbol: `XRP`
   - Block Explorer: `https://explorer.testnet.xrplevm.org`
3. Check RPC endpoint is accessible:
   ```
   https://rpc.testnet.xrplevm.org/
   ```

#### Issue 5: Transaction fails with social account

**Error:**
```
Insufficient funds or gas
```

**Solution:**
1. Get testnet XRP from faucet:
   ```
   https://faucet.testnet.xrplevm.org
   ```
2. Verify you're on the correct network (Chain ID: 1449000)
3. Check account has balance:
   ```tsx
   import { useBalance } from 'wagmi'
   
   const { data } = useBalance({ address })
   console.log('Balance:', data?.formatted, 'XRP')
   ```

#### Issue 6: SSR Hydration Mismatch

**Error:**
```
Hydration failed because the initial UI does not match
```

**Solution:**
1. Add `suppressHydrationWarning` to body (already done)
2. Use dynamic imports for client components:
   ```tsx
   import dynamic from 'next/dynamic'
   
   const ConnectButton = dynamic(
     () => import('./ConnectButton'),
     { ssr: false }
   )
   ```

### Getting Help

#### 1. Reown Documentation
- [https://docs.reown.com](https://docs.reown.com)
- [AppKit React](https://docs.reown.com/appkit/react/core/installation)
- [Wagmi Integration](https://docs.reown.com/appkit/react/wagmi/about)

#### 2. Community Support
- [Reown Discord](https://discord.com/invite/reown)
- [GitHub Discussions](https://github.com/reown-com/appkit/discussions)

#### 3. Debug Mode

Enable verbose logging:

```tsx
// In your config
const modal = createAppKit({
  // ... other config
  enableAnalytics: true,
  debug: true, // Add this for development
})
```

---

## Advanced Features

### Custom Social Login Flow

If you want more control over the social login UX:

```tsx
'use client'

import { useAppKit } from '@reown/appkit/react'

export function SocialLoginButtons() {
  const { open } = useAppKit()

  const connectWithGoogle = () => {
    open({ view: 'Connect' })
    // The modal will show all options including Google
    // Unfortunately, direct social provider selection is not exposed in the current API
  }

  return (
    <div className="grid gap-4">
      <button
        onClick={connectWithGoogle}
        className="flex items-center justify-center gap-2 px-4 py-2 border rounded"
      >
        <img src="/google-icon.svg" alt="" className="w-5 h-5" />
        Continue with Google
      </button>
      {/* Similar for other providers */}
    </div>
  )
}
```

### Account Abstraction Benefits

When users sign in with socials, they get:

1. **No Seed Phrases**: Users don't need to manage recovery phrases
2. **Gas Sponsorship**: You can sponsor gas fees for better UX
3. **Batch Transactions**: Execute multiple operations in one transaction
4. **Social Recovery**: Account recovery via email/social

### Multi-Chain Support

To add more networks:

```tsx
import { xrplevmTestnet, mainnet, polygon } from '@reown/appkit/networks'

export const networks = [
  xrplevmTestnet,
  mainnet,
  polygon,
]
```

### Custom Theming

Match your brand:

```tsx
const modal = createAppKit({
  // ... other config
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#1a73e8',
    '--w3m-color-mix': '#1a73e8',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '4px',
    '--w3m-font-family': 'Inter, system-ui, sans-serif',
  }
})
```

---

## Complete Example: Profile Page

Here's a complete example integrating everything:

**File: `/apps/web/src/components/SocialProfile.tsx`**

```tsx
'use client'

import { useAccount, useDisconnect, useBalance, useSignMessage } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useState } from 'react'

export default function SocialProfile() {
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const { data: balance } = useBalance({ address })
  const { signMessage, data: signature } = useSignMessage()
  
  const [message, setMessage] = useState('Welcome to Your App!')

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-bold">Connect Your Account</h2>
        <p className="text-gray-600">Sign in with your social account or crypto wallet</p>
        <button
          onClick={() => open()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Connect
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Profile</h2>
            <p className="text-sm text-gray-600">
              Connected via {connector?.name}
            </p>
          </div>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <code className="block p-2 bg-gray-100 rounded">
              {address}
            </code>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Balance</label>
            <p className="text-2xl font-bold">
              {balance?.formatted} {balance?.symbol}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Sign Message</h3>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
              placeholder="Enter message to sign"
            />
            <button
              onClick={() => signMessage({ message })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Message
            </button>
            
            {signature && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Signature</label>
                <code className="block p-2 bg-gray-100 rounded text-xs break-all">
                  {signature}
                </code>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <button
              onClick={() => open({ view: 'Account' })}
              className="w-full px-4 py-2 border rounded hover:bg-gray-50"
            >
              Manage Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Summary

You now have a complete guide to integrate social sign-in with Reown for XRPL EVM testnet! 

### Quick Start Checklist:

- [ ] Create Reown Cloud account
- [ ] Get Project ID
- [ ] Configure social providers (Google, X, GitHub, Discord, Apple)
- [ ] Add environment variables
- [ ] Update `layout.tsx` with cookies
- [ ] Test with ngrok locally
- [ ] Deploy to production
- [ ] Test all social providers
- [ ] Celebrate! 🎉

### Key Benefits:

✅ **Better UX**: Users can sign in with familiar social accounts  
✅ **No Seed Phrases**: Eliminates crypto onboarding friction  
✅ **Multi-Chain**: Works with XRPL EVM and other networks  
✅ **Account Abstraction**: Smart contract wallets with advanced features  
✅ **Production Ready**: Enterprise-grade security and reliability  

### Next Steps:

1. Implement user profiles with social data
2. Add gas sponsorship for better UX
3. Integrate with your prediction contracts
4. Build social features (invite friends, share predictions)
5. Add analytics to track user onboarding

Need help? Check the troubleshooting section or reach out to Reown support!

---

*Last Updated: October 29, 2025*  
*Reown AppKit Version: 1.7.6*  
*Wagmi Version: 2.15.4*
