import { xrplevmMainnet } from '@/config/wagmi'

export const addXRPLEVMToWallet = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${xrplevmMainnet.id.toString(16)}`, // Convert to hex
            chainName: xrplevmMainnet.name,
            nativeCurrency: {
              name: xrplevmMainnet.nativeCurrency.name,
              symbol: xrplevmMainnet.nativeCurrency.symbol,
              decimals: xrplevmMainnet.nativeCurrency.decimals,
            },
            rpcUrls: xrplevmMainnet.rpcUrls.default.http,
            blockExplorerUrls: [xrplevmMainnet.blockExplorers.default.url],
          },
        ],
      })
    } catch (error) {
      console.error('Error adding XRPL EVM to wallet:', error)
    }
  }
}

export const switchToXRPLEVM = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${xrplevmMainnet.id.toString(16)}` }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await addXRPLEVMToWallet()
      }
    }
  }
}