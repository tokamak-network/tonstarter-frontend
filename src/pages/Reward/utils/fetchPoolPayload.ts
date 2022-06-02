import axios from "axios";
import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { Position } from "@uniswap/v3-sdk";
import { CurrencyAmount, BigintIsh } from "@uniswap/sdk-core";
// import { Tokens, getPools } from "./uniswap";
import { checkLowerCaseTokenType } from "utils/token";
import { log } from "console";
import views from "../rewards";
import {Contract} from '@ethersproject/contracts';
import { Token } from "@uniswap/sdk-core";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Pool } from "@uniswap/v3-sdk";


export const fetchPoolPayload = async (library: any) => {
  const positionPromises = [];
  const tvl: any = []
  const Pools = await views.getPoolDataWithoutReward()
  const Tokens = await views.getTokensData()
  
  if (Pools) {
    const positionDataList = Array.from(
      new Array(Pools.length),
      () => new Array(0)
    );

  
    console.log(Pools[0])

    let sw = true;
    while (sw) {
      for (const i in Pools) {
        console.log(positionDataList[i].length)
        positionPromises.push(
          axios.post(
            "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
            {
              query: `{positions(where:{pool:"${Pools[i].poolAddress}"},skip:${positionDataList[i].length},first:1000){id\nliquidity\ntickLower{tickIdx}tickUpper{tickIdx}}}`,
              variables: null,
            }
          )
        );
      }
      let positionPromisesData = await Promise.all(positionPromises);
      sw = false;
      for (const i in Pools) {
        
        let before = positionDataList[i].length;
        positionDataList[i].push(
          ...positionPromisesData[i].data.data.positions
        );
        let after = positionDataList[i].length;

      if (positionDataList[i].length % 1000 === 0 && after - before !== 0) {
          sw = true;
          break;
        }
      }
    }
    console.log(Tokens)
    for (const i in Pools) {
      const pool = Pools[i];
      console.log(pool)
      const poolContract = new Contract(
        pool.poolAddress,
        UniswapV3Pool.abi,
        library
      );

      const slot0 = await poolContract.slot0()
      const fee = await poolContract.fee()
      const liquidity = await poolContract.liquidity()

      const token0 = Tokens?.find(t => t.tokenAddress.toLowerCase() === pool.token0Address.toLowerCase())
      const token1 = Tokens?.find(t => t.tokenAddress.toLowerCase() === pool.token1Address.toLowerCase())
      if (token0 && token1) {
        const Token0 = new Token(
          1,
          token0.token.address,
          token0.token.decimals,
          token0.token.symbol,
          token0.token.name
        )

        const Token1 = new Token(
          1,
          token1.token.address,
          token1.token.decimals,
          token1.token.symbol,
          token1.token.name
        )
        const poolObject = new Pool(
          Token0,
          Token1,
          fee,
          slot0.sqrtPriceX96.toString(),
          liquidity.toString(),
          slot0.tick
        )
         
        // @ts-ignore
        let sumAmount0 = new CurrencyAmount(
          Token0,
          0
        );
        //@ts-ignore
        let sumAmount1 = new CurrencyAmount(
          Token1,
          0
        );

        for (const positionData of positionDataList[i]) {
          //@ts-ignore
          const positionInstance = new Position({
            pool: poolObject,
            liquidity: Number(positionData.liquidity),
            tickLower: Number(positionData.tickLower.tickIdx),
            tickUpper: Number(positionData.tickUpper.tickIdx),
          });

          sumAmount0 = sumAmount0.add(positionInstance.amount0);
          sumAmount1 = sumAmount1.add(positionInstance.amount1);
        }
        const sumAmount0_N = new BigNumber(sumAmount0.toExact());
        const sumAmount1_N = new BigNumber(sumAmount1.toExact());
        // const Token_Price = await getTokenPrice()
        console.log(pool.token0Price)
        const total = sumAmount0_N
          .multipliedBy(pool.token0Price)
          .plus(
            sumAmount1_N.multipliedBy(pool.token1Price)
          );

        tvl.push({
          pool_name: pool.poolName,
          pool_address: pool.poolAddress,
          token0Address: token0?.tokenAddress,
          token1Address: token1?.tokenAddress,
          sumAmount0,
          token0_usd: pool.token0Price,
          sumAmount1,
          token1_usd: pool.token1Price,
          total: Number(total.toString()),
        });
      }
      return tvl
    }
    
  }
}
  // }

  // const getTokenPrice = async () => {
  //   const promises: any = []
  //   let tokenPrices: any = []
  //   try {
  //     promises.push(
  //       axios.get("https://api.frankfurter.app/latest?from=KRW"),
  //       axios.get("https://api.upbit.com/v1/ticker?markets=KRW-ETH"),
  //       axios.get("https://api.upbit.com/v1/ticker?markets=KRW-TON"),
  //       axios.get("https://price-api.tokamak.network/tosprice"),
  //       axios.get("https://price-api.tokamak.network/docprice"),
  //       axios.get("https://price-api.tokamak.network/auraprice")
  //     );

  //     const prices = await Promise.all(promises);
  //     let KRW_USD, ETH_KRW, TON_KRW
  //     if (prices) {
  //       //@ts-ignore
  //       KRW_USD = prices[0].data.rates.USD;
  //       //@ts-ignore
  //       ETH_KRW = prices[1].data[0].trade_price;
  //       //@ts-ignore
  //       TON_KRW = prices[2].data[0].trade_price;
  //     }
  //     //@ts-ignore
  //     tokenPrices.push(
  //       KRW_USD * ETH_KRW,
  //       KRW_USD * TON_KRW,
  //       //@ts-ignore
  //       prices[3].data,
  //       //@ts-ignore
  //       prices[4].data,
  //       //@ts-ignore
  //       prices[5].data
  //     );

  //     return tokenPrices
  //   } catch (e) {
  //     console.log(e)
  //   }
