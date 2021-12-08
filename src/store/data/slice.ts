import { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { createApi } from '@reduxjs/toolkit/query/react'
import { DocumentNode } from 'graphql'
import { ClientError, gql, GraphQLClient } from 'graphql-request'
import {REACT_APP_MODE} from 'constants/index';

// List of supported subgraphs. Note that the app currently only support one active subgraph at a time
const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  4: 'https://api.thegraph.com/subgraphs/name/cd4761/uniswap-v3-rinkeby',
}

export const api = createApi({
  reducerPath: 'dataApi',
  baseQuery: graphqlRequestBaseQuery(),
  endpoints: (builder) => ({
    allV3Ticks: builder.query({
      query: ({ poolAddress, skip = 0 }) => ({
        document: gql`
          query allV3Ticks($poolAddress: String!, $skip: Int!) {
            ticks(first: 1000, skip: $skip, where: { poolAddress: $poolAddress }, orderBy: tickIdx) {
              tickIdx
              liquidityNet
              price0
              price1
            }
          }
        `,
        variables: {
          poolAddress,
          skip,
        },
      }),
    }),
    poolByUser: builder.query({
      query: ({ address }) => ({
        document: gql`
          query poolByUser($address: ID!) {
            pools(where: { id: $address }, first: 1000) {
              id
              feeTier
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
                tvlUSD
              }
              liquidity
              tick
            }
          }
        `,
        variables: {
          address,
        },
      }),
    }),
    poolByArray: builder.query({
      query: ({ address }) => ({
        document: gql`
          query poolByArray($address: [ID!]) {
            pools(where: { id_in: $address }, first: 1000) {
              id
              feeTier
              liquidity
              tick
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
                tvlUSD
              }
              liquidity
              tick
            }
          }
        `,
        variables: {
          address,
        },
      }),
    }),
    positionByUser: builder.query({
      query: ({ address }) => ({
        document: gql`
          query positionByUser($address: Bytes!) {
            positions(where: {owner: $address}, first: 1000) {
              id
              pool {
                id
                feeTier
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
            }
          }
        `,
        variables: {
          address,
        },
      })
    }),
    positionByContract: builder.query({
      query: ({ id }) => ({
        document: gql`
          query positionByContract($id: [ID!]) {
            positions(where: {id_in: $id}, first: 1000) {
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
            }
          }
        `,
        variables: {
          id,
        },
      })
    }),
    positionByPool: builder.query({
      query: ({ pool_id }) => ({
        document: gql`
          query positionByPool($pool_id: [String!]) {
            positions(where: {pool_in: $pool_id}, first: 1000) {
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
            }
          }
        `,
        variables: {
          pool_id,
        },
      })
    }),
    feeTierDistribution: builder.query({
      query: ({ token0, token1 }) => ({
        document: gql`
          query feeTierDistribution($token0: String!, $token1: String!) {
            _meta {
              block {
                number
              }
            }
            asToken0: pools(
              orderBy: totalValueLockedToken0
              orderDirection: desc
              where: { token0: $token0, token1: $token1 }
            ) {
              feeTier
              totalValueLockedToken0
              totalValueLockedToken1
            }
            asToken1: pools(
              orderBy: totalValueLockedToken0
              orderDirection: desc
              where: { token0: $token1, token1: $token0 }
            ) {
              feeTier
              totalValueLockedToken0
              totalValueLockedToken1
            }
          }
        `,
        variables: {
          token0,
          token1,
        },
      }),
    }),
  }),
})

// Graphql query client wrapper that builds a dynamic url based on chain id
function graphqlRequestBaseQuery(): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  Pick<ClientError, 'name' | 'message' | 'stack'>,
  Partial<Pick<ClientError, 'request' | 'response'>>
> {
  return async ({ document, variables }, { getState }: BaseQueryApi) => {
    try {
      const chainId = REACT_APP_MODE === 'DEV' ? 4 : 1

      const subgraphUrl = chainId ? CHAIN_SUBGRAPH_URL[chainId] : undefined
      if (!subgraphUrl) {
        return {
          error: {
            name: 'UnsupportedChainId',
            message: `Subgraph queries against ChainId ${chainId} are not supported.`,
            stack: '',
          },
        }
      }

      return { data: await new GraphQLClient(subgraphUrl).request(document, variables), meta: {} }
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error
        return { error: { name, message, stack }, meta: { request, response } }
      }
      throw error
    }
  }
}
