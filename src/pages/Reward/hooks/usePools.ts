import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Pool } from '@uniswap/v3-sdk';
import { useActiveWeb3React } from 'hooks/useWeb3';
import { Pools, Tokens } from "../utils/uniswap";
import { useEffect, useState } from 'react';
import {Contract} from '@ethersproject/contracts';
import views from "../rewards";



export const usePools = () => {
  const { library } = useActiveWeb3React()
  const [pool, setPool] = useState(Pools)
  const [liquidity, setLiquidity] = useState<any>();
  const [slot0, setSlot0] = useState<any>();
  const [fee, setFee] = useState<any>();

  useEffect(() => {
    async function getPools() {   
      const poolsData: any = await views.getPoolData(library);
      
      const promises = []
      for (const v of poolsData) {
        const poolContract = new Contract(
          v.poolAddress,
          UniswapV3Pool.abi,
          library
        );
        const liquiditys = await poolContract.liquidity()
        const slot0s = await poolContract.slot0()
        const fees = await poolContract.fee()

        setLiquidity(liquiditys);
        setSlot0(slot0s);
        setFee(fees)
        v.pool = 
          slot0 && liquidity && fee
            ? new Pool(
              Tokens[v.token0_index].token,
              Tokens[v.token1_index].token,
              fee,
              slot0?.sqrtPriceX96.toString(),
              liquidity,
              slot0?.tick
            ) : Pool.prototype

        promises.push(v)
      }
      setPool(Pools)
    }
    getPools()
  }, [])

  return pool
}