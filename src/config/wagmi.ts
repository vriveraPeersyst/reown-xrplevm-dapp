import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { xrplevmTestnet } from '@reown/appkit/networks'

// Get the Project ID from environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined. Please add NEXT_PUBLIC_PROJECT_ID to your .env.local file')
}

// Define the XRPL EVM Testnet network
export const networks = [xrplevmTestnet]

// Create Wagmi adapter with XRPL EVM Testnet configuration
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [xrplevmTestnet.id]: http(process.env.NEXT_PUBLIC_XRPL_RPC_URL || 'https://rpc.testnet.xrplevm.org/')
  }
})

export const config = wagmiAdapter.wagmiConfig