import {gql} from '@apollo/client';

const poolParam = `
  id
  token0 {
    id
    symbol
  }
  token1 {
    id
    symbol
  }
  poolDayData {
    id
    date
    volumeUSD
    feesUSD
  }
  liquidity
`;

export const GET_POOL1 = gql`
  query GetPool {
    pools(where: {id: "0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2"}) {
      ${poolParam}
    }
  }`;

export const GET_POOL2 = gql`
  query GetPool {
    pools(where: {id: "0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf"}) {
      ${poolParam}
    }
  }`;

export const GET_TOKEN = gql`
  query GetToken {
    tokens(where: {id: "0xc778417e063141139fce010982780140aa0cd5ab"}) {
      id
      poolCount
      whitelistPools {
        id
      }
    }
  }
`

// export const GET_POOL = gql`{
//   query GetPool {
//     pools (where: {id: "0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2"}) {
//       ${poolParam}
//     }
//   }
// }`;

// export const GET_POSITION = gql`{
//   query GetPosition($address: String!) {
//     positions(where: {owner: $address}) {
//       id
//       pool {
//         id
//         token0 {
//           id
//         }
//         token1 {
//           id
//         }
//       }
//       owner
//     }
//   }
// }`

export const GET_FACTORIES = gql`
  query GetFactory {
    factories(first: 5) {
      id
      poolCount
    }
  }
`;
// 0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf
// 0xb7ce38cc28e199adcd8dfa5c89fe03d3e8d267f2

// query pools(where: {id:"0x7b2a5f8956ff62b26ac87f22165f75185e2ad639"}) {
