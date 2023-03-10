import { HelmetProvider } from 'react-helmet-async';

import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet } from "wagmi/chains";

import { AuthProvider } from '~/components/auth/AuthProvider';
import Router from '~/components/router/Router';

const { provider, webSocketProvider } = configureChains([mainnet], [
  publicProvider(),
]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

export default function App() {
  return (
    <WagmiConfig client={client}>
      <HelmetProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </HelmetProvider>
    </WagmiConfig>
  );
}
