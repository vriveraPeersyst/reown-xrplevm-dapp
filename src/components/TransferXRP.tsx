'use client'

import { useState, useEffect } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useBalance, useChainId } from 'wagmi'
import { parseEther, isAddress, formatEther } from 'viem'
import { useAppKit } from '@reown/appkit/react'
import { xrplevmTestnet } from '@reown/appkit/networks'
import { xrplevmMainnet } from '@/config/wagmi'

export default function TransferXRP() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const chainId = useChainId()
  const { data: balance } = useBalance({
    address: address,
  })
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<{recipient?: string, amount?: string}>({})

  // Check if the current network is either XRPL EVM mainnet or testnet
  const isCorrectNetwork = chainId === xrplevmTestnet.id || chainId === xrplevmMainnet.id
  const currentNetwork = chainId === xrplevmMainnet.id ? 'XRPL EVM Mainnet' : 'XRPL EVM Testnet'
  const isMainnet = chainId === xrplevmMainnet.id
  
  const { 
    sendTransaction, 
    data: hash, 
    isPending: isSending,
    error: sendError 
  } = useSendTransaction()

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  const validateForm = () => {
    const newErrors: {recipient?: string, amount?: string} = {}
    
    if (!recipient) {
      newErrors.recipient = 'Recipient address is required'
    } else if (!isAddress(recipient)) {
      newErrors.recipient = 'Invalid address format'
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number'
    } else if (balance && parseEther(amount) > balance.value) {
      newErrors.amount = `Insufficient balance. You have ${formatEther(balance.value)} XRP`
    } else if (!isMainnet && Number(amount) > 1000) {
      newErrors.amount = 'Amount too large. Please enter a smaller amount for testing'
    } else if (isMainnet && Number(amount) > 10000) {
      newErrors.amount = 'Amount too large. Please enter a smaller amount'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTransfer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validateForm()) return
    
    try {
      const value = parseEther(amount)
      
      console.log('🚀 Initiating transfer:', {
        to: recipient,
        amount: amount,
        valueWei: value.toString(),
        chainId,
        address,
      })
      
      // Simple transaction - let wagmi handle gas automatically
      // Explicitly set gas to undefined to let wagmi estimate it
      sendTransaction({
        to: recipient as `0x${string}`,
        value,
        gas: undefined, // Let wagmi estimate gas
      })
    } catch (error) {
      console.error('❌ Transfer failed:', error)
    }
  }

  const resetForm = () => {
    setRecipient('')
    setAmount('')
    setErrors({})
  }

  // Handle success
  useEffect(() => {
    if (isConfirmed) {
      console.log('✅ Transaction successful!')
      resetForm()
    }
  }, [isConfirmed])

  // Handle error  
  useEffect(() => {
    if (sendError) {
      console.error('❌ Transaction error:', sendError)
    }
  }, [sendError])

  if (!isConnected) {
    return (
      <div className="bg-[#2A2A2A] rounded-2xl p-6 sm:p-8 border border-[#333333]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-[#7919FF]/10 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-[#7919FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-sm sm:text-base text-gray-400">
            Connect your wallet to transfer XRP
          </p>
        </div>
      </div>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <div className="bg-[#2A2A2A] rounded-2xl p-6 sm:p-8 border border-red-500/30">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Wrong Network</h3>
            <p className="text-sm text-gray-400 mb-4">
              Please switch to XRPL EVM Mainnet or Testnet to transfer XRP
            </p>
            <button
              onClick={async () => {
                try {
                  // attempt to switch/add XRPL EVM mainnet in user's injected wallet
                  const { switchToXRPLEVM } = await import('@/utils/network')
                  await switchToXRPLEVM()
                } catch (e) {
                  // fall back to opening networks modal
                }
                open({ view: 'Networks' })
              }}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors font-medium"
            >
              Switch Network
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 sm:p-8 border border-[#333333] hover:border-[#7919FF]/30 transition-all duration-300">
      <div className="space-y-4 sm:space-y-6">
        {/* Debug Info (Remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-xs text-yellow-400 font-mono">
              Debug: Chain ID: {chainId} | Network: {currentNetwork} | Valid: {isCorrectNetwork ? 'Yes' : 'No'}
            </p>
          </div>
        )}

        {/* Network Display */}
        <div className="bg-black/40 rounded-lg p-3 sm:p-4 border border-[#333333]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-400">Connected Network:</span>
            <span className={`text-sm sm:text-base font-semibold ${isMainnet ? 'text-green-400' : 'text-blue-400'}`}>
              {currentNetwork}
            </span>
          </div>
        </div>

        {/* Balance Display */}
        {balance && (
          <div className="bg-black/40 rounded-lg p-3 sm:p-4 border border-[#333333]">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-400">Your Balance:</span>
              <span className="text-sm sm:text-base font-semibold text-white">
                {Number(formatEther(balance.value)).toFixed(4)} XRP
              </span>
            </div>
          </div>
        )}

        {/* Recipient Address Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border ${
              errors.recipient ? 'border-red-500' : 'border-[#333333] focus:border-[#7919FF]'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7919FF]/20 transition-all text-sm sm:text-base`}
          />
          {errors.recipient && (
            <p className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.recipient}
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            Amount (XRP)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              step="0.0001"
              min="0"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border ${
                errors.amount ? 'border-red-500' : 'border-[#333333] focus:border-[#C890FF]'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C890FF]/20 transition-all text-sm sm:text-base`}
            />
            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm">
              XRP
            </span>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setAmount('0.1')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#3A3A3A] text-gray-300 rounded text-xs transition-colors"
            >
              0.1
            </button>
            <button
              type="button"
              onClick={() => setAmount('1')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#3A3A3A] text-gray-300 rounded text-xs transition-colors"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setAmount('5')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#3A3A3A] text-gray-300 rounded text-xs transition-colors"
            >
              5
            </button>
            {balance && Number(formatEther(balance.value)) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const maxAmount = Number(formatEther(balance.value)) - 0.001 // Leave some for gas
                  setAmount(Math.max(0, maxAmount).toFixed(4))
                }}
                className="px-2 py-1 bg-[#7919FF]/20 hover:bg-[#7919FF]/30 text-[#C890FF] rounded text-xs transition-colors"
              >
                Max
              </button>
            )}
          </div>
          
          {errors.amount && (
            <p className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleTransfer}
          disabled={isSending || isConfirming}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#C890FF] to-[#7919FF] hover:from-[#C890FF] hover:to-[#9D4FFF] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 font-semibold text-sm sm:text-base"
        >
          {isSending && (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          )}
          {isConfirming && (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Confirming...
            </span>
          )}
          {!isSending && !isConfirming && 'Send Transfer'}
        </button>

        {/* Error Display */}
        {sendError && (
          <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-xs sm:text-sm text-red-400">
              <strong>Transaction Failed:</strong> 
              {sendError.message.includes('insufficient funds') ? 
                ' Insufficient balance to complete this transaction.' :
                sendError.message.includes('Load failed') ?
                ' Network error. Please check your connection and try again.' :
                ` ${sendError.message}`
              }
            </p>
            {sendError.message.includes('Load failed') && (
              <p className="text-xs text-gray-400 mt-2">
                💡 Try using a smaller amount or check if you have enough XRP for gas fees.
              </p>
            )}
          </div>
        )}

        {/* Transaction Status */}
        {hash && (
          <div className="space-y-3">
            <div className="p-3 sm:p-4 bg-[#7919FF]/10 border border-[#7919FF]/30 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-300 mb-2 font-medium">
                Transaction Hash:
              </p>
              <code className="text-xs break-all text-[#C890FF] block font-mono">
                {hash}
              </code>
            </div>
            
            {isConfirmed && (
              <div className="p-3 sm:p-4 bg-[#32E685]/10 border border-[#32E685]/30 rounded-lg">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-5 h-5 text-[#32E685] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#32E685] font-semibold mb-1">
                      Transaction Confirmed!
                    </p>
                    <a
                      href={`${isMainnet ? 'https://explorer.xrplevm.org' : 'https://explorer.testnet.xrplevm.org'}/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-[#C890FF] hover:text-[#7919FF] underline inline-flex items-center gap-1 break-all"
                    >
                      View on Explorer
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* New Transfer Button */}
        {isConfirmed && (
          <button
            onClick={resetForm}
            className="w-full py-2.5 sm:py-3 bg-[#333333] hover:bg-[#3A3A3A] text-gray-300 rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            Send Another Transfer
          </button>
        )}
      </div>
    </div>
  )
}