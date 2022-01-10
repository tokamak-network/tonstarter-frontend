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
  hourData {
    id
    date
    volumeUSD
    feesUSD
    tvlUSD
  }
  liquidity
  tick
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

export const GET_TOS_POOL = gql`
  query GetPool($address: [String!]) {
    pools(where: {token0_in: $address}) {
      ${poolParam}
    }
  }`;

export const GET_TICKS = gql`
  query allTicks($poolAddress: String!, $skip: Int!) {
    ticks(first: 1000, skip: $skip, where: { poolAddress: $poolAddress }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
      price0
      price1
    }
  }
`

export const GET_BASE_POOL = gql`
  query GetPool($address: String!) {
    pools(where: {id: $address}) {
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
  query GetPositionByID($id: [String!]) {
    positions(where: {id_in: $id}) {
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

export const GET_POSITION2 = gql`
  query GetPosition {
    positions(where: {id_in: ["3853", "3875"]}) {
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
