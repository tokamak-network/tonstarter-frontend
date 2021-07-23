import clients from '../pages/Pools/utils/clients';
import { useQuery } from '@apollo/client';
import { GET_POOL_INFO, GET_FACTORIES } from '../pages/Pools/utils/subgraph';
import { gql } from 'apollo-boost';

function useGraphQueries(network:string = 'mainnet') {
  const client = network === 'mainnet' ? clients.mainnet : clients.rinkeby;
  let resultData 
  resultData = client.query({
    query: gql`
      query GetPool {
        pools (where: {id: "0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2"}) {
          id
          token0 {id}
          token1 {id}
          ticks {
            id
            price0
            price1
          }
        }
      }
    `
  }).then(result => {
    resultData = result.data;
  })
  const poolInfo = useQuery(GET_POOL_INFO, {
    client: client,
    pollInterval: 500,
    // skip: true,
  })
  const factory = useQuery(GET_FACTORIES, {
    client: client,
    // skip: true
  })

  return {
    resultData,
    poolInfo,
    factory,
  }
}

export default useGraphQueries;