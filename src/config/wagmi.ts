import { cookieStorage, createStorage } from '@wagmi/core'
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
      http: ['https://rpc.xrplevm.org']
    },
    public: {
      http: ['https://rpc.xrplevm.org']
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

// Define the XRPL EVM networks for Wagmi
export const networks = [xrplevmMainnet, xrplevmTestnet]

// Create Wagmi adapter - keep it simple like the working web app
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig