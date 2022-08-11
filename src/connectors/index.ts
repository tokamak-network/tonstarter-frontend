import {InjectedConnector} from '@web3-react/injected-connector';
import {NetworkConnector} from '@web3-react/network-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {WalletLinkConnector} from '@web3-react/walletlink-connector';
import {TrezorConnector} from '@web3-react/trezor-connector';

// import {REACT_APP_MAINNET_INFURA_API, REACT_APP_RINKEBY_INFURA_API} from 'constants/index';

const POLLING_INTERVAL = 8000;
const RPC_URLS = {
  1: 'https://mainnet.infura.io/v3/34448178b25e4fbda6d80f4da62afba2',
  4: 'https://rinkeby.infura.io/v3/34448178b25e4fbda6d80f4da62afba2',
};

export const network = new NetworkConnector({
  urls: {1: RPC_URLS[1], 4: RPC_URLS[4]},
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
  supportedChainIds: [1, 3, 4],
});

export const trazorConnector = new TrezorConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: 'ale.s@onther.io',
  manifestAppUrl: 'https://ico2-0-frontend.vercel.app/',
});

// Fixes https://github.com/NoahZinsmeister/web3-react/issues/124
// You can close and open walletconnect at will with this fix
export let walletconnect = newWalletConnect();
export let walletlink = newWalletLink();

export const resetWalletConnect = () => {
  walletconnect = newWalletConnect();
};

export const resetWalletLink = () => {
  walletlink = newWalletLink();
};
