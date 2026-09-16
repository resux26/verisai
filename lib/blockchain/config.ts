import { http, createConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';

export const config = createConfig({
  chains: [hardhat],
  ssr: true,
  transports: {
    [hardhat.id]: http(),
  },
});
