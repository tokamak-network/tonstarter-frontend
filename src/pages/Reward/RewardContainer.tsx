import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
    Text,
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

  export const RewardContainer: FC<RewardContainerProps> =({
    pools }) =>{

      useEffect (()=> {
        console.log(pools);
        
      },[])
        return (
          <Flex  justifyContent={'space-between'}>
            <Flex mt={'30px'} flexWrap={'wrap'}>
               { pools.map((pool, index) => (
                 <RewardProgramCard name={pool.poolName} />
               ))
                
                }
             
            </Flex>
            <Flex>
              <ClaimReward/>
              </Flex>
            </Flex>
        )
  }