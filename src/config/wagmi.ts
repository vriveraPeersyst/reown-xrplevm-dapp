import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { xrplevmTestnet } from '@reown/appkit/networks'

// Get the Project ID from environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined. Please add NEXT_PUBLIC_PROJECT_ID to your .env.local file')
}

// Define the XRPL EVM networks for Wagmi
export const networks = [xrplevmTestnet]

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