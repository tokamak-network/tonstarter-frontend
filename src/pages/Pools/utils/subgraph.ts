import { gql } from 'apollo-boost';

const poolParam = `
  id
  createdAtBlockNumber
  token0 {id}
  token1 {id}
  ticks {
    id
    price0
    price1
  }
`;
export const GET_POOL_INFO = gql`{
  query GetPool {
    pools (where: {id: "0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2"}) {
      ${poolParam}
    }
  }
}`

export const GET_FACTORIES = gql`
  query GetFactory {
    factories (first:5) {
      id
      poolCount
    }
  }
`
// 0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf
// 0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2

  // query pools(where: {id:"0x7b2a5f8956ff62b26ac87f22165f75185e2ad639"}) {