import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {ChakraProvider, ColorModeScript} from '@chakra-ui/react';
import {createWeb3ReactRoot, Web3ReactProvider} from '@web3-react/core';

import theme from 'theme';
import store from 'store';
import {NetworkContextName} from 'constants/index';
import {Router} from 'pages/Router';

import reportWebVitals from './reportWebVitals';
import {getLibrary} from 'utils';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ColorModeScript />
        <Provider store={store}>
          <ChakraProvider resetCSS theme={theme}>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </ChakraProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
