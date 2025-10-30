# Quick Setup Guide

Follow these steps to get the XRPL EVM Reown DApp running with social login.

## Step 1: Install Dependencies

```bash
cd /Users/vrcasadella/Documents/onehextwo-v1/reown-xrplevm-dapp
npm install
```

Or with yarn:
```bash
yarn install
```

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Reown Project ID:
   - Go to https://cloud.reown.com
   - Sign in or create an account
   - Create a new AppKit project
   - Copy your Project ID

3. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 3: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your app!

## Step 4: Enable Social Login (Optional for Local Testing)

Social login requires HTTPS. For local development:

### Option A: Use ngrok (Recommended)

1. Install ngrok: https://ngrok.com/download

2. In a new terminal:
   ```bash
   ngrok http 3000
   ```

3. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)

4. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok-free.app
   ```

5. Restart your dev server

6. Configure Reown Cloud:
   - Go to your project in https://cloud.reown.com
   - Settings → Authentication
   - Enable Social Login
   - Add allowed origin: `https://abc123.ngrok-free.app`
   - Configure each social provider with redirect URI: `https://abc123.ngrok-free.app/__reown/auth`

### Option B: Test in Production

Deploy to Vercel/Netlify and configure with production URLs.

## Step 5: Configure Social Providers

For each provider you want to enable:

### Google
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-domain.com/__reown/auth`
4. Copy Client ID to Reown dashboard

### GitHub
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Authorization callback URL: `https://your-domain.com/__reown/auth`
4. Copy Client ID and Secret to Reown dashboard

### X (Twitter)
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create app with OAuth 2.0
3. Add redirect URI: `https://your-domain.com/__reown/auth`
4. Copy Client ID and Secret to Reown dashboard

### Discord
1. Go to https://discord.com/developers/applications
2. Create application
3. OAuth2 redirect: `https://your-domain.com/__reown/auth`
4. Copy Client ID and Secret to Reown dashboard

### Apple
1. Go to https://developer.apple.com/account
2. Create Services ID
3. Configure Sign in with Apple
4. Return URL: `https://your-domain.com/__reown/auth`
5. Configure in Reown dashboard

## Testing

1. **Wallet Connection**: Click "Connect Wallet" button
2. **Social Login**: Select a social provider and authorize
3. **Network Check**: Ensure you're on XRPL EVM Testnet (Chain ID: 1440002)
4. **Get Testnet XRP**: Visit https://faucet.testnet.xrplevm.org
5. **Transfer**: Try sending testnet XRP

## Troubleshooting

### "Cannot find module" errors
Run: `npm install` or `yarn install`

### Social login doesn't work locally
- Make sure you're using ngrok or another HTTPS tunnel
- Verify NEXT_PUBLIC_APP_URL matches your ngrok URL
- Check Reown dashboard has correct redirect URIs

### Wrong network
- Click "Switch Network" button in the app
- Or manually add XRPL EVM Testnet to your wallet

### Build errors
```bash
rm -rf node_modules .next
npm install
npm run dev
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [APPKIT_CONFIGURATION.md](./APPKIT_CONFIGURATION.md) for configuration details
- Deploy to production (see README for deployment guide)

## Resources

- [Reown AppKit Docs](https://docs.reown.com/appkit/overview)
- [XRPL EVM Docs](https://docs.xrplevm.org)
- [Wagmi Docs](https://wagmi.sh)
- [Next.js Docs](https://nextjs.org/docs)

---

Happy building! 🚀
