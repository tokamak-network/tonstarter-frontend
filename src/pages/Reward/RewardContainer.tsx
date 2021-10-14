import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
    Text,
    Grid,
    Flex,
    Select,
    Box,
    useColorMode,
  } from '@chakra-ui/react';
  import {useAppSelector} from 'hooks/useRedux';
  import {getPoolName} from '../../utils/token';
  import {ClaimReward} from './components/ClaimReward';
  import { RewardProgramCard } from './components/RewardProgramCard';
  import {
    chakra,
    // useTheme
  } from '@chakra-ui/react';

  type RewardContainerProps = {
      pools: any[];
  };
  type Reward = {
    chainId: Number, 
    poolName: String,
    token1Address: string;
    token2Address: string;
    poolAddress: String,
    rewardToken: String,
    incentiveKey: Object,
    startTime: Number,
    endTime: Number,
    allocatedReward: String,
    numStakers: Number,
    status: String
}
  export const RewardContainer: FC<RewardContainerProps> =({
    pools }) =>{

      useEffect (()=> {
        console.log(pools);
        
      },[])
        return (
          <Flex  justifyContent={'space-between'} mb='100px'>
            <Flex mt={'30px'} flexWrap={'wrap'}>
            <Grid templateColumns="repeat(2, 1fr)" gap={30}>
               { pools.map((pool, index) => {
                 const rewardProps = {
                  chainId: pool.chainId,
                  poolName: pool.poolName,
                  token1Address: '0x0000000000000000000000000000000000000000',
                  token2Address: '0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd',
                  poolAddress: pool.poolAddress,
                  rewardToken: pool.rewardToken,
                  incentiveKey: pool.incentiveKey,
                  startTime: pool.startTime,
                  endTime: pool.endTime,
                  allocatedReward: pool.allocatedReward,
                  numStakers: pool.numStakers,
                  status: pool.status
                 };
                 return (
                  <RewardProgramCard reward={rewardProps} />
                 )
               }
                
               )
                
                }
             </Grid>
            </Flex>
            <Flex>
              <ClaimReward/>
              </Flex>
            </Flex>
        )
  }