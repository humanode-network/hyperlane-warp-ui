import {
  GithubRegistry,
  warpRouteConfigs as publishedWarpRouteConfigs,
} from '@humanode-hyperlane/registry';
import { WarpCoreConfig } from '@humanode-hyperlane/sdk';
import { objKeys } from '@humanode-hyperlane/utils';
import { assert, test } from 'vitest';

import { config } from './config';
import { warpRouteWhitelist } from './warpRouteWhitelist';

test('warpRouteWhitelist', async () => {
  if (!warpRouteWhitelist) return;

  const registry = new GithubRegistry({
    uri: config.registryUrl,
    branch: config.registryBranch,
    proxyUrl: config.registryProxyUrl,
  });
  let warpRouteConfigs: Record<string, WarpCoreConfig>;

  try {
    warpRouteConfigs = await registry.getWarpRoutes();
  } catch {
    warpRouteConfigs = publishedWarpRouteConfigs;
  }

  const uppercaseConfigKeys = new Set(objKeys(warpRouteConfigs).map((key) => key.toUpperCase()));
  for (const id of warpRouteWhitelist) {
    assert(uppercaseConfigKeys.has(id.toUpperCase()), `No route with id ${id} found in registry.`);
  }
});
