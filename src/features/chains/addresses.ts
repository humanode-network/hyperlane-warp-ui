import { ChainAddresses, ChainAddressesSchema, IRegistry } from '@humanode-hyperlane/registry';
import { ChainMap, ChainName } from '@humanode-hyperlane/sdk';
import { objFilter, objMerge } from '@humanode-hyperlane/utils';
import { z } from 'zod';

import { addresses as ChainAddressesTS } from '../../consts/chainAddresses.ts';
import ChainAddressesYaml from '../../consts/chainAddresses.yaml';
import { config } from '../../consts/config';
import { logger } from '../../utils/logger';

export async function assembleChainAddresses(
  chainsInTokens: ChainName[],
  registry: IRegistry,
): Promise<ChainMap<ChainAddresses>> {
  const result = z.record(z.string(), ChainAddressesSchema).safeParse({
    ...ChainAddressesYaml,
    ...ChainAddressesTS,
  });
  if (!result.success) {
    logger.warn('Invalid chain addresses', result.error);
    throw new Error(`Invalid chain addresses: ${result.error.toString()}`);
  }
  const filesystemAddresses = result.data;

  let registryChainAddresses: ChainMap<ChainAddresses> | undefined;
  if (config.registryUrl) {
    try {
      logger.debug('Using custom registry chain addresses from:', config.registryUrl);
      registryChainAddresses = await registry.getAddresses();
    } catch (error) {
      logger.warn(
        'Failed fetching chain addresses from GH registry, using published addresses',
        config.registryUrl,
        error,
      );
    }
  } else {
    logger.debug('Using default published registry for chain addresses');
  }
  if (!registryChainAddresses) {
    registryChainAddresses = (await import('@humanode-hyperlane/registry')).chainAddresses;
  }

  // Filter to only chains referenced by the configured warp routes
  registryChainAddresses = objFilter(registryChainAddresses, (c, _a): _a is ChainAddresses =>
    chainsInTokens.includes(c),
  );

  // Filesystem entries override registry entries per key
  return objMerge<ChainMap<ChainAddresses>>(registryChainAddresses, filesystemAddresses);
}
