import { AleoNetwork, setAleoNetwork } from '@humanode-hyperlane/widgets/walletIntegrations/aleo';
import { AleoPopupProvider } from '@humanode-hyperlane/widgets/walletIntegrations/aleo/AleoProviders';
import type { PropsWithChildren } from 'react';

import { config } from '../../../consts/config';

setAleoNetwork(config.aleoNetwork === 'mainnet' ? AleoNetwork.MAINNET : AleoNetwork.TESTNET);

export function AleoWalletContext({ children }: PropsWithChildren<unknown>) {
  return <AleoPopupProvider>{children}</AleoPopupProvider>;
}
