import { ChainAddresses } from '@humanode-hyperlane/registry';
import { ChainMap } from '@humanode-hyperlane/sdk';

// Per-chain contract addresses to merge with the configured registry's
// addresses. Entries here override registry entries per key. Useful when
// you need TypeScript-side imports (e.g. importing pre-built `*Addresses`
// constants from `@humanode-hyperlane/registry`).
//
// For YAML-friendly definitions, use `chainAddresses.yaml` instead.
// Schema: any contract addresses you'd find in a registry chain's addresses.yaml
// (e.g. mailbox, quotedCalls, validatorAnnounce, ...)
export const addresses: ChainMap<ChainAddresses> = {
  // mychain: {
  //   mailbox: '0x...',
  //   quotedCalls: '0x...',
  // },
};
