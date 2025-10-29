import ConnectWallet from "@/components/ConnectWallet";
import TransferXRP from "@/components/TransferXRP";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7919FF] via-black to-[#32E685] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6">
              <span className="text-gradient">XRPL EVM</span> Reown DApp
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Experience seamless social login and instant XRP transfers on the XRPL EVM Sidechain
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid gap-6 sm:gap-8 lg:grid-cols-2 mb-12 sm:mb-16">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#32E685] to-[#32E685] flex items-center justify-center">
                    <span className="text-black font-semibold text-sm sm:text-base">1</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold">Connect Your Wallet</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-400 pl-11 sm:pl-13">
                  Sign in with social accounts or traditional wallets
                </p>
              </div>
              <ConnectWallet />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#C890FF] to-[#7919FF] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">2</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold">Transfer XRP</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-400 pl-11 sm:pl-13">
                  Send XRP instantly with low fees
                </p>
              </div>
              <TransferXRP />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
