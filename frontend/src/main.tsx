import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css'; // Global styles
import './model-viewer.d.ts'; // Type declaration for model-viewer
import '@google/model-viewer';
import '@mysten/dapp-kit/dist/index.css'; // Sui ConnectModal need this CSS

import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit'; // Sui wallet integration
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // React Query for data fetching

document.documentElement.classList.add('dark'); // Force dark mode for default  

// Define network configuration for Sui
const { networkConfig } = createNetworkConfig({
  testnet: { url: 'https://fullnode.testnet.sui.io' }, // Connect to Sui Testnet
});

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

// Render the main application component
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     {/* Provide React Query client to the application */}
    <QueryClientProvider client={queryClient}>
      {/* Provide Sui client and network configuration */}
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        {/* Provide wallet connection capabilities */}
        <WalletProvider autoConnect>
          {/* Render the main application component */}
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

