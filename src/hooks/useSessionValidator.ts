// src/hooks/useSessionValidator.ts
// Hook to validate wallet session and detect stale connections
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAppKitAccount, useAppKitState, useDisconnect } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

/**
 * This hook validates the wallet session and handles edge cases:
 * 1. Detects when AppKit shows connected but wagmi shows disconnected (stale session)
 * 2. Ensures AppKit is fully initialized before allowing connections
 * 3. Periodically validates the session is still active
 */
export function useSessionValidator() {
  const { address: appKitAddress, isConnected: appKitConnected, status: appKitStatus } = useAppKitAccount()
  const { address: wagmiAddress, isConnected: wagmiConnected, status: wagmiStatus } = useAccount()
  const { initialized, loading } = useAppKitState()
  const { disconnect } = useDisconnect()
  const hasLoggedMismatch = useRef(false)
  const lastValidationTime = useRef<number>(Date.now())
  
  // Detect stale session: AppKit says connected but wagmi says disconnected
  const isStaleSession = appKitConnected && !wagmiConnected && wagmiStatus === 'disconnected'
  
  // Detect mismatched addresses
  const hasAddressMismatch = appKitAddress && wagmiAddress && 
    appKitAddress.toLowerCase() !== wagmiAddress.toLowerCase()
  
  // Force disconnect on stale session
  useEffect(() => {
    if (isStaleSession && initialized && !loading) {
      if (!hasLoggedMismatch.current) {
        console.warn('⚠️ Stale session detected: AppKit connected but wagmi disconnected. Forcing disconnect.')
        hasLoggedMismatch.current = true
      }
      
      // Wait a bit to ensure it's not just a temporary state during reconnection
      const timeout = setTimeout(() => {
        if (isStaleSession) {
          console.log('🔄 Disconnecting stale session...')
          disconnect()
          hasLoggedMismatch.current = false
        }
      }, 2000)
      
      return () => clearTimeout(timeout)
    } else {
      hasLoggedMismatch.current = false
    }
  }, [isStaleSession, initialized, loading, disconnect])
  
  // Handle address mismatch
  useEffect(() => {
    if (hasAddressMismatch) {
      console.warn('⚠️ Address mismatch detected between AppKit and wagmi. This may indicate a session issue.')
    }
  }, [hasAddressMismatch])
  
  // Validate session is still active by checking connection status periodically
  // This helps detect when the embedded wallet session expires
  const validateSession = useCallback(async () => {
    if (!appKitConnected || !appKitAddress) return true
    
    const now = Date.now()
    // Only validate every 30 seconds
    if (now - lastValidationTime.current < 30000) return true
    lastValidationTime.current = now
    
    // Check if wagmi still has a valid connector
    if (wagmiStatus === 'disconnected' && appKitConnected) {
      console.log('⚠️ Session validation failed: wagmi disconnected while AppKit shows connected')
      return false
    }
    
    return true
  }, [appKitConnected, appKitAddress, wagmiStatus])
  
  // Log status for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Session status:', {
        appKitConnected,
        wagmiConnected,
        appKitStatus,
        wagmiStatus,
        initialized,
        loading,
        isStaleSession
      })
    }
  }, [appKitConnected, wagmiConnected, appKitStatus, wagmiStatus, initialized, loading, isStaleSession])
  
  return {
    isStaleSession,
    hasAddressMismatch,
    isAppKitReady: initialized && !loading,
    validateSession,
    // True if both AppKit and wagmi agree on connection status
    isValidConnection: appKitConnected === wagmiConnected && !hasAddressMismatch
  }
}

export default useSessionValidator
