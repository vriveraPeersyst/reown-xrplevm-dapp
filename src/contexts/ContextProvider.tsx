'use client'

import { wagmiAdapter, projectId, xrplevmMainnet, appKitNetworks } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { xrplevmTestnet } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient for TanStack Query
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// App metadata for Reown
const metadata = {
  name: 'XRPL EVM Reown DApp',
  description: 'A simple dApp with social login and XRP transfers on XRPL EVM networks',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/212396159?s=400&u=e6209e7288089b693ce17849cf4ea1e895ec3729&v=4']
}

// Create the Reown AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [xrplevmMainnet, xrplevmTestnet],
  defaultNetwork: xrplevmMainnet,
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
    onramp: false,
    swaps: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7919FF',
    '--w3m-border-radius-master': '8px',
  },
})

function ContextProvider({ 
  children, 
  cookies 
}: { 
  children: ReactNode
  cookies: string | null 
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config, 
    cookies
  )

  return (
    <WagmiProvider 
      config={wagmiAdapter.wagmiConfig as Config} 
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider