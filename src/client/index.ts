import {ApolloClient, InMemoryCache} from '@apollo/client';
import {REACT_APP_MODE} from 'constants/index';

const mainnetClient = new ApolloClient({
  uri: 'https://gateway.thegraph.com/api/2d8d6a5aa89e0f7f36516c40797c9584/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV',
  cache: new InMemoryCache({}) as any,
});

const rinkebyClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/cd4761/uniswap-v3-rinkeby',
  cache: new InMemoryCache({}) as any,
});

export const client = REACT_APP_MODE === 'DEV' ? rinkebyClient : mainnetClient;
