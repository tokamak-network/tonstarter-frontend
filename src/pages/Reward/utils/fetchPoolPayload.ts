import axios from "axios";
import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { Position } from "@uniswap/v3-sdk";
import { CurrencyAmount, BigintIsh } from "@uniswap/sdk-core";
import { Tokens, getPools } from "./uniswap";
import { checkLowerCaseTokenType } from "utils/token";
import { log } from "console";

export const fetchPoolPayload = async (library: any) => {
  const positionPromises = [];
  const tvl = []
  const Pools = await getPools(library)
  const positionDataList = Array.from(
    new Array(Pools.length),
    () => new Array(0)
  );

  let sw = true;
  while (sw) {
    for (const i in Pools) {
      positionPromises.push(
        axios.post(
          "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
          {
            query: `{positions(where:{pool:"${Pools[i].address}"},skip:${positionDataList[i].length},first:1000){id\nliquidity\ntickLower{tickIdx}tickUpper{tickIdx}}}`,
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
  for (const i in Pools) {
    const pool = Pools[i];
    //@ts-ignore
    let sumAmount0 = new CurrencyAmount(
      Tokens[pool.token0_index].token,
      0
    );
    //@ts-ignore
    let sumAmount1 = new CurrencyAmount(
      Tokens[pool.token1_index].token,
      0
    );

    for (const positionData of positionDataList[i]) {
      //@ts-ignore
      const positionInstance = new Position({
        pool: pool.pool,
        liquidity: Number(positionData.liquidity),
        tickLower: Number(positionData.tickLower.tickIdx),
        tickUpper: Number(positionData.tickUpper.tickIdx),
      });

      sumAmount0 = sumAmount0.add(positionInstance.amount0);
      sumAmount1 = sumAmount1.add(positionInstance.amount1);
    }
    const sumAmount0_N = new BigNumber(sumAmount0.toExact());
    const sumAmount1_N = new BigNumber(sumAmount1.toExact());
    const Token_Price = await getTokenPrice()
    const total = sumAmount0_N
      .multipliedBy(Token_Price[pool.token0_index])
      .plus(
        sumAmount1_N.multipliedBy(Token_Price[pool.token1_index])
      );
    
    tvl.push({
      pool_name: pool.name,
      pool_address: pool.address,
      token0Address: Tokens[pool.token0_index].address,
      token1Address: Tokens[pool.token1_index].address,
      sumAmount0,
      token0_usd: Token_Price[pool.token0_index],
      sumAmount1,
      token1_usd: Token_Price[pool.token1_index],
      total: Number(total.toString()),
    });
  }
  return tvl
}

const getTokenPrice = async () => {
  const promises: any = []
  let tokenPrices: any = []
  try {
    promises.push(
      axios.get("https://api.frankfurter.app/latest?from=KRW"),
      axios.get("https://api.upbit.com/v1/ticker?markets=KRW-ETH"),
      axios.get("https://api.upbit.com/v1/ticker?markets=KRW-TON"),
      axios.get("https://price-api.tokamak.network/tosprice"),
      axios.get("https://price-api.tokamak.network/docprice"),
      axios.get("https://price-api.tokamak.network/auraprice")
    );

    const prices = await Promise.all(promises);
    let KRW_USD, ETH_KRW, TON_KRW
    if (prices) {
      //@ts-ignore
      KRW_USD = prices[0].data.rates.USD;
      //@ts-ignore
      ETH_KRW = prices[1].data[0].trade_price;
      //@ts-ignore
      TON_KRW = prices[2].data[0].trade_price;
    }
    //@ts-ignore
    tokenPrices.push(
      KRW_USD * ETH_KRW,
      KRW_USD * TON_KRW,
      //@ts-ignore
      prices[3].data,
      //@ts-ignore
      prices[4].data,
      //@ts-ignore
      prices[5].data
    );

    return tokenPrices
  } catch (e) {
    console.log(e)
  }
}