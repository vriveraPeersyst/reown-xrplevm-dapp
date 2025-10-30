'use client'

import { wagmiAdapter, projectId } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { xrplevmTestnet } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'XRPL EVM Reown DApp',
  description: 'A simple dApp with social login and XRP transfers on XRPL EVM Testnet',
  url: 'https://reown-xrplevm-dapp.vercel.app',
  icons: ['https://peersyst-public-production.s3.eu-west-1.amazonaws.com/6ceeac0b-f6f0-4a4d-8aa0-fc3da5601d35.jpg']
}

// Create the modal - identical to working web app
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [xrplevmTestnet],
  defaultNetwork: xrplevmTestnet,
  metadata: metadata,
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
  ],
  features: {
    analytics: true,
    email: false,
    socials: [
      'google',
      'x',
      'github',
      'discord',
      'apple',
    ],
    emailShowWallets: true,
  },
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