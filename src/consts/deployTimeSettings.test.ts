import { afterEach, describe, expect, it, vi } from 'vitest';

import { deployTimeSetting } from './deployTimeSettings';

const NAME = 'NEXT_PUBLIC_WALLET_CONNECT_ID';

describe('deployTimeSetting', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('gives the value the deployment set', () => {
    vi.stubGlobal('window', { __APP_CONFIG__: { [NAME]: 'abc' } });
    expect(deployTimeSetting(NAME)).toBe('abc');
  });

  it('gives nothing for a setting the deployment left empty', () => {
    vi.stubGlobal('window', { __APP_CONFIG__: { [NAME]: '' } });
    expect(deployTimeSetting(NAME)).toBeUndefined();
  });

  it('gives nothing when no deploy-time settings are loaded', () => {
    vi.stubGlobal('window', {});
    expect(deployTimeSetting(NAME)).toBeUndefined();
  });

  it('gives nothing outside a browser', () => {
    expect(deployTimeSetting(NAME)).toBeUndefined();
  });
});
