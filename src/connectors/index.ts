import {InjectedConnector} from '@web3-react/injected-connector';
import {NetworkConnector} from '@web3-react/network-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {WalletLinkConnector} from '@web3-react/walletlink-connector';

import {PUBLIC_NODE_URLS_BY_NETWORK_ID} from 'utils';

const POLLING_INTERVAL = 12000;

const RPC_URLS = {
  1: PUBLIC_NODE_URLS_BY_NETWORK_ID[1],
  3: PUBLIC_NODE_URLS_BY_NETWORK_ID[3],
};

export const network = new NetworkConnector({
  urls: {1: RPC_URLS[1], 3: RPC_URLS[3]},
  defaultChainId: 1,
});

const newWalletConnect = () =>
  new WalletConnectConnector({
    rpc: {1: RPC_URLS[1]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  });

const newWalletLink = () =>
  new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: '',
  });

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3],
});

export let walletconnect = newWalletConnect();
export let walletlink = newWalletLink();

export const resetWalletConnect = () => {
  walletconnect = newWalletConnect();
};

export const resetWalletLink = () => {
  walletlink = newWalletLink();
};
