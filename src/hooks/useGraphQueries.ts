import clients from '../pages/Pools/utils/clients';
import { useQuery } from '@apollo/client';
import { GET_POOL_INFO, GET_FACTORIES } from '../pages/Pools/utils/subgraph';

function useGraphQueries(network:string = 'mainnet') {
  const client = network === 'mainnet' ? clients.mainnet : clients.rinkeby;
  const poolInfo = useQuery(GET_POOL_INFO, {
    client: client,
    // skip: true,
  })
  const factory = useQuery(GET_FACTORIES, {
    client: client,
    // skip: true
  })

  return {
    poolInfo,
    factory,
  }
}

export default useGraphQueries;