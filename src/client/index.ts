import {ApolloClient, InMemoryCache} from '@apollo/client';
import {REACT_APP_MODE} from 'constants/index';

const mainnetClient = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/db01f464b71f01a5177df9213afa4126/subgraphs/id/0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2',
  cache: new InMemoryCache({}) as any,
});

const rinkebyClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/cd4761/uniswap-v3-rinkeby',
  cache: new InMemoryCache({}) as any,
});

export const client = REACT_APP_MODE === 'DEV' ? rinkebyClient : mainnetClient;
