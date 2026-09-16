'use client';

import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { truncateAddress } from '../../lib/utils/format';
import { Button } from '../ui/Button';

function ConnectButtonInner() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Use the injected connector (MetaMask, etc) by default for simplicity
  const injectedConnector = connectors[0]; 

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border-default rounded-full">
          <div className="w-2 h-2 rounded-full bg-color-success"></div>
          <span className="text-sm font-mono text-text-secondary">
            {truncateAddress(address)}
          </span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => disconnect()}
          className="!p-2 text-text-secondary hover:text-color-error"
          title="Disconnect Wallet"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="primary" 
      onClick={() => connect({ connector: injectedConnector })}
      disabled={isConnecting || isPending}
      className="text-sm px-4 py-2"
    >
      {isConnecting || isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>{isConnecting || isPending ? 'Connecting...' : 'Connect Wallet'}</span>
    </Button>
  );
}

export function ConnectButton() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="primary" disabled className="text-sm px-4 py-2 w-36">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }

  return <ConnectButtonInner />;
}
