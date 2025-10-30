import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { xrplevmTestnet } from '@reown/appkit/networks'

// Get the Project ID from environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined. Please add NEXT_PUBLIC_PROJECT_ID to your .env.local file')
}

// Define the XRPL EVM Mainnet network
export const xrplevmMainnet = {
  id: 1440000,
  name: 'XRPL EVM',
  network: 'xrpl-evm',
  nativeCurrency: {
    name: 'XRP',
    symbol: 'XRP',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_XRPL_MAINNET_RPC || 'https://rpc.xrplevm.org/',
        'https://rpc.xrplevm.org/'
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_XRPL_MAINNET_RPC || 'https://rpc.xrplevm.org/',
        'https://rpc.xrplevm.org/'
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'XRPL EVM Explorer',
      url: 'https://explorer.xrplevm.org',
      apiUrl: 'https://explorer.xrplevm.org/api/v2',
    },
  },
  contracts: {
    multicall3: {
      address: '0x6B5eFbC0C82eBb26CA13a4F11836f36Fc6fdBC5D',
      blockCreated: 912208,
    },
  },
  testnet: false,
} as const

// Create networks array for AppKit (type compatible)
export const appKitNetworks = [
  xrplevmMainnet, 
  {
    ...xrplevmTestnet,
    rpcUrls: {
      default: {
        http: [process.env.NEXT_PUBLIC_XRPL_RPC_URL || 'https://rpc.testnet.xrplevm.org/']
      }
    }
  }
]

// Define the XRPL EVM networks for Wagmi
export const networks = [
  xrplevmMainnet,
  xrplevmTestnet
]

// Create Wagmi adapter with XRPL EVM networks configuration
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
})

// Log configuration for debugging
if (typeof window !== 'undefined') {
  console.log('XRPL EVM Networks Config:', {
    mainnet: {
      chainId: xrplevmMainnet.id,
      name: xrplevmMainnet.name,
      rpcUrl: 'https://rpc.xrplevm.org/',
    },
    testnet: {
      chainId: xrplevmTestnet.id,
      name: xrplevmTestnet.name,
      rpcUrl: process.env.NEXT_PUBLIC_XRPL_RPC_URL || 'https://rpc.testnet.xrplevm.org/',
    },
    projectId: projectId
  })
}

export const config = wagmiAdapter.wagmiConfig