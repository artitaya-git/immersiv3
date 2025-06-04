import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css'; 
import './model-viewer.d.ts'; 
import '@google/model-viewer';
import '@mysten/dapp-kit/dist/index.css'; // Sui ConnectModal need this CSS

import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from '@mysten/dapp-kit'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 

document.documentElement.classList.add('dark'); 

const { networkConfig } = createNetworkConfig({
  testnet: { url: 'https://fullnode.testnet.sui.io' }, 
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

