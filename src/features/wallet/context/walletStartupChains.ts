import type { ChainMetadata } from '@humanode-hyperlane/sdk';

// The chains the Cosmos and Starknet wallet contexts start with before any of
// the app's own chains is known: CosmosKit throws without a Cosmos chain, and
// Starknet React needs an initial chain. They are public chains' metadata, as
// upstream's registry gives it; our registry holds only our own chains, so the
// app keeps these itself. Neither is a route the app offers.

export const cosmoshubStartupChain = {
  bech32Prefix: 'cosmos',
  blockExplorers: [
    {
      apiUrl: 'https://apis.mintscan.io/v1/cosmos',
      family: 'other',
      name: 'MintScan',
      url: 'https://www.mintscan.io/cosmos',
    },
  ],
  blocks: { confirmations: 1, estimateBlockTime: 6, reorgPeriod: 1 },
  canonicalAsset: 'uatom',
  chainId: 'cosmoshub-4',
  displayName: 'Cosmos Hub',
  domainId: 1668248429,
  gasCurrencyCoinGeckoId: 'cosmos',
  grpcUrls: [
    { http: 'grpc-cosmoshub-ia.cosmosia.notional.ventures:443' },
    { http: 'cosmos-grpc.polkachu.com:14990' },
  ],
  name: 'cosmoshub',
  nativeToken: { decimals: 6, denom: 'uatom', name: 'Atom', symbol: 'ATOM' },
  protocol: 'cosmos',
  restUrls: [
    { http: 'https://cosmos-lcd.quickapi.com:443' },
    { http: 'https://rest.cosmoshub.goldenratiostaking.net' },
  ],
  rpcUrls: [
    { http: 'https://cosmos-rpc.quickapi.com:443' },
    { http: 'https://rpc-cosmoshub.ecostake.com' },
  ],
  slip44: 118,
  technicalStack: 'other',
} as ChainMetadata;

export const starknetsepoliaStartupChain = {
  blockExplorers: [
    {
      apiUrl: 'https://sepolia.voyager.online/api',
      family: 'voyager',
      name: 'Starknet Sepolia Explorer',
      url: 'https://sepolia.voyager.online',
    },
  ],
  blocks: { confirmations: 1, estimateBlockTime: 30, reorgPeriod: 1 },
  chainId: '0x534e5f5345504f4c4941',
  displayName: 'Starknet Sepolia',
  domainId: 23448591,
  isTestnet: true,
  name: 'starknetsepolia',
  nativeToken: {
    decimals: 18,
    denom: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    name: 'StarkNet Token',
    symbol: 'STRK',
  },
  protocol: 'starknet',
  rpcUrls: [
    { http: 'https://starknet-sepolia-rpc.publicnode.com' },
    { http: 'https://rpc.starknet-testnet.lava.build/' },
  ],
} as ChainMetadata;
