import {Contract} from '@ethersproject/contracts';
import axios from "axios";
import { Token } from "@uniswap/sdk-core";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Pool } from "@uniswap/v3-sdk";

export const Tokens = [
  {
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token: new Token(
      1,
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      18,
      "WETH",
      "Wrapped Ether"
    ),
  },
  {
    address: "0xc4a11aaf6ea915ed7ac194161d2fc9384f15bff2",
    token: new Token(
      1,
      "0xc4a11aaf6ea915ed7ac194161d2fc9384f15bff2",
      27,
      "WTON",
      "Wrapped TON"
    ),
  },
  {
    address: "0x409c4d8cd5d2924b9bc5509230d16a61289c8153",
    token: new Token(
      1,
      "0x409c4d8cd5d2924b9bc5509230d16a61289c8153",
      18,
      "TOS",
      "TONStarter"
    ),
  },
  {
    address: "0x0e498afce58de8651b983f136256fa3b8d9703bc",
    token: new Token(
      1,
      "0x0e498afce58de8651b983f136256fa3b8d9703bc",
      18,
      "DOC",
      "Dooropen"
    ),
  },
  {
    address: "0xaec59e5b4f8dbf513e260500ea96eba173f74149",
    token : new Token(
      1,
      "0xaec59e5b4f8dbf513e260500ea96eba173f74149",
      18,
      "AURA",
      "AURA"
    ),
  },
]
  

export const Pools = [
  {
    name: "WETH/WTON",
    address: "0xc29271e3a68a7647fd1399298ef18feca3879f59",
    token0_index: 0,
    token1_index: 1,
    pool: Pool.prototype,
  },
  {
    name: "TOS/ETH",
    address: "0x2ad99c938471770da0cd60e08eaf29ebff67a92a",
    token0_index: 2,
    token1_index: 0,
    pool: Pool.prototype,
  },
  {
    name: "TOS/WTON",
    address: "0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4",
    token0_index: 2,
    token1_index: 1,
    pool: Pool.prototype,
  },
  {
    name: "TOS/AURA",
    address: "0xbddd3a50bd2afd27aed05cc9fe1c8d67fcaa3218",
    token0_index: 2,
    token1_index: 4,
    pool: Pool.prototype,
  },
  {
    name: "DOC/WETH",
    address: "0xda3cc73170aa5bb7c0a9588e7690299df568d53d",
    token0_index: 3,
    token1_index: 0,
    pool: Pool.prototype,
  },
  {
    name: "DOC/TOS",
    address: "0x369bca127b8858108536b71528ab3befa1deb6fc",
    token0_index: 3,
    token1_index: 2,
    pool: Pool.prototype,
  },
]

export const getPools = async (library: any) => {
  const promises = [];
  for (const v of Pools) {
    const poolContract = new Contract(
      v.address,
      UniswapV3Pool.abi,
      library
    );

    const slot0 = await poolContract.slot0()
    const fee = await poolContract.fee()
    const liquidity = await poolContract.liquidity()
    
    v.pool = new Pool(
      Tokens[v.token0_index].token,
      Tokens[v.token1_index].token,
      fee,
      slot0.sqrtPriceX96.toString(),
      liquidity.toString(),
      slot0.tick
    )
    
  }

  return Pools;
}