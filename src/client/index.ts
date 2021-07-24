import {ApolloClient, InMemoryCache} from '@apollo/client';
import {REACT_APP_MODE} from 'constants/index';

const mainnetClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  cache: new InMemoryCache({}) as any,
});

const rinkebyClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/cd4761/uniswap-v3-rinkeby',
  cache: new InMemoryCache({}) as any,
});

export const client = REACT_APP_MODE === 'DEV' ? rinkebyClient : mainnetClient;
