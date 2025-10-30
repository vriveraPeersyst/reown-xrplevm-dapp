'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect, useBalance, useChainId } from 'wagmi'
import { xrplevmTestnet } from '@reown/appkit/networks'
import { switchToXRPLEVM } from '@/utils/network'
import { xrplevmMainnet } from '@/config/wagmi'

export default function ConnectWallet() {
  const { open } = useAppKit()
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { data: balance, isLoading: balanceLoading } = useBalance({ 
    address: address as `0x${string}` 
  })

  // Check if the current network is either XRPL EVM mainnet or testnet
  const isCorrectNetwork = chainId === xrplevmTestnet.id || chainId === xrplevmMainnet.id
  const currentNetwork = chainId === xrplevmMainnet.id ? 'XRPL EVM Mainnet' : 
                        chainId === xrplevmTestnet.id ? 'XRPL EVM Testnet' : 'Unknown Network'
  const isMainnet = chainId === xrplevmMainnet.id

  if (!isConnected) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#32E685] to-[#7919FF] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative bg-[#2A2A2A] rounded-2xl p-6 sm:p-8">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-[#32E685]/20 to-[#7919FF]/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#32E685]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Connect to Get Started</h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Use social login or connect your wallet
              </p>
            </div>
            <button
              onClick={() => open()}
              className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-[#32E685] to-[#32E685] hover:from-[#32E685] hover:to-[#5FFFAA] text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 sm:p-8 border border-[#333333] hover:border-[#32E685]/30 transition-all duration-300">
      <div className="space-y-4 sm:space-y-6">
        {/* Connection Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-3 h-3 bg-[#32E685] rounded-full flex-shrink-0 animate-pulse"></div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-400">Connected via</p>
              <p className="text-sm sm:text-base font-semibold truncate">{connector?.name}</p>
            </div>
          </div>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0"
          >
            Disconnect
          </button>
        </div>

        {/* Network Status */}
        <div className={`p-3 rounded-lg border ${
          isCorrectNetwork 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-xs sm:text-sm ${
                isCorrectNetwork ? (isMainnet ? 'text-green-400' : 'text-blue-400') : 'text-gray-300'
              }`}>
                {isCorrectNetwork ? currentNetwork : 'Wrong Network'}
              </span>
            </div>
            {!isCorrectNetwork && (
              <button
                onClick={async () => {
                  // try to switch/add XRPL EVM first, then open the networks modal as a fallback
                  try {
                    await switchToXRPLEVM()
                  } catch (e) {
                    // ignore and open modal
                  }
                  open({ view: 'Networks' })
                }}
                className="px-2 py-1 bg-[#7919FF]/20 hover:bg-[#7919FF]/30 text-[#C890FF] rounded text-xs"
              >
                Switch
              </button>
            )}
          </div>
        </div>

        {/* Address Display */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
            Wallet Address
          </label>
          <div className="bg-black/40 rounded-lg p-3 sm:p-4 border border-[#333333]">
            <code className="text-xs sm:text-sm text-[#32E685] break-all font-mono">
              {address}
            </code>
          </div>
        </div>

        {/* Balance Display */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
            Balance
          </label>
          <div className="bg-gradient-to-r from-[#7919FF]/10 to-[#C890FF]/10 rounded-lg p-4 sm:p-6 border border-[#7919FF]/20">
            {balanceLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-[#C890FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-400">Loading...</span>
              </div>
            ) : (
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-gradient">
                  {balance?.formatted ? 
                    parseFloat(balance.formatted).toFixed(4) : 
                    '0.0000'
                  }
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">
                  {balance?.symbol || 'XRP'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Management */}
        <div className="flex gap-2">
          <button
            onClick={() => open({ view: 'Networks' })}
            className="flex-1 px-4 py-3 bg-[#7919FF]/20 hover:bg-[#7919FF]/30 border border-[#7919FF]/30 rounded-lg text-sm sm:text-base transition-colors font-medium text-[#C890FF]"
          >
            Network
          </button>
          <button
            onClick={() => open({ view: 'Account' })}
            className="flex-1 px-4 py-3 bg-[#333333] hover:bg-[#3A3A3A] border border-[#444444] rounded-lg text-sm sm:text-base transition-colors font-medium"
          >
            Account
          </button>
        </div>
      </div>
    </div>
  )
}