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

const positionParam = `
  id
  pool {
    id
    token0 {
      id
      symbol
    }
    token1 {
      id
      symbol
    }
  }
  owner
`;

export const GET_POOL_BY_POOL_ADDRESS = gql`
  query GetPool ($address: String!) {
    pools (where: {id: $address}) {
      ${poolParam}
    }
  }
`;

export const GET_POOL1 = gql`
  query GetPool {
    pools(where: {token0_in: ["0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd"]}) {
      ${poolParam}
    }
  }`;

export const GET_POOL2 = gql`
  query GetPool {
    pools(where: {token1_in: ["0x73a54e5c054aa64c1ae7373c2b5474d8afea08bd"]}) {
      ${poolParam}
    }
  }`;

export const GET_POOL3 = gql`
query GetPool {
  pools(where: {id: "0xfffcd9c7d2ab23c064d547387fce7e938fa3124b"}) {
    ${poolParam}
  }
}`;

export const GET_POSITION = gql`
  query GetPosition($address: String!) {
    positions(where: {owner: $address}) {
      ${positionParam}
    }
  }
`
export const GET_POSITION_BY_ID = gql`
  query GetPosition($address: [String!]) {
    positions(where: {id_in: $address}) {
      ${positionParam}
    }
  }
`

export const GET_POSITION1 = gql`
  query GetPosition {
    positions(where: {owner: "0xf30eadcdc68f9551fe943a685c23fa07fde4b417"}) {
      ${positionParam}
    }
  }
`

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
// 0xfffcd9c7d2ab23c064d547387fce7e938fa3124b

// {
//   pools(where: {token1_in: ["0xc4a11aaf6ea915ed7ac194161d2fc9384f15bff2"]}) {
//     id
//     createdAtBlockNumber
//     token0 {
//       id
//     }
//     token1 {
//       id
//     }
//     totalValueLockedToken0
//     totalValueLockedToken1
//     liquidityProviderCount
//     poolDayData {
//       id
//       date
//       volumeUSD
//       feesUSD
//     }
//   }
// }


